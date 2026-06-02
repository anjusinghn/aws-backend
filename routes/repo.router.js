const express = require("express");
const repoController = require("../controllers/repoController");
const commitController = require("../controllers/commitController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);

repoRouter.post(
  "/repo/upload/:id",
  repoController.upload.single("file"),
  repoController.uploadFileToRepo
);

repoRouter.post(
  "/repo/commit/:id",
  commitController.createCommit
);

repoRouter.get(
  "/repo/commits/:id",
  commitController.getCommits
);

repoRouter.post(
  "/repo/revert/:commitId",
  commitController.revertCommit
);

repoRouter.get("/repo/test123", (req, res) => {
  res.send("test route working");
});

module.exports = repoRouter;