function FirstDivied(
  error: string,
  direc: string,
  h: number,
  x: number,
  fx: number[]
) {
  const Fx = [...fx];
  if (error === "1") {
    if (direc === "forward") {
      const result = (Fx[x + 2 * h] - 2 * Fx[x + h] + Fx[x]) / Math.pow(h, 2);
      return result;
    }

    if (direc === "backward") {
      const result = (Fx[x] - 2 * Fx[x - h] + Fx[x - 2 * h]) / Math.pow(h, 2);
      return result;
    }

    if (direc === "central") {
      const result = (Fx[x + h] - 2 * Fx[x] + Fx[x - h]) / Math.pow(h, 2);
      return result;
    }
  } else if (error === "2") {
    if (direc === "forward") {
      const result =
        (-Fx[x + 3 * h] + 4 * Fx[x + 2 * h] - 5 * Fx[x + h] + 2 * Fx[x]) /
        Math.pow(h, 2);
      return result;
    }
    if (direc === "backward") {
      const result =
        (2 * Fx[x] - 5 * Fx[x - h] + 4 * Fx[x - 2 * h] - Fx[x - 3 * h]) /
        Math.pow(h, 2);
      return result;
    }
    if (direc === "central") {
      const result = (Fx[x + h] - 2 * Fx[x] + Fx[x - h]) / Math.pow(h, 2);
      return result;
    }
  } else if (error === "3") {
    if (direc === "forward") {
      const result =
        (35 * Fx[x] -
          104 * Fx[x + h] -
          114 * Fx[x + 2 * h] -
          56 * Fx[x + 3 * h] +
          11 * Fx[x + 4 * h]) /
        (12 * Math.pow(h, 4));
      return result;
    }
    if (direc === "backward") {
      const result =
        (35 * Fx[x] -
          104 * Fx[x - h] +
          114 * Fx[x - 2 * h] -
          56 * Fx[x - 3 * h] +
          11 * Fx[x - 4 * h]) /
        (12 * Math.pow(h, 4));
      return result;
    }
    if (direc === "central") {
      const result =
        (-Fx[x + 2 * h] +
          16 * Fx[x + h] -
          30 * Fx[x] +
          16 * Fx[x - h] -
          Fx[x - 2 * h]) /
        (12 * Math.pow(h, 4));
      return result;
    }
  }
}

export default FirstDivied;
