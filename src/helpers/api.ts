import axios from "axios";

export const getAllGenres = axios.get(
  `http://localhost:3001/genres`
);

export const getAllAuthors = axios.get(
  `http://localhost:3001/authors`
);

export const getAllSongs = axios.get(
  "http://localhost:3001/songs"
);

export const getFilteredSongs = (
  author_id: string | undefined,
  genre_id: string | undefined,
  yearOfRelease: number | string
) =>
  axios({
    method: "post",
    url: "http://localhost:3001/songs/filter",
    headers: {
      "Content-Type": "aplication/json",
    },
    data: {
      author_id,
      genre_id,
      yearOfRelease,
    },
  });
