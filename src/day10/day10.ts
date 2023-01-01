import { countArr } from '../utils/array';
import { Coords, createGridFromInput, Grid } from '../utils/grid';

export const parseAsteroids = (input: string[]) => {
  const grid = createGridFromInput(input);
  grid.print(true);
  const asteroids = grid.findValueInGrid('#');
  return { grid, asteroids };
};

const getMemoKey = (asteroidA: Coords, asteroidB: Coords) => {
  const { x: ax, y: ay } = asteroidA;
  const { x: bx, y: by } = asteroidB;
  if (ax < bx) return `${ax},${ay},${bx},${by}`;
  else if (ax > bx) return `${bx},${by},${ax},${ay}`;
  else {
    if (ay < by) return `${ax},${ay},${bx},${by}`;
    return `${bx},${by},${ax},${ay}`;
  }
};

const getIsAsteroid = (x: number, y: number, grid: Grid<string>) =>
  Number.isInteger(x) && Number.isInteger(y) && grid.get({ x, y }) === '#';

export const canSeeAsteroidAFromB = (
  asteroidA: Coords,
  asteroidB: Coords,
  grid: Grid<string>,
  memo: Record<string, boolean>,
) => {
  const { x: ax, y: ay } = asteroidA;
  const { x: bx, y: by } = asteroidB;
  const memoKey = getMemoKey(asteroidA, asteroidB);
  if (memo[memoKey]) return memo[memoKey];
  if (ax === bx && ay === by) return false;

  const [dx, dy] = [ax - bx, ay - by];
  let [curX, curY] = [bx, by];
  let xChange, yChange;

  let steps = 0;
  let isBlocker = false;

  if (dx === 0) {
    yChange = (steps: number) => steps;
    xChange = (_steps: number) => 0;
  } else if (dy === 0) {
    yChange = (_steps: number) => 0;
    xChange = (steps: number) => steps;
  } else if (Math.abs(dx) < Math.abs(dy)) {
    yChange = (steps: number) => Math.abs((steps * dy) / dx);
    xChange = (steps: number) => steps;
  } else {
    xChange = (steps: number) => Math.abs((steps * dx) / dy);
    yChange = (steps: number) => steps;
  }
  while (!(curX === ax && curY === ay)) {
    steps++;
    curY = by + yChange(steps) * (dy > 0 ? 1 : -1);
    curX = bx + xChange(steps) * (dx > 0 ? 1 : -1);
    if (!(curX === ax && curY === ay)) {
      if (getIsAsteroid(curX, curY, grid)) {
        isBlocker = true;
      }
    }
  }

  const canSee = !isBlocker;
  memo[memoKey] = canSee;
  return canSee;
};

export const countVisibleAsteroids = (
  asteroid: Coords,
  asteroids: Coords[],
  grid: Grid<string>,
  memo: Record<string, boolean>,
) =>
  countArr(asteroids, (other) =>
    canSeeAsteroidAFromB(other, asteroid, grid, memo),
  );

export const getVisibleAsteroids = (
  asteroid: Coords,
  asteroids: Coords[],
  grid: Grid<string>,
  memo: Record<string, boolean>,
) =>
  asteroids.filter((other) =>
    canSeeAsteroidAFromB(other, asteroid, grid, memo),
  );

const getBestStation = (asteroids: Coords[], grid: Grid<string>) => {
  let bestStation = { x: 0, y: 0 };
  const maxVisible = asteroids.reduce((max, asteroid) => {
    const visible = countVisibleAsteroids(asteroid, asteroids, grid, {});
    if (visible > max) {
      bestStation = asteroid;
      return visible;
    }
    return max;
  }, 0);
  return { bestStation, maxVisible };
};

const getSortedVisibleAsteroids = (
  location: Coords,
  asteroids: Coords[],
  grid: Grid<string>,
) => {
  const { x, y } = location;
  const visibleAsteroids = getVisibleAsteroids(location, asteroids, grid, {});
  return visibleAsteroids.sort((a, b) => {
    const { x: ax, y: ay } = a;
    const { x: bx, y: by } = b;
    const [dxa, dya] = [ax - x, ay - y];
    const [dxb, dyb] = [bx - x, by - y];
    if (dxa < 0 && dya >= 0) {
      if (dxb >= 0) return -1;
      if (dyb < 0) return -1;
    } else if (dxa >= 0 && dya >= 0) {
      if (dyb < 0) return -1;
      if (dxb < 0) return 1;
    } else if (dxa >= 0 && dya < 0) {
      if (dyb >= 0) return 1;
      if (dxb < 0) return -1;
    } else {
      if (dyb >= 0) return 1;
      if (dxb >= 0) return 1;
    }
    const angleA = (ay - y) / (ax - x);
    const angleB = (by - y) / (bx - x);
    return angleB - angleA;
  });
};

export const day10 = (input: string[]) => {
  const { asteroids, grid } = parseAsteroids(input);
  const { maxVisible } = getBestStation(asteroids, grid);
  return maxVisible;
};

export const day10part2 = (input: string[]) => {
  const { asteroids, grid } = parseAsteroids(input);
  const { bestStation } = getBestStation(asteroids, grid);
  const sortedVisibleAsteroids = getSortedVisibleAsteroids(
    bestStation,
    asteroids,
    grid,
  );
  return sortedVisibleAsteroids[199].y * 100 + sortedVisibleAsteroids[199].x;
};
