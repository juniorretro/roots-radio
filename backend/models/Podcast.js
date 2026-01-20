const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true, min: 60 }, // seconds
  publishDate: { type: Date },
  audioFile: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index
PodcastSchema.index({ slug: 1 });
PodcastSchema.index({ category: 1 });
PodcastSchema.index({ featured: 1 });
PodcastSchema.index({ publishDate: -1 });

// Middleware slug
PodcastSchema.pre("save", function (next) {
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

module.exports = mongoose.model("Podcast", PodcastSchema);
