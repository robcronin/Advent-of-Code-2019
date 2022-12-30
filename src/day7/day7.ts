import { Intcode, IntcodeStatus } from '../intcode/intcode';
import { getPermutations } from '../utils/array';

const getThrusterOutput = (program: number[], phaseSettings: number[]) => {
  let input = 0;
  let thrusterOutput = undefined;

  const amplifiers = phaseSettings.map(() => new Intcode(program));
  while (thrusterOutput === undefined) {
    amplifiers.forEach((amplifier, index) => {
      const status = amplifier.getStatus();
      if (status === IntcodeStatus.PENDING) {
        amplifier.setUpProgram({}, [phaseSettings[index], input]);
        input = amplifier.runProgram();
      } else if (status === IntcodeStatus.PAUSED) {
        input = amplifier.resumeProgram([input]);
      }
    });
    if (amplifiers[amplifiers.length - 1].getStatus() === IntcodeStatus.HALTED)
      thrusterOutput = input;
  }
  return input;
};

const getMaxThrusterOutput = (
  program: number[],
  allowedPhaseSettings: number[],
) =>
  getPermutations(allowedPhaseSettings).reduce(
    (max, phaseSettings) =>
      Math.max(max, getThrusterOutput(program, phaseSettings)),
    0,
  );

export const day7 = (input: number[]) =>
  getMaxThrusterOutput(input, [0, 1, 2, 3, 4]);

export const day7part2 = (input: number[]) =>
  getMaxThrusterOutput(input, [5, 6, 7, 8, 9]);
