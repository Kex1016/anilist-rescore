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
    localStorage.setItem("user", JSON.stringify(this.state));
  }

  public set name(name: string) {
    this.setState({ name });
    localStorage.setItem("user", JSON.stringify(this.state));
  }

  public set avatar(avatar: Viewer["avatar"]) {
    this.setState({ avatar });
    localStorage.setItem("user", JSON.stringify(this.state));
  }

  public set token(token: Viewer["token"]) {
    this.setState({ token });
    localStorage.setItem("user", JSON.stringify(this.state));
  }

  public setData(user: Viewer) {
    this.setState(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  public checkLogin() {
    const timeNow = new Date().getTime();

    if (!this.state.token) return false;
    if (!this.state.token.accessToken) return false;
    if (!this.state.token.expiresIn) return false;
    if (!this.state.token.acquiredAt) return false;

    return timeNow < this.state.token.expiresIn + this.state.token.acquiredAt;
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

  public get lastFetched() {
    return this.state.lastFetched;
  }

  public set lastFetched(lastFetched: ListData["lastFetched"]) {
    this.setState({ lastFetched });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public set choice(choice: ListData["choice"]) {
    this.setState({ choice });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public set entries(entries: ListData["entries"]) {
    this.setState({ entries });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public set currentEntry(currentEntry: ListData["currentEntry"]) {
    this.setState({ currentEntry });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public set history(history: ListData["history"]) {
    this.setState({ history });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public get animeList() {
    return this.state.entries.anime;
  }

  public get mangaList() {
    return this.state.entries.manga;
  }

  public set animeList(anime: ListData["entries"]["anime"]) {
    this.setState({ entries: { ...this.state.entries, anime } });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public set mangaList(manga: ListData["entries"]["manga"]) {
    this.setState({ entries: { ...this.state.entries, manga } });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public get animeHistory() {
    return this.state.history.anime;
  }

  public get mangaHistory() {
    return this.state.history.manga;
  }

  public set animeHistory(animeHistory: ListData["history"]["anime"]) {
    this.setState({ history: { ...this.state.history, anime: animeHistory } });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public set mangaHistory(mangaHistory: ListData["history"]["manga"]) {
    this.setState({ history: { ...this.state.history, manga: mangaHistory } });
    localStorage.setItem("lists", JSON.stringify(this.state));
  }

  public getEntry(type: "anime" | "manga", id: number) {
    return this.state.entries[type].find((entry) => entry.id === id);
  }

  public setData(data: ListData) {
    this.setState(data);
    localStorage.setItem("lists", JSON.stringify(this.state));
  }
}

export class SettingsStore extends NState<Settings> {
  public get scoreSystem() {
    return this.state.scoreSystem;
  }

  public set scoreSystem(scoreSystem: Settings["scoreSystem"]) {
    this.setState({ scoreSystem });
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public get advancedScoring() {
    return this.state.advancedScoring;
  }

  public set advancedScoring(advancedScoring: Settings["advancedScoring"]) {
    this.setState({ advancedScoring });
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public get advCategories() {
    return this.state.advCategories;
  }

  public set advCategories(advCategories: Settings["advCategories"]) {
    this.setState({ advCategories });
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public get enabledLists() {
    return this.state.enabledLists;
  }

  public set enabledLists(enabledLists: Settings["enabledLists"]) {
    this.setState({ enabledLists });
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public set enabledCurrentList(
    enabledCurrentList: Settings["enabledLists"]["current"]
  ) {
    this.setState({
      enabledLists: { ...this.state.enabledLists, current: enabledCurrentList },
    });
    localStorage.setItem("settings", JSON.stringify(this.state));
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
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public set enabledPausedList(
    enabledPausedList: Settings["enabledLists"]["paused"]
  ) {
    this.setState({
      enabledLists: { ...this.state.enabledLists, paused: enabledPausedList },
    });
    localStorage.setItem("settings", JSON.stringify(this.state));
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
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public set enabledDroppedList(
    enabledDroppedList: Settings["enabledLists"]["dropped"]
  ) {
    this.setState({
      enabledLists: { ...this.state.enabledLists, dropped: enabledDroppedList },
    });
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public get lastFetched() {
    return this.state.lastFetched;
  }

  public set lastFetched(lastFetched: Settings["lastFetched"]) {
    this.setState({ lastFetched });
    localStorage.setItem("settings", JSON.stringify(this.state));
  }

  public setData(settings: Settings) {
    this.setState(settings);
    localStorage.setItem("settings", JSON.stringify(this.state));
  }
}

export const userStore = new UserStore(defaultViewerData);
export const listStore = new ListStore(defaultListData);
export const settingsStore = new SettingsStore(defaultSettings);
