const Repository = require("../models/repoModel");
const Commit = require("../models/commitModel");

async function createCommit(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const commit = new Commit({
      repository: id,
      message,
      files: repository.content,
    });

    await commit.save();

    repository.commits.push(commit._id);

    await repository.save();

    res.status(201).json({
      message: "Commit created successfully",
      commit,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to create commit",
    });
  }
}

async function getCommits(req, res) {
  try {
    const { id } = req.params;

    const commits = await Commit.find({
      repository: id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      commits,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch commits",
    });
  }
}

module.exports = {
  createCommit,
  getCommits,
};