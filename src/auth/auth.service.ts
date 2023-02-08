import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EditProfileDto, SignInDto, SignUpDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ServiceException } from 'src/helper/exceptions/service.exception';
import { IAuthUser } from 'src/helper/interfaces/auth/auth.interface';
import { extractErrorMessage } from 'src/helper/main';
import { User, UserDocument } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignUpDto): Promise<IAuthUser> {
    return this.UserSchema.find({ email: data.email })
      .then(async (users) => {
        if (users.length) {
          throw new ServiceException({ error: 'email already exist' });
        }
        const user = new this.UserSchema({ ...data });
        const password = await bcrypt.hash(user.password, 10);
        user.password = password;
        await user.save();
        return this.signUser(user);
      })
      .catch((e) => {
        throw new ServiceException({ error: extractErrorMessage(e) });
      });
  }

  async signin(data: SignInDto): Promise<IAuthUser> {
    return this.UserSchema.findOne({ email: data.email })
      .then(async (user) => {
        if (!user) {
          throw new ServiceException({ error: 'User not found' });
        }

        if (await bcrypt.compare(data.password, user.password)) {
          user.attempt = 0;
          await user.save();
          return this.signUser(user);
        }
        throw new ServiceException({ error: 'incorrect password' });
      })
      .catch((e) => {
        throw new ServiceException({ error: extractErrorMessage(e) });
      });
  }

  async editProfile(
    authUser: IAuthUser,
    data: EditProfileDto,
  ): Promise<IAuthUser> {
    return this.UserSchema.findByIdAndUpdate(authUser.id, { ...data }).select([
      'fullname',
      'avatar',
      'email',
    ])``
      .then(async (user) => {
        if (!user) {
          throw new ServiceException({ error: 'User not found' });
        }
        return user;
      })
      .catch((e) => {
        throw new ServiceException({ error: extractErrorMessage(e) });
      });
  }

  async profile(data: IAuthUser): Promise<IAuthUser> {
    return this.UserSchema.findOne({ email: data.email })
      .select(['fullname', 'avatar', 'email'])
      .then(async (user) => {
        if (!user) {
          throw new ServiceException({ error: 'User not found' });
        }
        return user;
      })
      .catch((e) => {
        throw new ServiceException({ error: extractErrorMessage(e) });
      });
  }

  async signUser(user: UserDocument): Promise<IAuthUser> {
    const token: string = this.jwtService.sign(
      {
        email: user.email,
        id: user._id,
      },
      { expiresIn: '2d' },
      // { expiresIn: '15min' },
    );

    const authUser: IAuthUser = {
      token,
      email: user.email,
      id: user._id,
      fullname: user.fullname,
    };

    return authUser;
  }
}
