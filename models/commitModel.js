const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommitSchema = new Schema({
  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  files: [
    {
      type: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Commit = mongoose.model("Commit", CommitSchema);

module.exports = Commit;