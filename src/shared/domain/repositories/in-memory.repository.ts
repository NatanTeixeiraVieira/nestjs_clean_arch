import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contracts';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<E> {
    this.items.push(entity);
    return entity;
  }

  async findById(id: number): Promise<E> {
    return this._get(id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<E> {
    await this._get(entity.id);
    const index = this.items.findIndex((item) => item.id === entity.id);
    this.items[index] = entity;

    return entity;
  }

  async delete(id: number): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    this.items.splice(index, 1);
  }

  protected async _get(id: number): Promise<E> {
    const entity = this.items.find((item) => item.id === id);
    if (!entity) throw new Error('Entity not found');
    return entity;
  }
}
