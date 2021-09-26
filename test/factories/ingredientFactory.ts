import * as faker from 'faker';

export function create() {
  return {
    name: faker.name.findName(),
    unitType: faker.name.firstName(),
    unitPrice: faker.datatype.number(),
    available: faker.datatype.number(),
  };
}
