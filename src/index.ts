import { createBotContext } from "./contextualize";
import { createDdbClient } from "./clients/ddb-client";
import { SlackBot } from "./chat-bots";

createDdbClient();

const botContext = createBotContext();
new SlackBot(botContext);

import express from "express";

// const app = express();
// app.post("/api/messages", (req, res, next) => {
//   console.log(req.route);
// });

// app.listen(3000, () => {
//   console.log("listening on 3000");
// });
