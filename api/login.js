import querystring from "querystring";

export default function handler(req, res) {
  const scope =
    "user-read-currently-playing user-read-recently-played user-read-playback-state";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
      })
  );
}
