import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as userFactory from './factories/userFactory';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// Acabei me batendo bastante por nunca ter feito testes no NestJS, acabei deixando alguns testes dependendo um do outro e provavelmente fiz o contrário de muitas boas práticas :( kkkkkk
// Todas as rotas de produtos e ingredientes estão com o JwtAuthGuard, acabei fazendo só 1 teste em cada "describe" sobre a autenticação para não ficar repetitivo

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL_TEST,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    userRepository = moduleFixture.get('UserRepository');

    await app.init();
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM users');
    await app.close();
  });

  const newUser = userFactory.create();

  it('/users/register POST => Create new user', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/register')
      .send(newUser);

    expect(result.statusCode).toBe(201);

    expect(result.body).toEqual({
      id: expect.any(String),
      name: newUser.name,
      email: newUser.email,
    });
  });

  it('/users/login POST => Not authorized (401) if invalid user password', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: newUser.email,
        password: 'fakePassword',
      });

    expect(result.statusCode).toBe(401);
  });

  it('/users/login POST => Not authorized (401) if invalid user email', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'fakeEmail',
        password: newUser.password,
      });

    expect(result.statusCode).toBe(401);
  });

  it('/users/login POST => Success login if valid email and password', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: newUser.email,
        password: newUser.password,
      });

    expect(result.statusCode).toBe(201);

    expect(result.body).toEqual({
      user_id: expect.any(String),
      access_token: expect.any(String),
    });
  });
});
