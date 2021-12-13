import { SlackDialog } from "botbuilder-adapter-slack";
import { SlackCommands } from "./slack-block-helpers";
// https://github.com/howdyai/botkit/blob/main/packages/docs/reference/slack.md#slackdialog

const defaultOption = 0;
const reviewOptions = [
  {
    label: "Not applicable",
    value: defaultOption,
  },
  {
    label: "Great",
    value: 3,
  },
  {
    label: "Good",
    value: 2,
  },
  {
    label: "Poor",
    value: 1,
  },
];

export type SlackDialogSubmitPullRequestState = {
  command: SlackCommands.SubmitPullRequestReview;
  prId: string;
};

export const createReviewDialog = (prId: string) => {
  const state: SlackDialogSubmitPullRequestState = {
    command: SlackCommands.SubmitPullRequestReview,
    prId,
  };

  return new SlackDialog()
    .title("Review Code")
    .callback_id(`${SlackCommands.SubmitPullRequestReview}::${prId}`)
    .submit_label("Submit")
    .addSelect("Complexity", "complexity", defaultOption, reviewOptions)
    .addSelect("Design", "design", defaultOption, reviewOptions)
    .addSelect("Functionality", "functionality", defaultOption, reviewOptions)
    .addSelect("Naming", "naming", defaultOption, reviewOptions)
    .addSelect("Readability", "readability", defaultOption, reviewOptions)
    .addSelect("Tests", "tests", defaultOption, reviewOptions)
    .addTextarea("Additional comments", "comments", null, null, null)
    .notifyOnCancel(false)
    .state(JSON.stringify(state))
    .asObject();
};
