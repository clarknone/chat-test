import { Controller, Post, Body, UseGuards, Get, Put } from '@nestjs/common';
import { GetAuthUser } from 'src/helper/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/helper/guard/user.guard';
import { IAuthUser } from 'src/helper/interfaces/auth/auth.interface';
import { AuthService } from './auth.service';
import { EditProfileDto, SignInDto, SignUpDto } from './dto/create-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignUpDto): Promise<IAuthUser> {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(@Body() data: SignInDto): Promise<IAuthUser> {
    return this.authService.signin(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@GetAuthUser() user: IAuthUser): Promise<IAuthUser> {
    return this.authService.profile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  editProfile(
    @GetAuthUser() user: IAuthUser,
    @Body() data: EditProfileDto,
  ): Promise<IAuthUser> {
    return this.authService.editProfile(user, data);
  }
}
