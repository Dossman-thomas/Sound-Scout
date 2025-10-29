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
  try {
    // Log the entire data object for debugging
    console.log(data);
    console.log(data.similarartists.artist);

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
  } catch (error) {
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
  errorEl.innerHTML = "";

  trackContainer.show();
  console.log(event.target.textContent);
  var simArtists = event.target.textContent;
  //Shazam API URL
  const url = `http://localhost:3001/api/shazam?term=${simArtists}`;

  //Clears the Top Tracks when another artist button is pressed
  displayTracks.innerHTML = "";
  try {
    const response = await fetch(url);

    if (response.status === 302) {
      displayTracks.innerHTML =
        "<p>Unable to fetch tracks — API redirected request.</p>";
      console.error("Redirect detected! Check API key or rate limit.");
      return;
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const text = await response.text();
    if (!text) throw new Error("Empty response from API");
    console.log(text);

    const result = await response.json(text);
    console.log(result);

    if (!result.tracks || !result.tracks.hits.length) {
      displayTracks.innerHTML = "<p>No top tracks found for this artist.</p>";
      return;
    }

    for (let i = 0; i < result.tracks.hits.length; i++) {
      var trackTitles = result.tracks.hits[i].track.title;
      var songLinks = result.tracks.hits[i].track.url;
      var artLinks = result.tracks.hits[i].track.images.coverart;

      console.log("track titles: " + trackTitles);

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
    displayTracks.innerHTML =
      "<p>Error fetching tracks. Please try again later.</p>";
  }
}
getLocal();
