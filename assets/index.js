// GLOBAL VARIABLES
const canvas = document.getElementById("canvas1");
const inputDiv = document.getElementById("inputDiv");
const inputField = document.getElementById("artistInput");
const searchButton = document.querySelector("#inputDiv button");
const resultsDiv = document.getElementById("results");
const displayResultsDiv = document.getElementById("displayResults");
const displayTracks = document.getElementById("top-tracks");
const trackContainer = $("#toptrack-container");
const errorEl = document.getElementById("error");

// Hide Top Tracks on load
trackContainer.hide();

//Event listener for submit button
searchButton.addEventListener("click", handleSearch);

// Get similar artists function
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

// Print similar artists function
function renderlastFm(data) {
  console.log(data);
try{

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
    //Puts the similar artists in button elements and puts them on the screen
    let artistDiv = document.createElement("button");
    artistDiv.classList = "button similarArtist";
    artistDiv.textContent = `${artist.name}`;
    resultsDiv.appendChild(artistDiv);
  }
}
catch (error) {
  console.log(error);
  let errorDiv = document.createElement("div");
  errorDiv.setAttribute("class", "is-warning");
  errorDiv.textContent = "Invalid search, try again!";
  errorEl.innerHTML = "";
  errorEl.append(errorDiv);
}
}

// Search function (event handler)
function handleSearch(event) {
errorEl.innerHTML = "";
  let artistInput = document.getElementById("artistInput");
  let artist = artistInput.value;
  event.preventDefault();
  trackContainer.hide();
  console.log("hello");
  lastFm(artist, renderlastFm);
  localStorage.setItem("lastArtist", artist);
}
function getLocal() {
  let lastArtist = localStorage.getItem("lastArtist");

  if (lastArtist) {
    artist = lastArtist;
    artistInput.value = artist;
  }
  lastFm(artist, renderlastFm);
}


// Shazam Music API function for top tracks list
resultsDiv.addEventListener("click", rapidData);

async function rapidData(event) {
  trackContainer.show();
  console.log(event.target.textContent);
  var simArtists = event.target.textContent;
  //Shazam API URL
  const url = `https://shazam.p.rapidapi.com/search?term=${simArtists}&locale=en-US&offset=0&limit=5`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "2df4822ac5msh9ecae0cf2c6416ep158190jsn26b3f314891f",
      "X-RapidAPI-Host": "shazam.p.rapidapi.com",
    },
  };

  //Clears the Top Tracks when another artist button is pressed
  displayTracks.innerHTML = "";
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    for (let i = 0; i < result.tracks.hits.length; i++) {
      var trackTitles = result.tracks.hits[i].track.title;
      var songLinks = result.tracks.hits[i].track.url;
      var artLinks = result.tracks.hits[i].track.images.coverart;

      console.log(trackTitles);


      //Amends the top tracks, album art and Shazam song link to the website
      var topTracks = document.createElement("li");
      var trackLinks = document.createElement("a");
      var albumArt = document.createElement("img");

      albumArt.setAttribute("src", artLinks);
      albumArt.setAttribute("class", "album-art");

      trackLinks.textContent = trackTitles;
      trackLinks.setAttribute("href", songLinks);
      trackLinks.setAttribute("target", "_blank");

      topTracks.append(albumArt);
      topTracks.append(trackLinks);

      displayTracks.append(topTracks);
    }
  } catch (error) {
    console.error(error);
  }
}
getLocal();