AI Usage and Development Notes

Overview

AI tools were used throughout this project as a development assistant for planning, boilerplate generation, code review, and test generation.

Guidelines

When using AI-generated code, I reviewed it to ensure:

- Correct TypeScript types
- Clear separation of responsibilities
- Appropriate validation
- Security considerations
- Consistency with the existing project architecture
- No unnecessary coupling between application layers




**What Worked Well**

1-project setup and boilerplate code generation

  AI was used to help identify and install the initial backend dependencies

  It was also useful for generating the initial NestJS boilerplate and project structure
 
  The generated starting point accelerated the setup phase and provided a reasonable foundation for the application.

2- Database Configuration Refactoring

  The initial generated structure placed too much configuration logic close to the main application setup

  module/folder.

  This resulted in a clearer separation between:

  application bootstrapping
  environment configuration
  database configuration

  This refactoring improved readability and made the application structure easier to maintain

3- Authentication Module Planning

  Instead of directly asking it to generate the complete implementation, I used it to create an implementation plan covering:

  
  user registration
  password hashing
  JWT access tokens 
  refresh tokens
  refresh token rotation
  token revocation
  authentication guards
  repository structure

  The plan was then reviewed before implementation.

  This approach worked better than directly generating the entire module because architectural issues could be identified before writing a large amount of code.



4- UI Reusability and Avoiding Unnecessary Abstractions
   
   ai was used to review the frontend component structure and identigy repeated UI patterns 

   The initial implementation contained some repeated markup and styling across authentication screens. These patterns were reviewed and reusable UI components were extracted where appropriate

5- Client integration Authentication Architecture and Token Handling

  AI was useful in planning the frontend authentication flow, including:

  Axios request and response interceptors
  storing the access token in Zustand memory
  using an HttpOnly cookie for the refresh token
  automatic token refresh
  retrying failed requests after refreshing the access token
  restoring the user session after a page refresh
  protecting authenticated and public routes
  single-flight token refresh

  The implementation plan was reviewed and refined before implementation to ensure clear separation of responsibilities between the API layer, Zustand store, Axios infrastructure, and React authentication hooks.

**Where AI Output Required Review**

1- Repository Layer Accepted an API DTO

  One issue in the initial authentication plan was that the repository layer accepted SignupDto directly

  For example, the generated design suggested a flow where an API-specific DTO could be passed into the persistence layer.

  Ideally, the repository should only work with internal data structures, and mapping should occur at the service layer boundaries.

  This issue was addressed during implementation by introducing proper mapping at the service layer and ensuring the repository interacted with internal domain models.

  and this follows the clean architecture principle where repository layer should be unaware of API DTOs.

2. Database lookups were suggested during token validation

  I another point that required architectural review was the suggestion to perform database lookups during token validation

  for most protected endpoints, the jwt guard only needs to 
  1-extract the token
  2-verify its signature and expiration
  3-read the authenticated user's identifier from the token payload 

  this can be done without querying the database.

3. Environment Validation Was Missing

   This was identified during review and fixed by adding environment validation.

   The application now validates required environment variables during startup, preventing the application from running with missing or invalid configuration.

   This was an important improvement because configuration problems should fail early rather than causing unexpected runtime errors.

4- logger was initially configured directly in the app module 

  The initial implementation configured the logger directly inside AppModule.

  While functional, this made the main application module more crowded.

  I refactored the logger configuration into a dedicated module.

  This resulted in a clearer application structure where logging configuration is isolated from the main application composition. 


5- Refresh Token Cookie Configuration Required Additional Review
  
   The generated authentication plan did not initially account for environment-specific cookie configuration.

   The refresh token cookie configuration needed to behave differently depending on the environment.

   For example, the configuration needed to consider:
    httpOnly
    secure
    sameSite
    development vs production behavior

   This was reviewed and updated so that cookie settings are environment-aware rather than using the same configuration in every environment.


6- Current User Decorator Placement


  The initial file structure placed the CurrentUser decorator inside the authentication module

  After reviewing the responsibility of the decorator, I moved it to the shared/common layer

  The decorator is not specific to authentication business logic It is a reusable utility that can be used by any module that needs access to the authenticated user













In most of the cases, the generated code was functional but sometimes it  requires architectural improvements.
Examples included:

preventing API DTOs from leaking into the repository layer
avoiding unnecessary database queries during JWT validation
adding environment validation
improving module separation
handling environment-specific cookie configuration
placing reusable utilities in the appropriate shared layer

Overall, AI significantly accelerated development, but reviewing the generated output was necessary to ensure that the final implementation followed the intended architecture, security considerations, and separation of responsibilities.



