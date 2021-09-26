import * as faker from 'faker';

export function create() {
  return {
    name: faker.name.findName(),
    price: faker.datatype.number(),
  };
}
