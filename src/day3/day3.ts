import {
  ExpandingGrid,
  genNewExpandingGrid,
  getValueExpandingGrid,
  setValueExpandingGrid,
} from '../utils/expandingGrid';
import { Coords } from '../utils/grid';
import { range } from '../utils/looping';

type Direction = 'R' | 'D' | 'L' | 'U';
type Path = Step[];
type Step = {
  direction: Direction;
  length: number;
};
type Intersection = { steps: number; coords: Coords };

export const directions: Record<Direction, [number, number]> = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
};

const parsePaths = (input: string[]): Path[] =>
  input.map((pathString) =>
    pathString.split(',').map((path) => ({
      direction: path[0] as Direction,
      length: +path.slice(1),
    })),
  );

const fillPath1 = (path: Path) => {
  const grid = genNewExpandingGrid({
    numRows: 0,
    numCols: 0,
    defaultValue: 0,
  });
  let [x, y] = [0, 0];
  let steps = 0;
  path.forEach((step) => {
    const [dx, dy] = directions[step.direction];
    range(step.length).forEach(() => {
      steps++;
      x = x + dx;
      y = y + dy;
      setValueExpandingGrid(grid, { x, y }, steps);
    });
  });
  return grid;
};

const getIntersectionsPath2 = (grid: ExpandingGrid<number>, path: Path) => {
  let [x, y] = [0, 0];
  const intersections: Intersection[] = [];
  let path2Steps = 0;
  path.forEach((step) => {
    const [dx, dy] = directions[step.direction];
    range(step.length).forEach(() => {
      path2Steps++;
      x = x + dx;
      y = y + dy;
      const path1Steps = getValueExpandingGrid(grid, { x, y });
      if (path1Steps !== undefined) {
        intersections.push({
          steps: path1Steps + path2Steps,
          coords: { x, y },
        });
      }
    });
  });
  return intersections;
};

const getMinIntersectionDistance = (intersections: Intersection[]) =>
  intersections.reduce((min, intersection) => {
    const {
      coords: { x, y },
    } = intersection;
    const distance = Math.abs(x) + Math.abs(y);
    return Math.min(min, distance);
  }, Number.MAX_SAFE_INTEGER);

const getMinIntersectionSteps = (intersections: Intersection[]) =>
  intersections.reduce((min, intersection) => {
    return Math.min(min, intersection.steps);
  }, Number.MAX_SAFE_INTEGER);

export const day3 = (input: string[]) => {
  const [path1, path2] = parsePaths(input);
  const grid = fillPath1(path1);
  const intersections = getIntersectionsPath2(grid, path2);
  return getMinIntersectionDistance(intersections);
};

export const day3part2 = (input: string[]) => {
  const [path1, path2] = parsePaths(input);
  const grid = fillPath1(path1);
  const intersections = getIntersectionsPath2(grid, path2);

  return getMinIntersectionSteps(intersections);
};
