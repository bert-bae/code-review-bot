export enum AccessRoles {
  Admin = "Admin",
  Manager = "Manager",
  Developer = "Developer",
}

export enum PullRequestStatus {
  Open = "Open",
  Closed = "Closed",
}

export enum ReviewSurveyFields {
  Comments = "Comments",
  Complexity = "Complexity",
  Design = "Design",
  Functionality = "Functionality",
  Naming = "Naming",
  Readability = "Readability",
  Tests = "Tests",
}

export interface IReviewSurvey {
  [ReviewSurveyFields.Comments]?: string;
  [ReviewSurveyFields.Complexity]?: number;
  [ReviewSurveyFields.Design]?: number;
  [ReviewSurveyFields.Naming]?: number;
  [ReviewSurveyFields.Functionality]?: number;
  [ReviewSurveyFields.Readability]?: number;
  [ReviewSurveyFields.Tests]?: number;
}

export type DeveloperEntityKeys = {
  developerId: string;
};

export type DeveloperEntityProperties = {
  name?: string;
  accessRoles?: AccessRoles;
};

export type DeveloperEntity = DeveloperEntityKeys & DeveloperEntityProperties;

export type PullRequestKeys = {
  prOwner: string;
  prId: string;
};

export type PullRequestProperties = {
  reviewerId?: string;
  link: string;
  status: PullRequestStatus;
  reviewSurvey?: IReviewSurvey;
  description: string;
};

export type PullRequestEntity = PullRequestKeys & PullRequestProperties;
