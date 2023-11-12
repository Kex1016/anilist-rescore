import {
  type List,
  type Viewer as ViewerType,
  ScoreSystem,
} from "../types/UserData";

export const Token = async () => {
  const userData = JSON.parse(
    localStorage.getItem("userData") as string
  ) as ViewerType;

  return userData.token.accessToken;
};

// Extend ViewerType to include mediaListOptions
interface ViewerTypeExtended extends ViewerType {
  mediaListOptions: {
    scoreFormat: ScoreSystem;
    scoring: {
      advancedScoringEnabled: boolean;
      advancedScoring: string[];
    };
  };
}

export const Viewer = async () => {
  const query = `{
        Viewer {
          id
          name
          avatar {
            large
            medium
          }
          mediaListOptions {
            scoreFormat
            scoring: animeList {
              advancedScoringEnabled
              advancedScoring
            }
          }
        }
      }`;

  const token = await Token();
  if (!token) return undefined;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
    }),
  }).then((res) => res.json());

  return res.data.Viewer as ViewerTypeExtended | undefined;
};

export const MediaList = async (type: "ANIME" | "MANGA") => {
  const _u = await Viewer();
  if (!_u) return undefined;

  const query = `{
    MediaListCollection(userName:"${_u.name}",type:${type},forceSingleCompletedList:true) {
      lists {
        name
        isCustomList
        entries {
          id
          media {
            title {
              romaji
              english
              native
              userPreferred
            }
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            format
            coverImage {
              extraLarge
              medium
              color
            }
            description(asHtml: false)
            siteUrl
          }
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
          score
          advancedScores
          status
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await Token()}`,
      },
      body: JSON.stringify({
        query,
      }),
    }).then((res) => res.json());

    return res.data.MediaListCollection.lists as List[] | undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const SetScore = async (
  id: number,
  scores: [number, number, number]
) => {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const query = `mutation {
    SaveMediaListEntry(id:${id},score:${avg},advancedScores:[${scores[0]},${scores[1]},${scores[2]}]) {
      id
      score
      advancedScores
    }
  }`;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${await Token()}`,
    },
    body: JSON.stringify({
      query,
    }),
  }).then((res) => res.json());

  return res.data.SaveMediaListEntry;
};
