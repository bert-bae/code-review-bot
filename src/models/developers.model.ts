import dynamoose from "dynamoose";
import { DynamoDBModel } from "./base-dynamodb-model";
import { DevelopersSchema } from "./schemas";
import {
  DeveloperEntity,
  DeveloperEntityKeys,
  DeveloperEntityProperties,
} from "../types";

const Model = dynamoose.model("ReviewBot_Developers", DevelopersSchema);

export class DevelopersModel extends DynamoDBModel<DeveloperEntity> {
  private model: typeof Model;

  constructor() {
    super();
    this.model = Model;
  }

  public async create(entity) {
    return this.model.create(entity) as any;
  }

  public async getOne(keys: DeveloperEntityKeys) {
    return this.model.get(keys) as any;
  }

  public async query(queryKey: string, value: string) {
    return this.model.query(queryKey).eq(value).exec() as any;
  }

  public updateOne(
    keys: DeveloperEntityKeys,
    update: Partial<DeveloperEntityProperties>
  ) {
    return this.model.update(keys, update) as any;
  }
}
