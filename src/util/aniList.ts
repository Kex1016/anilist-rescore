import {
  type List,
  type Viewer as ViewerType,
  ScoreSystem,
  Entry,
  HistoryType,
} from "@/types/UserData";
import { listStore, settingsStore, userStore } from "./state";
import { toast } from "sonner";

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
  advancedScores: { [key: string]: number },
  score: number
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
          score: advanced
            ? Object.values(advancedScores).reduce((a, b) => a + b, 0) /
              Object.values(advancedScores).length
            : parseFloat(score.toString()),
          advancedScores: advanced
            ? Object.values(advancedScores).map((score) =>
                parseFloat(score.toString())
              )
            : undefined,
        },
      }),
    }).then((res) => res.json());

    return res.data.SaveMediaListEntry as Entry | undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

function numToLetters(num: number): string {
  // convert number to words (1 -> a, 2 -> b, 27 -> aa, 28 -> ab)
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  let q = num + 1;
  let r = 0;
  while (q > 0) {
    r = q % 26;
    result = letters.charAt(r - 1) + result;
    q = (q - r) / 26;
  }
  return result;
}

export async function SaveHistory(
  history: HistoryType[],
  type: "anime" | "manga"
) {
  // Save history to AniList:
  // - Done with SaveMediaListEntry
  // - 20 entries per request
  // - 4 requests per second
  // - Every entry needs to be saved individually, so we need to batch them in groups of 20

  const token = Token();
  if (!token) return undefined;

  for (let i = 0; i < history.length; i += 20) {
    const entries = history.slice(i, i + 20);

    let query = "mutation{";
    for (const entry of entries) {
      let scoreString = "";
      if (Object.keys(entry.diff.advancedScores).length > 0) {
        // Average is always 0-100 regardless of score system, so if its 10 decimal, we need to multiply by 10
        let avg = 0;
        if (settingsStore.scoreSystem === "POINT_10_DECIMAL") {
          console.log("10 decimal");

          for (const key in entry.diff.advancedScores) {
            avg += entry.diff.advancedScores[key] * 10;
          }

          avg = Math.round(
            avg / Object.keys(entry.diff.advancedScores).length / 10
          );
        } else {
          for (const key in entry.diff.advancedScores) {
            avg += entry.diff.advancedScores[key];
          }

          avg = Math.round(
            avg / Object.keys(entry.diff.advancedScores).length / 10
          );
        }

        let advScores: string[] | number[] = Object.values(
          entry.diff.advancedScores
        );
        if (settingsStore.scoreSystem === "POINT_10_DECIMAL") {
          advScores = advScores.map((score) => (score / 10).toFixed(1));
        }

        // scoreString should be [float, float, float, ...]
        scoreString = `advancedScores: [${advScores.join(
          ","
        )}], scoreRaw: ${avg}`;
      } else {
        scoreString = `score: ${entry.diff.score}`;
      }

      const realEntry = listStore.entries[type][entry.entryId];

      query += `
        ${numToLetters(entry.entryId)}: SaveMediaListEntry(id: ${
        realEntry.id
      }, ${scoreString}) {
          id
          score
          advancedScores
        }
      `;
    }
    query += "}";

    console.log(query);

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

      console.log(res);
    } catch (e) {
      console.error(e);
      return undefined;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  toast("Saved history to AniList!");
}
