const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Agriculture",
        "Fitness or Body~Building", // Corrected the enum value
        "Web Development",
        "Bitcoin or Cryptocurrency", // Corrected the enum value
        "Weather",
        "Investment",
        "Education",
        "Uncategorized",
      ],
      default: "Uncategorized", // Optional: You can set a default value if needed
    },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
