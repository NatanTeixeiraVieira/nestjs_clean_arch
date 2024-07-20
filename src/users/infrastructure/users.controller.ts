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
  UseGuards,
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
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import { AuthService } from '@/auth/infrastructure/auth.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Inject(Signup.UseCase)
  private signupUseCase: Signup.UseCase;

  @Inject(Signin.UseCase)
  private signinUseCase: Signin.UseCase;

  @Inject(UpdateUser.UseCase)
  private updateUserUseCase: UpdateUser.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

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

  @ApiResponse({
    status: 409,
    description: 'Conflito de email',
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Email não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciais inválidas',
  })
  @HttpCode(HttpStatus.OK)
  @Post(`login`)
  async login(@Body() signupDto: SigninDto) {
    const output = await this.signinUseCase.execute(signupDto);
    return this.authService.generateJwt(output.id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },

        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(UserPresenter),
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.listUsersToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Resposta de confirmação da exclusão',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
