import { Intcode } from '../intcode/intcode';
import { range } from '../utils/looping';

export const day2 = (input: number[]) => {
  const intcode = new Intcode(input);
  intcode.setUpProgram({ 1: 12, 2: 2 });
  return intcode.runProgram();
};

export const day2part2 = (input: number[]) => {
  let ans;
  const intcode = new Intcode(input);
  const target = 19690720;
  range(100).forEach((noun) => {
    range(100).forEach((verb) => {
      intcode.setUpProgram({ 1: noun, 2: verb });
      const output = intcode.runProgram();
      if (output === target) ans = 100 * noun + verb;
    });
  });
  return ans;
};
