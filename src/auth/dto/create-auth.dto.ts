export class CreateAuthDto {}

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    fullname: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

  
    @IsNotEmpty()
    @IsString()
    password: string;
  }
  
export class EditProfileDto {
    @IsNotEmpty()
    @IsString()
    fullname: string;
  }
  
  export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  }
  