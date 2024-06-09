import { Entity } from '../../entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('Should set props and id', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const entity = new StubEntity(props, 1);

    expect(entity.props).toStrictEqual(props);
    expect(entity.id).toBe(1);
    expect(entity._id).toBe(1);
  });
  it('Should convert a entity to json', () => {
    const props = { prop1: 'value1', prop2: 15 };
    const id = 1;
    const entity = new StubEntity(props, id);

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
    });
  });
});
