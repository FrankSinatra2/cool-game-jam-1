import { almostEqual } from "./math.js";


export const vectorAdd = (vec1, vec2) => {
  return [
    vec1[0] + vec2[0],
    vec1[1] + vec2[1]
  ]
};


export const vectorSub = (vec1, vec2) => {
  return [
    vec1[0] - vec2[0],
    vec1[1] - vec2[1]
  ]
};

export const vectorScale = (vec, scale) => {
  return [
    scale * vec[0],
    scale * vec[1]
  ]
};

export const vectorLength = (vec) => {
  return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
}

export const vectorNorm = (vec) => {
  return vectorScale(vec, 1.0 / vectorLength(vec));
}

export const vectorEqual = (vec1, vec2) => {
  return almostEqual(vec1[0], vec2[0]) && almostEqual(vec1[1], vec2[1]);
}
