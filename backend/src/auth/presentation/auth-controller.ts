import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';

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
  constructor(private jwtService: JwtService) {}

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
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect('http://localhost:5173/dashboard');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
