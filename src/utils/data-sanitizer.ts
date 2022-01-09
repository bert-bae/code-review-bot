import { ReviewSurveyFields } from "../types";

export const sanitizeReviewSubmission = (
  data: Record<string, string>
): Record<string, number> => {
  const result: any = { ...data };
  for (const key in data) {
    if (ReviewSurveyFields.Comments.toLowerCase() !== key) {
      result[key] = Number(result[key]);
    }
  }

  return result as Record<string, number>;
};
