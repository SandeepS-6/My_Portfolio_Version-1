/* Warm the Project Detail chunk before the user navigates. */

let projectDetailWarm = null;

export function prefetchProjectDetail() {
  if (projectDetailWarm) return projectDetailWarm;
  projectDetailWarm = import("./ProjectDetail");
  return projectDetailWarm;
}
