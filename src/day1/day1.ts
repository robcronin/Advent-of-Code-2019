import { sumArr } from '../utils/array';

const getFuelNeeded = (
  mass: number,
  currentFuel: number,
  isRecursive?: boolean,
): number => {
  const extraFuel = Math.floor(mass / 3) - 2;
  if (!isRecursive) return extraFuel + currentFuel;
  if (extraFuel > 0)
    return getFuelNeeded(extraFuel, currentFuel + extraFuel, isRecursive);
  return currentFuel;
};

export const day1 = (input: number[]) =>
  sumArr(input, (mass) => getFuelNeeded(mass, 0));

export const day1part2 = (input: number[]) =>
  sumArr(input, (mass) => getFuelNeeded(mass, 0, true));
