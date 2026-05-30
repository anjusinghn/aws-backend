const fs = require('fs').promises;
const path = require('path');
const { s3, S3_BUCKET } = require('../config/aws-config');

async function pushRepo() {
    const repoPath = path.join(process.cwd(), '.mygit');
    const commitPath = path.join(repoPath, 'commits');

    try {
        const commitDirs = await fs.readdir(commitPath);
        for (const commitDir of commitDirs) {
            const commitspath = path.join(commitPath, commitDir);
            const files = await fs.readdir(commitspath);
            for (const file of files) {
                const filePath = path.join(commitspath, file);
                const fileContent = await fs.readFile(filePath);

                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                };
                await s3.upload(params).promise();
            }
            
                console.log(`Pushed commit ${commitDir} to S3 successfully.`);
        }
    } catch (error) {
        console.error('Error pushing to S3:', error);
    }
}

module.exports = {
    pushRepo
};