import { ROOT_URL } from "./env";

function getCourseID(): string {
  return window.location.href.match(/courses\/(\d+)/)?.[1] ?? "NO_COURSE_ID";
}

/// A course is considered "live" if the start date is before the current date
/// Note that concluded courses are also "live" for this purpose

export async function isLiveCourse(): Promise<boolean> {
  const response = await fetch(ROOT_URL + "/api/v1/courses/" + getCourseID());
  const data = await response.json();

  return new Date(data["start_at"]) < new Date();
}
