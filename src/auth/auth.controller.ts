/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './shared/auth.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './shared/guards/jwt.refresh-auth.guard';
import { LocalAuthGuard } from './shared/guards/local-auth.guard';


@ApiTags('Login')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }


    @Post('/login')
    @PublicRoute()
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    async auth(@Body() auth: LoginDTO) {
        return this.authService.login(auth)
    }



    @Post('/logout')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async logout(@Request() payload: any) {

        return this.authService.removeRefreshToken(payload.user.sub);
    }

    @Post('/validate')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async validate(@Request() payload: any) {

        // console.log(payload.headers.authorization.substring(7));

        return this.authService.validateToken(payload.user.sub, payload.headers.authorization.substring(7))
    }

    @Post('/refresh_token')
    @ApiBearerAuth()
    @PublicRoute()
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(@Request() payload: any) {

        return this.authService.refreshToken(payload.user.id, payload.user.refresh_token);
    }




}
