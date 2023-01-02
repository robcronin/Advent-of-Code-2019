/*
  ⚠️ This is quite inefficient as I am passing the full input list and rerunning the intcode from scratch on each potential move
*/

import { Intcode } from '../intcode/intcode';
import {
  deepCopyExpandingGrid,
  ExpandingGrid,
  findValuesInExpandingGrid,
  genNewExpandingGrid,
  getValueExpandingGrid,
  setValueExpandingGrid,
} from '../utils/expandingGrid';
import { Coords } from '../utils/grid';

enum Output {
  WALL = 0,
  EMPTY = 1,
  TARGET = 2,
}
enum GridItem {
  EMPTY = '.',
  WALL = '#',
  OXYGEN = 'O',
}

const encodeOption = (input: number[], location: Coords) =>
  `${JSON.stringify(input)} ${location.x},${location.y}`;

const decodeOption = (option: string): [number[], Coords] => {
  const [input, coord] = option.split(' ');
  const [x, y] = coord.split(',');
  return [JSON.parse(input), { x: +x, y: +y }];
};

const directions: Record<number, [number, number]> = {
  1: [-1, 0],
  2: [1, 0],
  3: [0, -1],
  4: [0, 1],
};

const navigateArea = (
  intcode: Intcode,
  options: Set<string> = new Set(),
  grid: ExpandingGrid<string>,
  numSteps: number = 0,
  minStepsToTarget: number = 0,
): number => {
  let targetHit: number | undefined = minStepsToTarget;
  const nextOptions = new Set<string>();
  options.forEach((option) => {
    const [input, location] = decodeOption(option);
    Object.keys(directions).forEach((nextInputItem) => {
      const [dx, dy] = directions[+nextInputItem];
      const nextLocation = { x: location.x + dx, y: location.y + dy };
      if (getValueExpandingGrid(grid, nextLocation)) return;
      const nextInput = [...input, +nextInputItem];
      const output = intcode.setUpProgram({ inputs: nextInput }).runProgram();
      if (output === Output.WALL) {
        setValueExpandingGrid(grid, nextLocation, GridItem.WALL);
      } else {
        if (output === Output.TARGET) {
          targetHit = numSteps + 1;
          setValueExpandingGrid(grid, nextLocation, GridItem.OXYGEN);
        } else {
          setValueExpandingGrid(grid, nextLocation, GridItem.EMPTY);
        }
        nextOptions.add(encodeOption(nextInput, nextLocation));
      }
    });
  });
  if (nextOptions.size === 0) return targetHit;
  return navigateArea(intcode, nextOptions, grid, numSteps + 1, targetHit);
};

const mapOutArea = (input: number[]) => {
  const intcode = new Intcode(input).setUpProgram();
  intcode.runProgram();

  const options = new Set<string>();
  options.add(encodeOption([], { x: 0, y: 0 }));

  const grid = genNewExpandingGrid({ defaultValue: GridItem.EMPTY });
  const minSteps = navigateArea(intcode, options, grid);

  return { grid, minSteps };
};

const getTimeToFillOxygen = (grid: ExpandingGrid<GridItem>) => {
  let [empties, minutes, newGrid] = [1, 0, grid];
  while (empties > 0) {
    const oxygens = findValuesInExpandingGrid(newGrid, GridItem.OXYGEN);
    const oldGrid = newGrid;
    newGrid = deepCopyExpandingGrid(newGrid);
    oxygens.forEach(({ x, y }) => {
      Object.values(directions).forEach(([dx, dy]) => {
        if (
          getValueExpandingGrid(oldGrid, { x: x + dx, y: y + dy }) ===
          GridItem.EMPTY
        ) {
          setValueExpandingGrid(
            newGrid,
            { x: x + dx, y: y + dy },
            GridItem.OXYGEN,
          );
        }
      });
    });
    empties = findValuesInExpandingGrid(newGrid, GridItem.EMPTY).length;
    minutes++;
  }

  return minutes;
};

export const day15 = (input: number[]) => mapOutArea(input).minSteps;

export const day15part2 = (input: number[]) => {
  const { grid } = mapOutArea(input);
  return getTimeToFillOxygen(grid);
};
