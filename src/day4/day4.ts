import { countArr } from '../utils/array';
import { range } from '../utils/looping';

const isIncreasing = (password: string[]) =>
  password.every(
    (digit, index) => index === 0 || +digit >= +password[index - 1],
  );

const hasDouble = (password: string[]) =>
  password.some((digit, index) => +digit == +password[index - 1]);

const hasStrictDouble = (password: string[]) =>
  password.some(
    (digit, index) =>
      +digit == +password[index - 1] &&
      +digit !== +password[index + 1] &&
      +digit !== +password[index - 2],
  );

const isValidPassword = (password: number) =>
  isIncreasing([...password.toString()]) && hasDouble([...password.toString()]);

const isStrictValidPassword = (password: number) =>
  isIncreasing([...password.toString()]) &&
  hasStrictDouble([...password.toString()]);

export const day4 = (input: string) => {
  const [start, end] = input.split('-');
  return countArr(range(+start, +end + 1), isValidPassword);
};

export const day4part2 = (input: string) => {
  const [start, end] = input.split('-');
  return countArr(range(+start, +end + 1), isStrictValidPassword);
};
