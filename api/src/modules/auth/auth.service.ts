import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../users/user.repository.interface';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<Tokens> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    const tokens = await this.generateTokens(user._id.toString(), user.email);
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    this.logger.log(`User registered successfully: ${user.email}`);
    return tokens;
  }

  async signin(dto: SigninDto): Promise<Tokens> {
    const user = await this.userRepo.findByEmailWithPasswordHash(dto.email);
    if (!user) {
      this.logger.warn(`Failed signin attempt for email: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      this.logger.warn(`Failed signin attempt for email: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email);
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    this.logger.log(`User signed in successfully: ${user.email}`);
    return tokens;
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userRepo.findByIdWithRefreshTokenHash(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email);
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    this.logger.log(`Tokens refreshed for user: ${userId}`);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.updateRefreshTokenHash(userId, null);
    this.logger.log(`User logged out: ${userId}`);
  }

  async generateTokens(userId: string, email: string): Promise<Tokens> {
    const accessSecret = this.configService.get<string>('jwt.accessSecret');
    const accessExpiresIn = this.configService.get<string>(
      'jwt.accessExpiresIn',
    );
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret');
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          secret: accessSecret,
          expiresIn: accessExpiresIn as unknown as number,
        },
      ),
      this.jwtService.signAsync(
        { userId, email },
        {
          secret: refreshSecret,
          expiresIn: refreshExpiresIn as unknown as number,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    if (!refreshToken) {
      await this.userRepo.updateRefreshTokenHash(userId, null);
      return;
    }
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.updateRefreshTokenHash(userId, hash);
  }
}
