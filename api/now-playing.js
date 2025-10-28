export default async function handler(req, res) {
  const refresh_token = process.env.REFRESH_TOKEN;

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  const token = await tokenResponse.json();
  const access_token = token.access_token;

  const nowPlayingResponse = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
    return res.status(200).json({ isPlaying: false });
  }

  const song = await nowPlayingResponse.json();

  res.status(200).json({
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map((a) => a.name).join(", "),
    album: song.item.album.name,
    url: song.item.external_urls.spotify,
    cover: song.item.album.images[0].url,
  });
}
