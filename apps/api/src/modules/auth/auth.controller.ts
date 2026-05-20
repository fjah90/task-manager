import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, type AuthResult } from './auth.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  LoginSchema,
  RegisterSchema,
  type LoginDto,
  type RegisterDto,
} from './auth.schemas';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(
    @Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto,
  ): Promise<AuthResult> {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT' })
  login(
    @Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto,
  ): Promise<AuthResult> {
    return this.auth.login(dto);
  }
}
