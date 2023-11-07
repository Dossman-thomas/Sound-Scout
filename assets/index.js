const canvas = document.getElementById("canvas1");
const inputDiv = document.getElementById("inputDiv");
const inputField = document.getElementById("artistInput");
const searchButton = document.querySelector("#inputDiv button");
const resultsDiv = document.getElementById("results");
const displayResultsDiv = document.getElementById("displayResults");
const displayTracks = document.getElementById("top-tracks");

// Jquery selector

const trackContainer = $('#toptrack-container');

trackContainer.hide();

searchButton.addEventListener("click", handleSearch);

function lastFm(query, callback) {
  //  Url for audio scrabbler including the api key
  var apiKey = "9fa5d5bc44bff94e3d5b26efc213830f";
  var url =
    "https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" +
    query +
    "&api_key=" +
    apiKey +
    "&format=json&limit=10";
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data));
}

function renderlastFm(data) {
  console.log(data);
  console.log("Last.FM Related Artist List: " + data);
  console.log("Top Match: " + data.similarartists.artist[0].match);
  console.log("Similar Artist: " + data.similarartists.artist[0].name);
  console.log(data.similarartists);

  let resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous Search Results

  for (let i = 0; i < data.similarartists.artist.length; i++) {
    let artist = {
      name: data.similarartists.artist[i].name,
      match: data.similarartists.artist[i].match,
    };
    let artistDiv = document.createElement("button");
    artistDiv.classList = "button similarArtist";
    artistDiv.textContent = `${artist.name}`;
    resultsDiv.appendChild(artistDiv);
  }
}

function handleSearch(event) {
  let artistInput = document.getElementById("artistInput");
  let artist = artistInput.value;
  event.preventDefault();
  trackContainer.hide();
  console.log("hello");
  lastFm(artist, renderlastFm);
}

// Shazam Music API
resultsDiv.addEventListener("click", rapidData);

async function rapidData(event) {
  trackContainer.show();
  console.log(event.target.textContent);
  var simArtists = event.target.textContent;
  const url = `https://shazam.p.rapidapi.com/search?term=${simArtists}&locale=en-US&offset=0&limit=5`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "2df4822ac5msh9ecae0cf2c6416ep158190jsn26b3f314891f",
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
    },
  };

  displayTracks.innerHTML = "";
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    for (let i = 0; i < result.tracks.hits.length; i++) {
      console.log(result.tracks.hits[i].track.title);
      var topTracks = document.createElement("li");
      topTracks.textContent = result.tracks.hits[i].track.title;
      displayTracks.appendChild(topTracks);
    }
  } catch (error) {
    console.error(error);
  }
}
