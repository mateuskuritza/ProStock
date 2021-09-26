import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as ingredientFactory from './factories/ingredientFactory';
import * as userFactory from './factories/userFactory';
import * as productFactory from './factories/productFactory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../src/users/users.service';
import { Ingredient } from '../src/ingredients/entities/ingredient.entity';
import { Product } from '../src/products/entities/product.entity';
import { IngredientsService } from '../src/ingredients/ingredients.service';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let ingredientRepository: Repository<Ingredient>;
  let productRepository: Repository<Product>;
  let authService: AuthService;
  let userService: UsersService;
  let ingredientService: IngredientsService;
  let jwtService: JwtService;

  const userInfos = userFactory.create();
  const createdIngredientInfos = ingredientFactory.create();

  let createdIngredient: Ingredient;

  let newUser: { id: string; name: string; email: string };
  let loginUser: { access_token: string; user_id: string };

  const productInfos = productFactory.create();

  let createdProduct: {
    name: string;
    price: number;
    imageName: null;
    id: number;
  };

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
    productRepository = moduleFixture.get('ProductRepository');

    userService = new UsersService(userRepository);
    ingredientService = new IngredientsService(ingredientRepository);
    jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    });
    authService = new AuthService(userService, jwtService);

    await app.init();

    // Create and login a user
    newUser = await userService.create(userInfos);
    loginUser = await authService.login({
      ...newUser,
      password: userInfos.password,
    });

    // Create two testing ingredients
    createdIngredient = await ingredientService.create(createdIngredientInfos);
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM users');
    await ingredientRepository.query('DELETE FROM ingredients');
    await productRepository.query('DELETE FROM products');
    await app.close();
  });

  it('/products POST => Create new product without access_token', async () => {
    const result = await request(app.getHttpServer())
      .post('/products')
      .send(productInfos);

    expect(result.statusCode).toBe(401);
  });

  it('/products POST => Create new product', async () => {
    const result = await request(app.getHttpServer())
      .post('/products')
      .send(productInfos)
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    expect(result.statusCode).toBe(201);

    expect(result.body).toEqual({
      id: expect.any(Number),
      imageName: null,
      ...productInfos,
    });

    createdProduct = result.body;
  });

  it('/products/ingredient POST => Add ingredient to product', async () => {
    const result = await request(app.getHttpServer())
      .post('/products/ingredient')
      .send({
        productId: createdProduct.id,
        ingredientId: createdIngredient.id,
        ingredientUnits: createdIngredient.available + 1, // - to be unavailable product
      })
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    expect(result.statusCode).toBe(201);
  });

  it('/products GET => All products (unavailable)', async () => {
    const result = await request(app.getHttpServer())
      .get('/products')
      .send(productInfos)
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    expect(result.statusCode).toBe(200);

    expect(result.body).toEqual([
      {
        id: expect.any(Number),
        imageName: null,
        ...productInfos,
        cost: (createdIngredient.available + 1) * createdIngredient.unitPrice,
        available: false,
      },
    ]);
  });

  it('/products/ingredient POST => Update ingredient product quantity', async () => {
    const result = await request(app.getHttpServer())
      .post('/products/ingredient')
      .send({
        productId: createdProduct.id,
        ingredientId: createdIngredient.id,
        ingredientUnits: createdIngredient.available - 1, // - to be available product
      })
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    expect(result.statusCode).toBe(201);
  });

  it('/products GET => All products (available)', async () => {
    const result = await request(app.getHttpServer())
      .get('/products')
      .send(productInfos)
      .set({ Authorization: 'Bearer ' + loginUser.access_token });

    expect(result.statusCode).toBe(200);

    expect(result.body).toEqual([
      {
        id: expect.any(Number),
        imageName: null,
        ...productInfos,
        cost: (createdIngredient.available - 1) * createdIngredient.unitPrice,
        available: true, // now the product must be available
      },
    ]);
  });
});
