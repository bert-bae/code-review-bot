export abstract class DynamoDBModel<TEntity> {
  protected abstract create(entity: TEntity): Promise<TEntity>;

  protected abstract getOne(keys: any): Promise<TEntity>;

  protected abstract query(queryKey: string, value: string): Promise<TEntity>;

  protected abstract updateOne(keys: any, update: TEntity): Promise<TEntity>;
}
