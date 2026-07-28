/* Warm route chunks + contact APIs before the user navigates. */

import { prefetchContactPage } from "../services/contactPage";
import { prefetchFooter } from "../services/footer";
import { prefetchMeetingSettings } from "../services/meeting";

let projectDetailWarm = null;
let letsTalkWarm = null;

export function prefetchProjectDetail() {
  if (projectDetailWarm) return projectDetailWarm;
  projectDetailWarm = import("./ProjectDetail");
  return projectDetailWarm;
}

export function prefetchLetsTalk() {
  if (!letsTalkWarm) {
    letsTalkWarm = import("./LetsTalk");
  }

  prefetchContactPage();
  prefetchFooter();
  prefetchMeetingSettings();

  return letsTalkWarm;
}
