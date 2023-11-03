function lastFm(query) {
    // var url = "https://www.last.fm/api/auth/?api_key=9fa5d5bc44bff94e3d5b26efc213830f";
    var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist="+query+"&api_key=9fa5d5bc44bff94e3d5b26efc213830f&format=json"
    fetch(url)
    .then(response => response.json())
    .then(data => renderlastFm(data));

}

function renderlastFm(data) {
    console.log(data)
    console.log(data.similarartists.artist[0].name)
}

lastFm("cher");
lastFm("taylor swift");


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
	console.log(result);
} catch (error) {
	console.error(error);
}};

rapidData();