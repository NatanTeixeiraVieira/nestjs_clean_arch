export abstract class Entity<Props = unknown> {
  public readonly _id: number;
  public readonly props: Props;

  constructor(props: Props, id: number) {
    this.props = props;
    this._id = id;
  }

  get id() {
    return this._id;
  }

  toJSON(): Props & { id: number } {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
