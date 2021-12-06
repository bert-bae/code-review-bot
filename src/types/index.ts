export enum AccessRoles {
  Admin = "Admin",
  Manager = "Manager",
  Developer = "Developer",
}

export enum PullRequestStatus {
  Open = "Open",
  Closed = "Closed",
}

export interface IReviewSurvey {
  complexity?: number;
  tests?: number;
  design?: number;
  functionality?: number;
  comments?: string;
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
