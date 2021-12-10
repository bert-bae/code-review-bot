import { SlackDialog } from "botbuilder-adapter-slack";
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

export const createReviewDialog = new SlackDialog()
  .title("Review Code")
  .callback_id("CallbackId123")
  .submit_label("Submit")
  .addSelect("Complexity", "complexity", defaultOption, reviewOptions)
  .addSelect("Design", "design", defaultOption, reviewOptions)
  .addSelect("Functionality", "functionality", defaultOption, reviewOptions)
  .addSelect("Naming", "naming", defaultOption, reviewOptions)
  .addSelect("Readability", "readability", defaultOption, reviewOptions)
  .addSelect("Tests", "tests", defaultOption, reviewOptions)
  .addTextarea("Additional comments", "comments", null, null, null)
  .notifyOnCancel(false)
  .asObject();
