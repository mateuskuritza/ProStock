import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as ingredientFactory from './factories/ingredientFactory';
import * as userFactory from './factories/userFactory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../src/users/users.service';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';

describe('IngredientsController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let ingredientRepository: Repository<Ingredient>;
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  const userInfos = userFactory.create();
  let newUser;
  let loginUser: { access_token: string; user_id: string };

  let ingredientId: number;

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
    ingredientRepository = moduleFixture.get('IngredientRepository');
    userService = new UsersService(userRepository);
    jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    });

    authService = new AuthService(userService, jwtService);
    await app.init();

    newUser = await userService.create(userInfos);
    loginUser = await authService.login({
      ...newUser,
      password: userInfos.password,
    });
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM users');
    await ingredientRepository.query('DELETE FROM ingredients');
    await app.close();
  });

  const newIngredient = ingredientFactory.create();

  it('/ingredients POST => Create new ingredient without access_token', async () => {
    const result = await request(app.getHttpServer())
      .post('/ingredients')
      .send(newIngredient);

    expect(result.statusCode).toBe(401);
  });

  it('/ingredients POST => Create new ingredient with access_token', async () => {
    const result = await request(app.getHttpServer())
      .post('/ingredients')
      .send(newIngredient)
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    ingredientId = result.body.id;

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual({
      ...newIngredient,
      id: expect.any(Number),
    });
  });

  it('/ingredients/:id GET => Get unique ingredient', async () => {
    const result = await request(app.getHttpServer())
      .get('/ingredients/' + ingredientId)
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      ...newIngredient,
      id: expect.any(Number),
    });
  });

  it('/ingredients GET => Get all ingredients', async () => {
    const result = await request(app.getHttpServer())
      .get('/ingredients')
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual([
      {
        ...newIngredient,
        id: expect.any(Number),
      },
    ]);
  });
});
