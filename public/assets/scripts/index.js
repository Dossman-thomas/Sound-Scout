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
    const instruction = document.getElementById("ux-instruction");
    resultsDiv.innerHTML = ""; // Clear previous Search Results

    // once data is fetched, display user friendly instruction text
    instruction.textContent = "Click on an artist to see their top tracks:";

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

  const simArtists = event.target.textContent;

  const baseUrl =
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001"
    : "https://your-render-app-name.onrender.com";
  const url = `${baseUrl}/api/shazam?term=${encodeURIComponent(simArtists)}`;

  displayTracks.innerHTML = "";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log("Full API result:", result);

    // ✅ Adapted for v2 API
    const songs = result?.results?.songs?.data;
    if (!songs || songs.length === 0) {
      displayTracks.innerHTML = "<p>No top tracks found for this artist.</p>";
      return;
    }

    songs.forEach((song) => {
      const attributes = song.attributes;
      const title = attributes.name;
      const artist = attributes.artistName;
      const link = attributes.url;
      const artwork = attributes.artwork?.url
        .replace("{w}", "200")
        .replace("{h}", "200");

      // console.log(`🎵 ${artist} - ${title}`);

      const topTracks = document.createElement("li");
      const trackLinks = document.createElement("a");
      const albumArt = document.createElement("img");

      albumArt.src = artwork;
      albumArt.className = "album-art";

      trackLinks.textContent = `${title}`;
      trackLinks.href = link;
      trackLinks.target = "_blank";

      topTracks.append(albumArt);
      topTracks.append(trackLinks);

      displayTracks.append(topTracks);
    });
  } catch (error) {
    console.error("Fetch error:", error);
    displayTracks.innerHTML =
      "<p>Error fetching tracks. Please try again later.</p>";
  }
}

getLocal();
