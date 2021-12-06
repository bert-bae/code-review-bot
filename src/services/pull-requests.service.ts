import { PullRequestModel } from "../models";
import {
  PullRequestEntity,
  PullRequestKeys,
  PullRequestProperties,
} from "../types";

const create = async (
  prEntity: Pick<PullRequestEntity, "prOwner" | "link">
) => {
  return PullRequestModel.create({
    prOwner: prEntity.prOwner,
    link: prEntity.link,
  });
};

const getOne = async (prKeys: PullRequestKeys) => {
  return PullRequestModel.get(prKeys);
};

const queryByOwner = async (developerId: string) => {
  return PullRequestModel.query("prOwner").eq(developerId).exec() as any;
};

const updateOne = async (
  prKeys: PullRequestKeys,
  update: Partial<PullRequestProperties>
) => {
  return PullRequestModel.updateOne(prKeys, update);
};

export default {
  create,
  getOne,
  queryByOwner,
  updateOne,
};
