import { createContext } from "./contextualize";
import { createDdbClient } from "./clients/ddb-client";
import { SlackBot } from "./chat-bots";

createDdbClient();

const context = createContext();
new SlackBot(context);
