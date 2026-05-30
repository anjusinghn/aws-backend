const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

async function commitRepo(message) {

    const repoPath = path.resolve(process.cwd(), ".mygit");
    const stagingPath = path.join(repoPath, "staging");
    const commitsPath = path.join(repoPath, "commits");

    try {

        const commitId = crypto.randomUUID();

        const commitDir = path.join(commitsPath, commitId);

        await fs.mkdir(commitDir, { recursive: true });

        const files = await fs.readdir(stagingPath);

        for (const file of files) {

            await fs.copyFile(
                path.join(stagingPath, file),
                path.join(commitDir, file)
            );

        }

        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({
                message,
                date: new Date().toISOString()
            })
        );

        console.log(
            `Changes committed successfully with ID: ${commitId}`
        );

    } catch (error) {

        console.error(
            "Error committing changes:",
            error
        );

    }

}

module.exports = {
    commitRepo
};