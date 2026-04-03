import { wbColleges } from "./wbCollegeData.js";
import { panIndiaColleges } from "./panIndiaCollegeData.js";

// Add unique IDs to avoid collisions
const normalizedWB = wbColleges.map((c) => ({
  ...c,
  state: "West Bengal",
  uid: `wb-${c.id}`,
}));

const normalizedIndia = panIndiaColleges.map((c) => ({
  ...c,
  uid: `in-${c.id}`,
}));

export const allColleges = [
  ...normalizedWB,
  ...normalizedIndia,
];