import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  DeleteItemCommandInput,
  DeleteItemCommand,
  DeleteItemCommandOutput,
  UpdateItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
  DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb";

type BaseDynamoDBModelConstructorInput = {
  tableName: string;
  primaryKey: string;
  secondaryIndices?: string[]; // Could include LSI as well
};

type KeyInput = {
  primaryKey: string;
  secondaryKey?: string;
};

export class BaseDynamoDBModel {
  private client: DynamoDBClient;
  private tableName: string;
  public primaryKey: string;
  public secondaryIndices?: string[];

  constructor(
    input: BaseDynamoDBModelConstructorInput,
    clientConfig?: DynamoDBClientConfig
  ) {
    this.client = new DynamoDBClient(clientConfig);
    this.tableName = input.tableName;
    this.primaryKey = input.primaryKey;
    this.secondaryIndices = input.secondaryIndices;
  }

  private send<T>(command: any) {
    return this.client.send(command);
  }

  private createKeys(input: KeyInput): Record<string, any> {
    const keys = {
      [`:${this.primaryKey}`]: { S: input.primaryKey },
    };
    if (this.secondaryIndices && input.secondaryKey) {
      const secondaryIndex = this.secondaryIndices.find(
        (val) => val === input.secondaryKey
      );
      secondaryIndex &&
        (keys[`:${secondaryIndex}`] = { S: input.secondaryKey });
    }
    return keys;
  }

  protected async get<T>(
    input: KeyInput & Omit<GetItemCommandInput, "Key" | "TableName">
  ) {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: this.createKeys(input),
    });
    const result = (await this.send(command)) as GetItemCommandOutput;
    return result.Item;
  }

  protected async create<T>(
    input: KeyInput & Omit<PutItemCommandInput, "Key" | "TableName">
  ) {
    const command = new PutItemCommand({
      ...input,
      TableName: this.tableName,
      Item: {
        ...this.createKeys(input),
        ...input.Item,
      },
    });
    const result = (await this.send(command)) as PutItemCommandOutput;
    return result.Attributes;
  }

  protected async update<T>(
    input: KeyInput & Omit<UpdateItemCommandInput, "Key" | "TableName">
  ) {
    const command = new UpdateItemCommand({
      ...input,
      TableName: this.tableName,
      Key: this.createKeys(input),
    });
    const result = (await this.send(command)) as UpdateItemCommandOutput;
    return result.Attributes;
  }

  protected async delete<T>(
    input: KeyInput & Omit<DeleteItemCommandInput, "Key" | "TableName">
  ) {
    const command = new DeleteItemCommand({
      ...input,
      TableName: this.tableName,
      Key: this.createKeys(input),
    });
    const result = (await this.send(command)) as DeleteItemCommandOutput;
    return result.Attributes;
  }
}
