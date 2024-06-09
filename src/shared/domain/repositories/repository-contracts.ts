import { Entity } from '../entities/entity';

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<E>;
  findById(id: number): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<E>;
  delete(id: number): Promise<void>;
}
