import {
  type List,
  type Viewer as ViewerType,
  ScoreSystem,
  Entry,
} from "@/types/UserData";
import { userStore } from "./state";

export const Token = () => {
  return userStore.token.accessToken;
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

  const token = Token();
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
            genres
            episodes
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
          progress
        }
      }
    }
  }`;

  const token = Token();
  if (!token) return undefined;

  try {
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

    return res.data.MediaListCollection.lists as List[] | undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const SaveScore = async (
  entry: Entry,
  advanced: boolean,
  advancedScores: {[key: string]: number},
  score: number,
) => {
  const query = `mutation ($listId: Int, $score: Float, $advancedScores: [Float]) {
    SaveMediaListEntry (id: $listId, score: $score, advancedScores: $advancedScores) {
      id
      score
      advancedScores
    }
  }`;

  const token = Token();
  if (!token) return undefined;

  // Make sure that score and advancedScores are floats

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          listId: entry.id,
          score: advanced ?
          Object.values(advancedScores).reduce((a, b) => a + b, 0) / Object.values(advancedScores).length
           : parseFloat(score.toString()),
          advancedScores: advanced ? Object.values(advancedScores).map((score) => parseFloat(score.toString())) : undefined,
        },
      }),
    }).then((res) => res.json());

    return res.data.SaveMediaListEntry as Entry | undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
