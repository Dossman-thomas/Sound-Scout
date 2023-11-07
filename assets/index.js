const canvas = document.getElementById('canvas1');
const inputDiv = document.getElementById('inputDiv');
const inputField = document.getElementById('artistInput');
const searchButton = document.querySelector('#inputDiv button');
const resultsDiv = document.getElementById('results');
const displayResultsDiv = document.getElementById('displayResults');


searchButton.addEventListener("click", handleSearch);

function lastFm(query, callback) {
    //  Url for audio scrabbler including the api key 
        var apiKey = "9fa5d5bc44bff94e3d5b26efc213830f";
        var url = "https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist="+query+"&api_key="+apiKey+"&format=json&limit=10";
        // var url = "https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist="+query+"&api_key=9fa5d5bc44bff94e3d5b26efc213830f&format=json";
        fetch(url)
        .then((response) => response.json())
        .then((data) => callback(data));

    }

function renderlastFm(data) {
    console.log(data)
    console.log("Last.FM Related Artist List: " + data)
    console.log("Top Match: " + data.similarartists.artist[0].match)
    console.log("Similar Artist: " + data.similarartists.artist[0].name)
    console.log(data.similarartists)

    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous Search Results

    for (let i = 0; i < data.similarartists.artist.length; i++) {
      let artist = {
        name: data.similarartists.artist[i].name,
        match: data.similarartists.artist[i].match,
      };
      let artistDiv = document.createElement("button");
      artistDiv.textContent = `Artist: ${artist.name}, Match: ${artist.match * 100}%`;
      resultsDiv.appendChild(artistDiv);

    }
}


function handleSearch(event) {
  let artistInput = document.getElementById("artistInput");
  let artist = artistInput.value;
  event.preventDefault();
  console.log("hello");
  lastFm(artist, renderlastFm);
}



// Shazam Music API
async function rapidData() {
    const url = 'https://shazam.p.rapidapi.com/shazam-events/list?artistId=73406786&l=en-US&from=2022-12-31&limit=50&offset=0';
    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '21176ee6bdmsh0833df737f3d1abp14bec9jsn058238d8ac09',
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    }
};
    try {
    const response = await fetch(url, options);
    const result = await response.text();
    // console.log(result);
} catch (error) {
    console.error(error);
}};

rapidData();