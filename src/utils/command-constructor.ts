export type Command<T> = {
  description?: string;
  options: Record<
    string,
    {
      description?: string;
      trigger?: string;
    }
  >;
  command: T;
};

export class CommandConstructor<T> {
  private commands: Record<string, Command<T>> = {};
  constructor() {}

  public addCommand(input: { name: string; command: T; description: string }) {
    const stripped = input.name.replace(/\-/g, "");
    this.commands[stripped] = {
      description: input.description,
      options: {},
      command: input.command,
    };
    return this;
  }

  public addOption(name, option, description) {
    const stripped = option.replace(/\-/g, "");
    if (!this.commands[name]) {
      throw new Error("Not found");
    }

    this.commands[name].options[stripped] = {
      description,
      trigger: `-${stripped}`,
    };
    return this;
  }

  public describeCommands() {
    for (const cmd in this.commands) {
      const cmdObj = this.commands[cmd];
      console.log("---------------------------");
      console.log(`Command: ${cmd}`);
      for (const option in cmdObj.options) {
        const cmdOption = cmdObj.options[option];
        console.log(cmdOption.trigger, ` ${cmdOption.description}`);
      }
    }
    return this;
  }

  public validateCommand(cmd: string, options?: string) {
    const command = this.commands[cmd];
    if (!command) {
      throw new Error("Command not found");
    }
    console.log(options);
    options &&
      options
        .split("-")
        .filter((x) => !!x)
        .forEach((pair) => {
          console.log(pair);
          const [trigger] = pair.split(" ");
          if (!command.options[trigger]) {
            throw new Error(`Command ${cmd} option ${trigger} is not valid`);
          }
        });
  }

  public extractOptionValues(options: string) {
    const result = {};
    options &&
      options
        .split("-")
        .filter((x) => !!x)
        .forEach((pair) => {
          const [trigger, value] = pair.split(" ");
          result[trigger] = value;
        });

    return result;
  }

  public getHandler(commandName: string, options?: string): T {
    this.validateCommand(commandName, options);
    return this.commands[commandName].command;
  }
}
