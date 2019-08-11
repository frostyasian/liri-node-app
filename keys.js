//bandsintown 3 months from 7/10/19

console.log("Keys Loading...");

//Export
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
  id: process.env.OMDB_KEY
};

exports.bandsintown = {
  id: process.env.BANDSINTOWN_KEY
};
