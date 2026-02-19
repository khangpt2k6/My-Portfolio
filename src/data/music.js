/**
 * Music Data
 * -------------------------------------------------------
 * Edit this file to add/remove/update playlist entries.
 * Place your own .mp3 files in /public/music/ and update
 * the `src` paths accordingly.
 *
 * Each entry has:
 *   id       - Unique number
 *   title    - Track name
 *   artist   - Artist / producer name
 *   album    - Album name
 *   duration - Display string (m:ss)
 *   src      - Path to audio file in /public
 *   gradient - CSS gradient for album art placeholder
 */

const tracks = [
  {
    id: 1,
    title: "Midnight City Lights",
    artist: "Yūgen Beats",
    album: "Nocturne",
    duration: "3:24",
    src: "/music/track1.mp3",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    title: "Rainy Afternoon",
    artist: "Cloudbrew",
    album: "Petrichor",
    duration: "4:12",
    src: "/music/track2.mp3",
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  },
  {
    id: 3,
    title: "Sunset Boulevard",
    artist: "Amber Haze",
    album: "Golden Hour",
    duration: "2:56",
    src: "/music/track3.mp3",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 4,
    title: "Coffee Shop Vibes",
    artist: "Mocha Loop",
    album: "Café Sessions",
    duration: "5:01",
    src: "/music/track4.mp3",
    gradient: "linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 50%, #d4a574 100%)",
  },
  {
    id: 5,
    title: "Stargazing",
    artist: "Cosmonaut",
    album: "Orbit",
    duration: "3:45",
    src: "/music/track5.mp3",
    gradient: "linear-gradient(135deg, #0c0c3a 0%, #1a1a5e 40%, #6366f1 100%)",
  },
  {
    id: 6,
    title: "Neon Tokyo",
    artist: "KIRA",
    album: "Cyber Dreams",
    duration: "4:33",
    src: "/music/track6.mp3",
    gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 50%, #6366f1 100%)",
  },
  {
    id: 7,
    title: "Ocean Breeze",
    artist: "Tidal",
    album: "Horizons",
    duration: "3:12",
    src: "/music/track7.mp3",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #667eea 100%)",
  },
  {
    id: 8,
    title: "Late Night Coding",
    artist: "Syntax Error",
    album: "Debug Mode",
    duration: "2:45",
    src: "/music/track8.mp3",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 50%, #667eea 100%)",
  },
];

export default tracks;
