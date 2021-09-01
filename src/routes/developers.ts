import express from "express";
import { CommandContext, UpdatePullRequestCmd } from "../commands";
import {
  CreateDeveloperCmd,
  GetDeveloperCmd,
  CreatePullRequestCmd,
  GetPullRequestCmd,
  GetPullRequestsByDeveloperCmd,
} from "../commands";

const router = express.Router();

export const useDeveloperRoutes = (cmdProcessor, ctx: CommandContext) => {
  router.post("/", cmdProcessor(new CreateDeveloperCmd(ctx)));
  router.get("/:developerId", cmdProcessor(new GetDeveloperCmd(ctx)));

  // PRs per developer
  router
    .route("/:developerId/prs")
    .get(cmdProcessor(new GetPullRequestsByDeveloperCmd(ctx)))
    .post(cmdProcessor(new CreatePullRequestCmd(ctx)));
  router
    .route("/:developerId/prs/:prId")
    .get(cmdProcessor(new GetPullRequestCmd(ctx)))
    .put(cmdProcessor(new UpdatePullRequestCmd(ctx)));
  return router;
};
