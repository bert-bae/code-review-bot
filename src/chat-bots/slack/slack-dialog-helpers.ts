import { SlackDialog } from "botbuilder-adapter-slack";
import { ReviewSurveyFields } from "../../types";
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
  prOwner: string;
};

export const createReviewDialog = (prOwner: string, prId: string) => {
  const state: SlackDialogSubmitPullRequestState = {
    command: SlackCommands.SubmitPullRequestReview,
    prId,
    prOwner,
  };

  return new SlackDialog()
    .title("Review Code")
    .callback_id(`${SlackCommands.SubmitPullRequestReview}::${prId}`)
    .submit_label("Submit")
    .addSelect(
      ReviewSurveyFields.Complexity,
      "complexity",
      defaultOption,
      reviewOptions
    )
    .addSelect(
      ReviewSurveyFields.Design,
      "design",
      defaultOption,
      reviewOptions
    )
    .addSelect(
      ReviewSurveyFields.Functionality,
      "functionality",
      defaultOption,
      reviewOptions
    )
    .addSelect(
      ReviewSurveyFields.Naming,
      "naming",
      defaultOption,
      reviewOptions
    )
    .addSelect(
      ReviewSurveyFields.Readability,
      "readability",
      defaultOption,
      reviewOptions
    )
    .addSelect(ReviewSurveyFields.Tests, "tests", defaultOption, reviewOptions)
    .addTextarea("Additional comments", "comments", null, null, null)
    .notifyOnCancel(false)
    .state(JSON.stringify(state))
    .asObject();
};
