export type AppRole = "STUDENT" | "TEACHER" | "SCHOOL_ADMIN" | "DISTRICT_ADMIN";

export type Permission =
  | "lesson:read"
  | "progress:write"
  | "quiz:attempt"
  | "challenge:participate"
  | "evidence:upload"
  | "submission:verify"
  | "tree:monitor"
  | "school:manage"
  | "district:manage"
  | "dashboard:student"
  | "dashboard:school"
  | "dashboard:district";

const permissions: Record<AppRole, ReadonlySet<Permission>> = {
  STUDENT: new Set([
    "lesson:read",
    "progress:write",
    "quiz:attempt",
    "challenge:participate",
    "evidence:upload",
    "tree:monitor",
    "dashboard:student",
  ]),
  TEACHER: new Set([
    "lesson:read",
    "progress:write",
    "quiz:attempt",
    "challenge:participate",
    "evidence:upload",
    "submission:verify",
    "tree:monitor",
    "dashboard:student",
    "dashboard:school",
  ]),
  SCHOOL_ADMIN: new Set([
    "lesson:read",
    "submission:verify",
    "tree:monitor",
    "school:manage",
    "dashboard:student",
    "dashboard:school",
  ]),
  DISTRICT_ADMIN: new Set([
    "lesson:read",
    "submission:verify",
    "tree:monitor",
    "school:manage",
    "district:manage",
    "dashboard:student",
    "dashboard:school",
    "dashboard:district",
  ]),
};

export function can(role: AppRole, permission: Permission) {
  return permissions[role].has(permission);
}
