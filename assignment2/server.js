// Import required modules
const express = require('express'); // Framework for building web applications
const fetch = require('node-fetch'); // To make API requests
const path = require('path'); // To handle file paths
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

// Initialize the Express application
const app = express();

// Spotify API initialization
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
// Middleware to serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

spotifyApi.clientCredentialsGrant()
.then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Spotify access token set successfully.');
})
.catch(err => console.error('Error fetching Spotify access token:', err));
// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.post('/', async(req, res) => {
    const query = req.body.song;
    try {
        const data = await spotifyApi.searchTracks(query);
        track = data.body.tracks.items[0];
        trackName = track.name;
        artist = track.artists.map(artist => artist.name).join(', ');
        album = track.album.name;
        url = track.external_urls.spotify;
        releaseDate = track.album.release_date;
        albumImage = track.album.images[0].url;
        durationMs = track.duration_ms; 
        popularity = track.popularity;

        minutes = Math.floor(durationMs / 60000);
        seconds = ((durationMs % 60000) / 1000).toFixed(0);

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Spotify Song Finder</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Spotify Song Finder </h1>
                <form action="/" method="POST">
                    <label for="song">Input Song</label>
                    <input name="song" id="song" type="text" required>
                    <button type="submit">Submit</button>
                </form>
                <h2>Track: ${trackName}</h2>
                <h3>Artist: ${artist}</h3>
                <ul>
                    <li>Album: ${album}</li>
                    <li>Release Date: ${releaseDate}</li> 
                    <li>Duration: ${minutes}:${seconds}</li> 
                    <li>Popularity: ${popularity}</li> 
                    <li><a href="${url}" target="_blank">Listen on Spotify</a></li>
                </ul>
                <img src="${albumImage}" alt="${album} album cover" style="width: 300px; height: 300px;" /> <!-- Display the album image -->

            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error fetching API data. Please try again.');
    }


});


const PORT = 3000;
app.listen(PORT, () => {
    // Log a message indicating the server is running
    console.log(`Server running at http://localhost:${PORT}`);
});