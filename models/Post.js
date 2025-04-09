const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         require: true,
      },
      content: {
         type: String,
         require: true,
      },
      media: [{ type: String }],
      likes: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      comments: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
            },
            text: {
               type: String,
            },
         },
      ],
      shares: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
   },
   { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
