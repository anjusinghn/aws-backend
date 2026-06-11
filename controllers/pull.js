const fs = require("fs").promises;
const path = require("path");

const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo(repoId) {

    const repoPath = path.resolve(
        process.cwd(),
        ".mygit"
    );

    const commitsPath = path.join(
        repoPath,
        "commits"
    );

    try {

        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: `repos/${repoId}/commits/`,
        }).promise();

        const objects = data.Contents;

        for (const obj of objects) {

            const key = obj.Key;

            const relativePath = key.replace(
                `repos/${repoId}/commits/`,
                ""
            );

            const localFilePath = path.join(
                commitsPath,
                relativePath
            );

            await fs.mkdir(
                path.dirname(localFilePath),
                { recursive: true }
            );

            const params = {
                Bucket: S3_BUCKET,
                Key: key,
            };

            const fileContent =
                await s3.getObject(params).promise();

            await fs.writeFile(
                localFilePath,
                fileContent.Body
            );

        }

        console.log(
            "All commits pulled successfully from S3."
        );

    } catch (err) {

        console.error(
            "Error pulling repository:",
            err
        );

    }

}

module.exports = {
    pullRepo,
};