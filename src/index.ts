import express from "express";
import cors from "cors";
import { createCommandContext } from "./contextualize";
import { commandProcessor } from "./processors/command-processor";
import { createDdbClient } from "./clients/ddb-client";

// Routes
import { useDeveloperRoutes } from "./routes/developers";

createDdbClient();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const context = createCommandContext();
const processCommand = commandProcessor(context);
app.use("/developers", useDeveloperRoutes(processCommand, context));

export default app;
