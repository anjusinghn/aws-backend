const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commit) {

    const repoPath = path.resolve(process.cwd(), ".mygit");

    const commitsPath = path.join(repoPath, "commits");

    const stagingPath = path.join(repoPath, "staging");

    try {

        const commitDir = path.join(commitsPath, commit);

        // clear staging folder first
        await fs.rm(stagingPath, {
            recursive: true,
            force: true,
        });

        await fs.mkdir(stagingPath, {
            recursive: true,
        });

        const files = await fs.readdir(commitDir);

        for (const file of files) {

            if (file === "commit.json") continue;

            await fs.copyFile(
                path.join(commitDir, file),
                path.join(stagingPath, file)
            );

        }

        console.log(
            `Reverted to commit ${commit} successfully.`
        );

    } catch (err) {

        console.error(
            "Error reverting repository:",
            err
        );

    }

}

module.exports = {
    revertRepo
};