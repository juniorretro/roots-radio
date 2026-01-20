const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  season: { type: Number, required: true, min: 1 },
  episodeNumber: { type: Number, required: true, min: 1 },
  duration: { type: Number, required: true, min: 60 }, // seconds
  airDate: { type: Date },
  audioFile: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["draft", "scheduled", "aired", "archived"],
    default: "draft",
  },
  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index
EpisodeSchema.index({ slug: 1 });
EpisodeSchema.index({ programId: 1 });
EpisodeSchema.index({ status: 1 });
EpisodeSchema.index({ airDate: -1 });
EpisodeSchema.index({ featured: 1 });

// Middleware slug
EpisodeSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Episode", EpisodeSchema);
