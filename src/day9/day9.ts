import { Intcode } from '../intcode/intcode';

export const day9 = (input: number[]) =>
  new Intcode(input).setUpProgram({}, [1]).runProgram();

export const day9part2 = (input: number[]) =>
  new Intcode(input).setUpProgram({}, [2]).runProgram();
