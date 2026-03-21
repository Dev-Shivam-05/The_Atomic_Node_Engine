import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({
    movieTitle:{
        type:String,
        required: true
    },
    genre:{
        type:String,
        required: true
    },
    rating:{
        type:String,
        required: true
    },
    movieDescription:{
        type:String,
        required: true
    },
    poster:{
        type:String,
        required: true
    },
})

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;