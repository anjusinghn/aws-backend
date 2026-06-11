const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo(repoId) {

  const repoPath = path.join(process.cwd(), ".mygit");

  const commitPath = path.join(repoPath, "commits");

  try {

    const commitDirs = await fs.readdir(commitPath);

    for (const commitDir of commitDirs) {

      const commitsPath = path.join(
        commitPath,
        commitDir
      );

      const files = await fs.readdir(commitsPath);

      for (const file of files) {

        const filePath = path.join(
          commitsPath,
          file
        );

        const fileContent = await fs.readFile(
          filePath
        );

        const params = {
          Bucket: S3_BUCKET,

          Key: `repos/${repoId}/commits/${commitDir}/${file}`,

          Body: fileContent,
        };

        await s3.upload(params).promise();
      }

      console.log(
        `Pushed commit ${commitDir} successfully`
      );
    }

    // THIS IS THE IMPORTANT PART

    await axios.post(
      `https://aws-backend-9w0q.onrender.com/repo/sync/${repoId}`
    );

    console.log(
      "Remote repository synced successfully"
    );

  } catch (error) {

    console.error(
      "Error pushing repository:",
      error
    );

  }
}

module.exports = {
  pushRepo,
};