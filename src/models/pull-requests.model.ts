import dynamoose from "dynamoose";
import { PullRequestSchema } from "./schemas";
import { DynamoDBModel } from "./base-dynamodb-model";
import {
  PullRequestEntity,
  PullRequestKeys,
  PullRequestProperties,
} from "../types";

const Model = dynamoose.model("ReviewBot_PullRequests", PullRequestSchema);

export class PullRequestsModel extends DynamoDBModel<PullRequestEntity> {
  private model: typeof Model;

  constructor() {
    super();
    this.model = Model;
  }

  public async create(entity) {
    return this.model.create({
      prOwner: entity.prOwner,
      link: entity.link,
    }) as any;
  }

  public async getOne(keys: PullRequestKeys) {
    return Model.get(keys) as any;
  }

  public async query(queryKey: string, value: string) {
    return Model.query(queryKey).eq(value).exec() as any;
  }

  public updateOne(
    prKeys: PullRequestKeys,
    update: Partial<PullRequestProperties>
  ) {
    return Model.updateOne(prKeys, update);
  }
}
