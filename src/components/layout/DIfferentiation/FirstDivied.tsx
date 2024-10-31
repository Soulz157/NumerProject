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
      const result = (Fx[x + h] - Fx[x]) / h;
      return result;
    }

    if (direc === "backward") {
      const result = (Fx[x] - Fx[x - h]) / h;
      return result;
    }

    if (direc === "central") {
      const result = (Fx[x + h] - Fx[x - h]) / (2 * h);
      return result;
    }
  } else if (error === "2") {
    if (direc === "forward") {
      const result = (-Fx[x + 2 * h] + 4 * Fx[x + h] - 3 * Fx[x]) / (2 * h);
      return result;
    }

    if (direc === "backward") {
      const result = (3 * Fx[x] - 4 * Fx[x - h] + Fx[x - 2 * h]) / (2 * h);
      return result;
    }

    if (direc === "central") {
      const result =
        (-Fx[x + 2 * h] + 8 * Fx[x + h] - 8 * Fx[x - h] + Fx[x - 2 * h]) /
        (12 * h);
      return result;
    }
  } else if (error === "3") {
    if (direc === "forward") {
      const result =
        (-25 * Fx[x] +
          48 * Fx[x + h] -
          36 * Fx[x + 2 * h] +
          16 * Fx[x + 3 * h] -
          3 * Fx[x + 4 * h]) /
        (12 * h);
      return result;
    }

    if (direc === "backward") {
      const result =
        (25 * Fx[x] -
          48 * Fx[x - h] +
          36 * Fx[x - 2 * h] -
          16 * Fx[x - 3 * h] +
          3 * Fx[x - 4 * h]) /
        (12 * h);
      return result;
    }

    if (direc === "central") {
      const result =
        (-Fx[x + 2 * h] + 8 * Fx[x + h] - 8 * Fx[x - h] + Fx[x - 2 * h]) /
        (12 * h);
      return result;
    }
  }
}

export default FirstDivied;
