const EpisodeSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  date:        { type: Date },
  duration:    { type: String, default: '' },
  audioUrl:    { type: String, default: '' },
  cover:       { type: String, default: '' },
  hostId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true },
}, { timestamps: true });

const EmissionEpisode = mongoose.model('EmissionEpisode', EpisodeSchema);

