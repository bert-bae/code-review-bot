import expressApp from "./";

expressApp.listen(process.env.PORT, () => {
  console.log(`Code review bot listening on port ${process.env.PORT}`);
});
