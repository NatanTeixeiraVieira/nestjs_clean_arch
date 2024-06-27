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
import { UserOutput } from '../application/dtos/user-output';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter';
import { create } from 'domain';

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

  private static userToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }

  private static listUsersToResponse(output: ListUsers.Output) {
    return new UserCollectionPresenter(output);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @Post(`login`)
  async login(@Body() signupDto: SigninDto) {
    const output = await this.signinUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.listUsersToResponse(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    });
    return UsersController.userToResponse(output);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
