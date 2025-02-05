import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MessagesModule } from "../messages/messages.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonModule } from "src/person/person.module";
import { HealthModule } from "src/health/health.module";
import { SimpleMiddleware } from "src/common/middlewares/simple.middleware";
import env from "src/common/config/env";
import { APP_FILTER } from "@nestjs/core";
import { CustomBadRequestException } from "src/common/exceptions/custom-bad-request-exception";
import { ConfigModule } from "@nestjs/config";
import * as Joi from '@hapi/joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.required().default(3000),
        DATABASE_NAME: Joi.required(),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DATABASE.HOST,
      port: env.DATABASE.PORT,
      database: env.DATABASE.DATABASE,
      username: env.DATABASE.USERNAME,
      password: env.DATABASE.PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    HealthModule,
    MessagesModule,
    PersonModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomBadRequestException
    },
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}