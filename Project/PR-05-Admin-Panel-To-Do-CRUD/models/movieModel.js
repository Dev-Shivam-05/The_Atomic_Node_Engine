import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    movieTitle: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      enum: ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    movieDescription: {
      type: String,
      required: true,
      trim: true,
    },
    plotSummary: {
      type: String,
      default: "",
      trim: true,
    },
    cast: [
      {
        name: { type: String, trim: true },
        role: { type: String, trim: true },
      },
    ],
    crew: [
      {
        name: { type: String, trim: true },
        role: { type: String, trim: true },
      },
    ],
    movieRelease: {
      type: Date,
      required: true,
    },
    movieDuration: {
      type: Number, // Database stores: 150
      required: true,
      // Converts "02:30" -> 150
      set: function (val) {
        if (typeof val !== "string" || !val.includes(":")) return val;
        const [hours, minutes] = val.split(":").map(Number);
        return hours * 60 + minutes;
      },
      min: [90, "Duration must be at least 1 hour 30 minutes"],
      max: [300, "Duration cannot exceed 5 hours"],
      // Converts 150 -> "2h 30min"
      get: function (minutes) {
        if (!minutes) return minutes;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}min`;
      },
    },
    poster: {
      type: String,
      required: true,
    },
    trailerLinks: [String],
    userRatings: [
      {
        user: { type: String, trim: true },
        rating: { type: Number, min: 1, max: 10 },
      },
    ],
    reviews: [
      {
        user: { type: String, trim: true },
        rating: { type: Number, min: 1, max: 10 },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    // ✅ These must be here for the "get" function to work with JSON responses
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
