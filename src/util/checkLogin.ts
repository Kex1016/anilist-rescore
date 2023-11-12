import { Viewer } from "../types/UserData";

// FIXME: THIS I BROKE EVERY OTHER MODULE BY CHANGING USERDATA TO VIEWER, FIX THIS ASAP
export const checkLogin = (userData: Viewer) => {
  const timeNow = new Date().getTime();

  if (!userData) return false;
  if (!userData.token) return false;
  if (!userData.token.expiresIn) return false;
  if (!userData.token.acquiredAt) return false;

  if (timeNow > userData.token.expiresIn + userData.token.acquiredAt) {
    return false;
  } else {
    return true;
  }
};
