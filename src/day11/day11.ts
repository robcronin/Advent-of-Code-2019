import { Intcode, IntcodeStatus, Program } from '../intcode/intcode';
import {
  directions,
  genNewExpandingGrid,
  getValueExpandingGrid,
  printExpandingGrid,
  setValueExpandingGrid,
} from '../utils/expandingGrid';

enum Paint {
  BLACK = '.',
  WHITE = '#',
}

enum Signal {
  BLACK = 0,
  WHITE = 1,
}

const runRobot = (program: Program, startPaint: Paint) => {
  const grid = genNewExpandingGrid({ defaultValue: startPaint });
  const visited = new Set<string>();
  const intcode = new Intcode(program).setUpProgram();
  intcode.runProgram();

  let directionIndex = 3;
  let position = { x: 0, y: 0 };
  while (intcode.getStatus() !== IntcodeStatus.HALTED) {
    visited.add(`${position.x},${position.y}`);
    const currentColour = getValueExpandingGrid(grid, position);
    const input = currentColour === Paint.WHITE ? Signal.WHITE : Signal.BLACK;
    intcode.resumeProgram([input]);
    const [paintIndex, turn] = intcode.getAllOutputs();

    const paintColour = paintIndex === Signal.BLACK ? Paint.BLACK : Paint.WHITE;
    setValueExpandingGrid(grid, position, paintColour);

    directionIndex += (turn === 0 ? -1 : 1) + 4;
    directionIndex %= 4;
    const [dx, dy] = directions[directionIndex];
    position.x += dx;
    position.y += dy;
  }
  return { visited, grid };
};

export const day11 = (input: number[]) => {
  const { visited } = runRobot(input, Paint.BLACK);
  return visited.size;
};

export const day11part2 = (input: number[]) => {
  const { grid } = runRobot(input, Paint.WHITE);
  return printExpandingGrid(grid);
};
