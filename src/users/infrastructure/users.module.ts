import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Signup } from '../application/usecases/signup.usecase';
import { UserInMemoryRepository } from './database/in-memory/reporitories/user-in-memory.repository';
import { BcryptHashProvider } from './providers/hash-provider/bcryptjs-hash.provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { Signin } from '../application/usecases/signin.usecase';
import { GetUser } from '../application/usecases/get-user.usecase';
import { ListUsers } from '../application/usecases/list-users.usecase';
import { UpdateUser } from '../application/usecases/update-user.usecase';
import { UpdatePassword } from '../application/usecases/update-password.usecase';
import { DeleteUser } from '../application/usecases/delete-user.usecase';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    { provide: 'HashProvider', useClass: BcryptHashProvider },
    {
      provide: Signup.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new Signup.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: Signin.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new Signin.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUser.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUser.UseCase(userRepository);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: ListUsers.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsers.UseCase(userRepository);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: UpdateUser.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new UpdateUser.UseCase(userRepository);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: UpdatePassword.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new UpdatePassword.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUser.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DeleteUser.UseCase(userRepository);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
  ],
})
export class UsersModule {}
