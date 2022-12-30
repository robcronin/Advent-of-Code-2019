import { Intcode } from '../intcode/intcode';

export const day5 = (input: number[]) => {
  const intcode = new Intcode(input);
  intcode.setUpProgram({}, 1);
  return intcode.runProgram();
};

export const day5part2 = (input: number[]) => {
  const intcode = new Intcode(input);
  intcode.setUpProgram({}, 5);
  return intcode.runProgram();
};
