import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetAuthUser } from 'src/helper/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/helper/guard/user.guard';
import { IAuthUser } from 'src/helper/interfaces/auth/auth.interface';
import { AuthService } from './auth.service';
import { EditProfileDto, SignInDto, SignUpDto } from './dto/create-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

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

  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async editProfile(
    @GetAuthUser() user: IAuthUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: EditProfileDto,
  ): Promise<IAuthUser> {
    if (file) {
      try {
        const response = await this.cloudinaryService.uploadImage(file);
        data.avatar = response.secure_url || '';
      } catch (e) {}
    }
    return this.authService.editProfile(user, data);
  }
}
