const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commit) {
    const repoPath = path.resolve(process.cwd(), '.mygit');
    const commitsPath = path.join(repoPath, 'commits');

    try {
        const commitDir = path.join(commitsPath, commit);
        const files = await readdir(commitDir);

        const parentDir = path.dirname(repoPath,"..");
        for (const file of files) {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file));
        }
        console.log(`Reverted to commit ${commit} successfully.`);
    } catch (err) {
        console.error('Error reverting repository:', err);
    }
}

module.exports = {
    revertRepo
};