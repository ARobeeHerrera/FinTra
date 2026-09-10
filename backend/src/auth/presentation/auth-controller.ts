import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { ConfigService } from '@nestjs/config';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    googleId: string;
    firstName?: string;
    lastName?: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const user = req.user;

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${this.configService.get('FRONTEND_URL')}/dashboard`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res.send({ message: 'Logged out successfully' });
  }
}
