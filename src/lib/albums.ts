export type Album = {
  title: string;
  artist: string;
  year: string;
  /** Manifest slug under photos/. Covers ride the photo pipeline (graded neutrally, AVIF/WebP/JPEG + LQIP). */
  photo: string;
  /** Canonical release page for the "play it" link. */
  spotify: string;
};

/** On-repeat inspirations, in the order they were handed over. */
export const ALBUMS: Album[] = [
  {
    title: "Late Registration",
    artist: "Kanye West",
    year: "2005",
    photo: "album-late-registration",
    spotify: "https://music.apple.com/us/album/late-registration/1440763821?uo=4",
  },
  {
    title: "Take Care",
    artist: "Drake",
    year: "2011",
    photo: "album-take-care",
    spotify: "https://music.apple.com/us/album/take-care-deluxe-version/1440745498?uo=4",
  },
  {
    title: "channel ORANGE",
    artist: "Frank Ocean",
    year: "2012",
    photo: "album-channel-orange",
    spotify: "https://open.spotify.com/album/392p3shh2jkxUxY2VHvlH8",
  },
  {
    title: "IGOR",
    artist: "Tyler, the Creator",
    year: "2019",
    photo: "album-igor",
    spotify: "https://open.spotify.com/album/5zi7WsKlIiUXv09tbGLKsE",
  },
  {
    title: "Blonde",
    artist: "Frank Ocean",
    year: "2016",
    photo: "album-blonde",
    spotify: "https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf",
  },
  {
    title: "My Beautiful Dark Twisted Fantasy",
    artist: "Kanye West",
    year: "2010",
    photo: "album-mbdtf",
    spotify:
      "https://music.apple.com/us/album/my-beautiful-dark-twisted-fantasy/1443160553?uo=4",
  },
  {
    title: "The Life of Pablo",
    artist: "Kanye West",
    year: "2016",
    photo: "album-tlop",
    spotify: "https://music.apple.com/us/album/the-life-of-pablo/1442966257?uo=4",
  },
  {
    title: "Yeezus",
    artist: "Kanye West",
    year: "2013",
    photo: "album-yeezus",
    spotify: "https://open.spotify.com/album/7D2NdGvBHIavgLhmcwhluK",
  },
];
