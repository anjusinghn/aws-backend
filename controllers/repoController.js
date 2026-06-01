const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const multer = require("multer");
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

async function createRepository(req, res) {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating repository", error });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.status(200).json({ repositories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching repositories", error });
  }
}

async function fetchRepositoryById(req, res) {
  const repoID = req.params.id;

  try {
    const repository = await Repository.findById(repoID)
      .populate("owner")
      .populate("issues");
    res.status(200).json({ repository });
  } catch (error) {
    console.error(error); // ← add this to see full error in terminal
    res.status(500).json({
      message: "Error fetching repository",
      error: error.message,
    });
  }
}

async function fetchRepositoryByName(req, res) {
  const repoName = req.params.name;

  try {
    const repository = await Repository.findOne({ name: repoName })
      .populate("owner")
      .populate("issues");
    res.status(200).json({ repository });
  } catch (error) {
    res.status(500).json({ message: "Error fetching repository", error });
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
    const userID = req.params.userID;

    try {

        const repositories = await Repository.find({ owner: userID })
            .populate("owner")
            .populate("issues");

        if(!repositories || repositories.length === 0) {
            return res.status(404).json({ message: "No repositories found for this user" });
        }

        res.status(200).json({ repositories });

    }catch (error) {
        res.status(500).json({ message: "Error fetching repositories for user", error });
    }
}

async function updateRepositoryById(req, res) {
    const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function toggleVisibilityById(req, res) {
    const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteRepositoryById(req, res) {
    const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function uploadFileToRepo(req, res) {
  try {
    const repoId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const file = req.file;

    const params = {
      Bucket: S3_BUCKET,
      Key: `repos/${repoId}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    const result = await s3.upload(params).promise();

    const repository = await Repository.findById(repoId);

    repository.content.push(file.originalname);

    await repository.save();

    res.status(200).json({
      message: "File uploaded",
      url: result.Location,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Upload failed",
    });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
  uploadFileToRepo,
  upload
};
