const express = require("express");
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");

const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
      res.send("Hello, World!");
});

mainRouter.use(userRouter);
mainRouter.use(repoRouter);

module.exports = mainRouter;
    