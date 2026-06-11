const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const mainRouter = require("./routes/main.router");

dotenv.config();

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialize the version control system", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to Repo",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    },
  )
  .command(
    "commit <message>",
    "Commit changes to the repository",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command(
  "pull <repoId>",
  "Pull changes from remote repository",
  (yargs) => {
    yargs.positional("repoId", {
      describe: "Repository ID",
      type: "string",
    });
  },
  (argv) => {
    pullRepo(argv.repoId);
  }
)
  .command(
  "push <repoId>",
  "Push changes to remote repository",
  (yargs) => {
    yargs.positional("repoId", {
      describe: "Repository ID",
      type: "string",
    });
  },
  (argv) => {
    pushRepo(argv.repoId);
    }
  )
  .command(
    "revert <commit>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commit", {
        describe: "Commit hash to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commit);
    },
  )
  .demandCommand(1, "You need to specify a command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors({origin: "*"}));
  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;
  mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

    app.use("/", mainRouter);


    let user = "test";

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      socket.on("joinRoom", (userID) => {
        user = userID;
        console.log("User joined room: ");
        console.log(user);
        console.log("...");
        socket.join(userID);
      });
    });

    const db = mongoose.connection;

    db.once("open",async () => {
      console.log("Crud operations called");

      //Crud operations
    });

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
