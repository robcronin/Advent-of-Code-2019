import { Intcode, IntcodeStatus } from '../intcode/intcode';
import {
  ExpandingGrid,
  genNewExpandingGrid,
  setValueExpandingGrid,
} from '../utils/expandingGrid';

enum GameItemCode {
  EMPTY = 0,
  WALL = 1,
  BLOCK = 2,
  PADDLE = 3,
  BALL = 4,
}

enum GameItem {
  EMPTY = ' ',
  WALL = '|',
  BLOCK = '@',
  PADDLE = '_',
  BALL = 'O',
}

const convertCode: Record<GameItemCode, GameItem> = {
  [GameItemCode.EMPTY]: GameItem.EMPTY,
  [GameItemCode.WALL]: GameItem.WALL,
  [GameItemCode.BLOCK]: GameItem.BLOCK,
  [GameItemCode.PADDLE]: GameItem.PADDLE,
  [GameItemCode.BALL]: GameItem.BALL,
};

const updateGameBoard = (
  gameBoard: ExpandingGrid<GameItem>,
  outputs: number[],
) => {
  let score, ball, paddle;
  for (let i = 0; i < outputs.length; i += 3) {
    const [y, x] = [outputs[i], outputs[i + 1]];
    const item = outputs[i + 2] as GameItemCode;
    if (y === -1 && x === 0) score = item;
    if (item === GameItemCode.BALL) ball = { x, y };
    if (item === GameItemCode.PADDLE) paddle = { x, y };

    setValueExpandingGrid(gameBoard, { x, y }, convertCode[item]);
  }
  return { score, ball, paddle };
};

const playGame = (input: number[], remainingBlocks: number) => {
  const intcode = new Intcode(input).setUpProgram({
    programChanges: { 0: 2 },
  });
  intcode.runProgram();
  const gameBoard = genNewExpandingGrid({ defaultValue: GameItem.EMPTY });
  const update = updateGameBoard(gameBoard, intcode.getAllOutputs());
  let { ball, paddle, score } = update;
  if (!ball || !paddle) throw new Error('Missing ball or paddle');

  while (intcode.getStatus() !== IntcodeStatus.HALTED) {
    if (ball.y > paddle.y) intcode.resumeProgram([1]);
    else if (ball.y === paddle.y) intcode.resumeProgram([0]);
    else intcode.resumeProgram([-1]);

    const update = updateGameBoard(gameBoard, intcode.getAllOutputs());
    ball = update.ball || ball;
    paddle = update.paddle || paddle;
    score = update.score;
  }

  return score;
};

export const day13 = (input: number[]) => {
  const intcode = new Intcode(input).setUpProgram();
  intcode.runProgram();
  const outputs = intcode.getAllOutputs();
  let sum = 0;
  for (let i = 2; i < outputs.length; i += 3) {
    if (outputs[i] === GameItemCode.BLOCK) sum++;
  }
  return sum;
};

export const day13part2 = (input: number[], remainingBlocks: number) =>
  playGame(input, remainingBlocks);
