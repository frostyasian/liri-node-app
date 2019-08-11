//REQUIRES//
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var bandsInTown = keys.bandsintown;
var omdb = keys.omdb;
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

//setting the input to process.argv[2]
let userInput = process.argv[2];

//FUNCTIONS//
function useLiri(userInput) {
  switch (userInput) {
    case "spotify-this-song":
      searchSong();
      break;
    case "concert-this":
      concertSearch();
      break;
    case "movie-this":
      searchMovie();
      break;
    case "do-what-it-says":
      readFile("random.txt");
      break;
    default:
      console.log("LIRI Does Not Know! Try Again!");
  }
}

//SONG SEARCH
function searchSong() {
  var songName = process.argv[3];
  if (!songName) {
    songName = "The Sign Ace of Base";
  }
  spotify.search({ type: "track", query: songName, limit: 1 }, function(
    error,
    data
  ) {
    if (error) {
      console.log("Error has Occured " + error);
      return;
    }

    var track = data.tracks.items;
    for (var i = 0; i < track.length; i++) {
      console.log("\n" + "Artist: " + track[i].artists[0].name);
      console.log("Song: " + track[i].name);
      console.log("Preview: " + track[i].preview_url);
      console.log("Album: " + track[i].album.name + "\n");
      console.log(
        "|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|" +
          "\n"
      );
      writeToFile(
        "Artist: " +
          track[i].artists[0].name +
          "\n" +
          "Song: " +
          track[i].name +
          "\n" +
          "Preview: " +
          track[i].preview_url +
          "\n" +
          "Album: " +
          track[i].album.name +
          "\n" +
          "\n"
      );
    }
  });
}

//MOVIE SEARCH
function searchMovie() {
  var movieName = process.argv[3];
  if (!movieName) {
    movieName = "Ironman";
  }
  var queryURL =
    `http://www.omdbapi.com/?t=` + movieName + `&y=&plot=short&apikey=trilogy`;
  //var queryURL =
  //`http://www.omdbapi.com/?t=` + movieName + `&y=&plot=short&apikey=${omdb}`;
  axios.get(queryURL).then(function(response) {
    console.log("Title: " + response.data.Title);
    console.log("Year: " + response.data.Year);
    console.log("IMDB Rating: " + response.data.imdbRating);
    console.log(
      "Rotten Tomatoes Rating: " + response.data.Ratings.length > 1
        ? response.data.Ratings[1].value
        : "Not Available"
    );
    console.log("Country: " + response.data.Country);
    console.log("Language: " + response.data.Language);
    console.log("Plot: " + response.data.Plot);
    console.log("Actors: " + response.data.Actors);
    console.log(
      "|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|" +
        "\n"
    );
    writeToFile(
      "Country: " +
        response.data.Country +
        "\n" +
        "Language: " +
        response.data.Language +
        "\n" +
        "Plot: " +
        response.data.Plot +
        "\n" +
        "Actors: " +
        response.data.Actors +
        "\n"
    );
  });
}

//CONCERT SEARCH
function concertSearch() {
  var artistName = process.argv[3];
  var queryURL = `https://rest.bandsintown.com/artists/ +
    ${artistName} +
    /events?app_id=${bandsInTown}`;

  axios.get(queryURL).then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      console.log("Venue: " + response.data[i].venue.name);
      console.log(
        "Location: " +
          response.data[i].venue.city +
          ", " +
          response.data[i].venue.region +
          ", " +
          response.data[i].venue.country
      );
      console.log(
        "Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n"
      );
      console.log(
        "|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|-*-|" +
          "\n"
      );
      writeToFile(
        "Venue: " +
          response.data[i].venue.name +
          "\n" +
          "Location: " +
          response.data[i].venue.city +
          ", " +
          response.data[i].venue.region +
          ", " +
          response.data[i].venue.country +
          "\n" +
          "Date: " +
          moment(response.data[i].datetime).format("MM/DD/YYYY" + "\n")
      );
    }
  });
}

//LOGGING TO FILES
function readFile() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var content = data.split(",");
    console.log(content);
    (userInput = content[0]), content[1];
    useLiri(userInput);
  });
}

function writeToFile(UserOutput) {
  fs.appendFile("log.txt", "UserOutput", function(error) {
    if (error) {
      return console.log(error);
    }
  });
}

//CALLING LIRI
useLiri(userInput);
