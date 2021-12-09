import { GetDeveloperCmd, GetDeveloperCmdInput } from "../get-developer-cmd";
import { mockContext, mockDevelopersModel } from "../../test-utils";

const mockCtx = mockContext();
const cmd = new GetDeveloperCmd(mockCtx);

describe("[Command] CreatePullRequestCmd", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create developer with entity", async () => {
    const input: GetDeveloperCmdInput = {
      developerId: "1",
    };

    jest.spyOn(mockDevelopersModel, "getOne").mockResolvedValue({
      developerId: input.developerId,
      name: "Mock Name",
    });

    const result = await cmd.execute(input);
    expect(result).toMatchObject({
      developerId: input.developerId,
      name: "Mock Name",
    });
  });
});
