import { Intcode } from '../intcode/intcode';

export const day5 = (input: number[]) => {
  const intcode = new Intcode(input);
  intcode.setUpProgram({ inputs: [1] });
  return intcode.runProgram();
};

export const day5part2 = (input: number[]) => {
  const intcode = new Intcode(input);
  intcode.setUpProgram({ inputs: [5] });
  return intcode.runProgram();
};
