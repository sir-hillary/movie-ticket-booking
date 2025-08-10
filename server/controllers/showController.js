import axios from "axios";
import Movie from "../Models/Movie.js";
import Show from "../Models/Show.js";

//API to get now playing movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const movies = data.results;
    res.json({
      sucess: true,
      movies: movies,
    });
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch now playing movies",
    });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      //fetch movie details and credits from the TMDB API
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(
          `
https://api.themoviedb.org/3/movie/${movieId}`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }
        ),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);
       const movieApiData = movieDetailsResponse.data;
    const movieCreditsData = movieCreditsResponse.data;

    const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast, // fixed: use movieCreditsData.cast instead of movieApiData.casts
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
    };

      // Save the movie to the database
      movie = await Movie.create(movieDetails)
    }

    const showToCreate= [];
    showsInput.forEach(show => {
        const showDate = show.date;
        show.time.forEach((time)=> {
            const dateTimeString = `${showDate}T${time}`;
            showToCreate.push({
                movie: movieId,
                showDateTime: new Date(dateTimeString),
                showPrice,
                occupiedSeats: {}
            })
        })
    });

    if(showToCreate.length > 0 ){
        await Show.insertMany(showToCreate)
    }

    res.status(201).json({
      success: true,
      message: "Show added successfully",
      movie,
    });

  } catch (error) {
    console.error("Error adding show:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add show",
    });
  }
};
