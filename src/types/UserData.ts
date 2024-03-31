export type List = {
  name: string;
  isCustomList: boolean;
  entries: Entry[];
};

// Advanced score example:
// {Story: 6, Characters: 6, Visuals: 8, Enjoyment: 0}
export type Entry = {
  id: number;
  startedAt: Date;
  completedAt: Date;
  media: Media;
  score: number;
  // Advanced scores are multiple [key:string]: number pairs
  advancedScores: {
    [key: string]: number;
  };
  status: Status;
  fromList: string;
  progress: number;
};

export type Media = {
  title: Title;
  description: string;
  startDate: Date;
  endDate: Date;
  format: string;
  coverImage: CoverImage;
  siteUrl: string;
  genres: string[];
  episodes?: number;
  chapters?: number;
};

type Date = {
  year: number;
  month: number;
  day: number;
};

type CoverImage = {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
};

type Title = {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
};

enum Status {
  Completed = "COMPLETED",
  Current = "CURRENT",
  Dropped = "DROPPED",
  Paused = "PAUSED",
  Planning = "PLANNING",
  Repeating = "REPEATING",
}

export type HistoryType = {
  entryId: number;
  diff: {
    score: number;
    advancedScores: {
      [key: string]: number;
    };
  };
  timestamp: number;
};

export type ScoreSystem =
  | "POINT_100"
  | "POINT_10_DECIMAL"
  | "POINT_10"
  | "POINT_5"
  | "POINT_3";

export const scoreSystemNames = {
  POINT_100: "100 Points",
  POINT_10_DECIMAL: "10 Points (1 Decimal)",
  POINT_10: "10 Points",
  POINT_5: "5 Points",
  POINT_3: "3 Points",
};

export type Settings = {
  scoreSystem: ScoreSystem;
  advancedScoring: boolean;
  advCategories: string[];
  enabledLists: {
    completed: boolean;
    current: boolean;
    planning: boolean;
    paused: boolean;
    dropped: boolean;
  };
  lastFetched?: number;
};

export type ListData = {
  choice: "anime" | "manga" | "unset";
  entries: {
    anime: Entry[];
    manga: Entry[];
  };
  currentEntry: {
    index?: number;
    type?: "anime" | "manga";
    data?: Entry;
  };
  history: {
    anime: HistoryType[];
    manga: HistoryType[];
  };
  lastFetched?: number;
};

export type Viewer = {
  id: number;
  name: string;
  avatar: {
    large: string;
    medium: string;
  };
  token: {
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    acquiredAt?: number;
  };
};

export type UserData = {
  user: Viewer;
  lists: ListData;
  settings: Settings;
};

export const defaultViewerData: Viewer = {
  id: 0,
  name: "",
  avatar: {
    large: "",
    medium: "",
  },
  token: {},
};

export const defaultListData: ListData = {
  choice: "unset",
  entries: {
    anime: [],
    manga: [],
  },
  currentEntry: {},
  history: {
    anime: [],
    manga: [],
  },
};

export const defaultSettings: Settings = {
  scoreSystem: "POINT_10",
  advancedScoring: false,
  advCategories: [],
  enabledLists: {
    completed: true,
    current: true,
    planning: true,
    paused: true,
    dropped: true,
  },
  lastFetched: -1,
};

export const maxScores = {
  POINT_100: 100,
  POINT_10_DECIMAL: 10,
  POINT_10: 10,
  POINT_5: 5,
  POINT_3: 3,
};
