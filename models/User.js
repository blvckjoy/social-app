const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         require: true,
         unique: true,
      },
      fullName: {
         type: String,
         require: true,
      },
      email: {
         type: String,
         require: true,
         unique: true,
      },
      password: {
         type: String,
         require: true,
         unique: true,
      },
      bio: {
         type: String,
         default: "",
      },
      avatar: {
         type: String,
         default: "",
      },
      following: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      followers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
   },
   { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
