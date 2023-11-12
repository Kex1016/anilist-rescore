import NState from "nstate";
import {
  ListData,
  Viewer,
  Settings,
  defaultViewerData,
  defaultListData,
  defaultSettings,
} from "../types/UserData";

export class UserStore extends NState<Viewer> {
  public get id() {
    return this.state.id;
  }

  public get name() {
    return this.state.name;
  }

  public get avatar() {
    return this.state.avatar;
  }

  public get token() {
    return this.state.token;
  }

  public set id(id: number) {
    this.setState({ id });
  }

  public set name(name: string) {
    this.setState({ name });
  }

  public set avatar(avatar: Viewer["avatar"]) {
    this.setState({ avatar });
  }

  public set token(token: Viewer["token"]) {
    this.setState({ token });
  }

  public setData(user: Viewer) {
    this.setState(user);
  }

  public checkLogin() {
    const timeNow = new Date().getTime();

    if (!this.state.token) return false;
    if (!this.state.token.expiresIn) return false;
    if (!this.state.token.acquiredAt) return false;

    if (timeNow > this.state.token.expiresIn + this.state.token.acquiredAt) {
      return false;
    } else {
      return true;
    }
  }
}

export class ListStore extends NState<ListData> {
  public get choice() {
    return this.state.choice;
  }

  public get entries() {
    return this.state.entries;
  }

  public get currentEntry() {
    return this.state.currentEntry;
  }

  public get history() {
    return this.state.history;
  }

  public set choice(choice: ListData["choice"]) {
    this.setState({ choice });
  }

  public set entries(entries: ListData["entries"]) {
    this.setState({ entries });
  }

  public set currentEntry(currentEntry: ListData["currentEntry"]) {
    this.setState({ currentEntry });
  }

  public set history(history: ListData["history"]) {
    this.setState({ history });
  }

  public get animeList() {
    return this.state.entries.anime;
  }

  public get mangaList() {
    return this.state.entries.manga;
  }

  public set animeList(anime: ListData["entries"]["anime"]) {
    this.setState({ entries: { ...this.state.entries, anime } });
  }

  public set mangaList(manga: ListData["entries"]["manga"]) {
    this.setState({ entries: { ...this.state.entries, manga } });
  }

  public get animeHistory() {
    return this.state.history.anime;
  }

  public get mangaHistory() {
    return this.state.history.manga;
  }

  public set animeHistory(animeHistory: ListData["history"]["anime"]) {
    this.setState({ history: { ...this.state.history, anime: animeHistory } });
  }

  public set mangaHistory(mangaHistory: ListData["history"]["manga"]) {
    this.setState({ history: { ...this.state.history, manga: mangaHistory } });
  }

  public getEntry(type: "anime" | "manga", id: number) {
    return this.state.entries[type].find((entry) => entry.id === id);
  }

  public setData(data: ListData) {
    this.setState(data);
  }
}

export class SettingsStore extends NState<Settings> {
  public get scoreSystem() {
    return this.state.scoreSystem;
  }

  public set scoreSystem(scoreSystem: Settings["scoreSystem"]) {
    this.setState({ scoreSystem });
  }

  public get advancedScoring() {
    return this.state.advancedScoring;
  }

  public set advancedScoring(advancedScoring: Settings["advancedScoring"]) {
    this.setState({ advancedScoring });
  }

  public get advCategories() {
    return this.state.advCategories;
  }

  public set advCategories(advCategories: Settings["advCategories"]) {
    this.setState({ advCategories });
  }

  public get enabledLists() {
    return this.state.enabledLists;
  }

  public set enabledLists(enabledLists: Settings["enabledLists"]) {
    this.setState({ enabledLists });
  }

  public set enabledCurrentList(
    enabledCurrentList: Settings["enabledLists"]["current"]
  ) {
    this.setState({
      enabledLists: { ...this.state.enabledLists, current: enabledCurrentList },
    });
  }

  public set enabledCompletedList(
    enabledCompletedList: Settings["enabledLists"]["completed"]
  ) {
    this.setState({
      enabledLists: {
        ...this.state.enabledLists,
        completed: enabledCompletedList,
      },
    });
  }

  public set enabledPausedList(
    enabledPausedList: Settings["enabledLists"]["paused"]
  ) {
    this.setState({
      enabledLists: { ...this.state.enabledLists, paused: enabledPausedList },
    });
  }

  public set enabledPlanningList(
    enabledPlanningList: Settings["enabledLists"]["planning"]
  ) {
    this.setState({
      enabledLists: {
        ...this.state.enabledLists,
        planning: enabledPlanningList,
      },
    });
  }

  public set enabledDroppedList(
    enabledDroppedList: Settings["enabledLists"]["dropped"]
  ) {
    this.setState({
      enabledLists: { ...this.state.enabledLists, dropped: enabledDroppedList },
    });
  }

  public get lastFetched() {
    return this.state.lastFetched;
  }

  public set lastFetched(lastFetched: Settings["lastFetched"]) {
    this.setState({ lastFetched });
  }

  public setData(settings: Settings) {
    this.setState(settings);
  }
}

export const userStore = new UserStore(defaultViewerData);
export const listStore = new ListStore(defaultListData);
export const settingsStore = new SettingsStore(defaultSettings);
