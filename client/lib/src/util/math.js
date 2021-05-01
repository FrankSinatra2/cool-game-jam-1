
export const clamp = (x, min, max) => {
  return Math.max(x, Math.min(x, max));
};

export const almostEqual = (x, y) => {
  return Math.abs(x - y) == 0.0;
}  