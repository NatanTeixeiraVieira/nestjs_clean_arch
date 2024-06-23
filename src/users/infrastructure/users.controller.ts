import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Signup } from '../application/usecases/signup.usecase';
import { Signin } from '../application/usecases/signin.usecase';
import { UpdateUser } from '../application/usecases/update-user.usecase';
import { UpdatePassword } from '../application/usecases/update-password.usecase';
import { DeleteUser } from '../application/usecases/delete-user.usecase';
import { ListUsers } from '../application/usecases/list-users.usecase';
import { GetUser } from '../application/usecases/get-user.usecase';
import { SigninDto } from './dtos/signin.dto';
import { ListUsersDto } from './dtos/list-users.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('users')
export class UsersController {
  @Inject(Signup.UseCase)
  private signupUseCase: Signup.UseCase;

  @Inject(Signin.UseCase)
  private signinUseCase: Signin.UseCase;

  @Inject(UpdateUser.UseCase)
  private updateUserUseCase: UpdateUser.UseCase;

  @Inject(UpdatePassword.UseCase)
  private updatePasswordUseCase: UpdatePassword.UseCase;

  @Inject(DeleteUser.UseCase)
  private deleteUserUseCase: DeleteUser.UseCase;

  @Inject(GetUser.UseCase)
  private getUserUseCase: GetUser.UseCase;

  @Inject(ListUsers.UseCase)
  private listUsersUseCase: ListUsers.UseCase;

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() signupDto: SignupDto) {
    return this.signupUseCase.execute(signupDto);
  }

  @Post(`login`)
  async login(@Body() signupDto: SigninDto) {
    return this.signinUseCase.execute(signupDto);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({ id, ...updatePasswordDto });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
