import { UserDocument } from './user.schema';
import { CreateUserData } from './types/user.types';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findByEmailWithPasswordHash(email: string): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  findByIdWithRefreshTokenHash(id: string): Promise<UserDocument | null>;
  updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void>;
}
