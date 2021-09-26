import * as faker from 'faker';

export function create() {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(6),
  };
}
