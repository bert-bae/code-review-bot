import { CreateDeveloperCmd } from "../create-developer-cmd";
import { mockContext, mockDevelopersModel } from "../../test-utils";

const mockCtx = mockContext();
const cmd = new CreateDeveloperCmd(mockCtx);

describe("[Command] CreateDeveloperCmd", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create developer with entity", async () => {
    jest
      .spyOn(mockDevelopersModel, "create")
      .mockResolvedValue({ developerId: "1" });
    const input = { developerId: "1", name: "Test Name" };
    const result = await cmd.execute(input);
    expect(mockCtx.models.developers.create).toHaveBeenCalledWith({
      developerId: "1",
      name: "Test Name",
    });
    expect(result).toMatchObject({ developerId: input.developerId });
  });
});
