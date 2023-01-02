export const getGcd = (a: number, b: number) => {
  while (a != b) {
    if (a > b) a = a - b;
    else b = b - a;
  }
  return b;
};

export const getLcm = (a: number, b: number) => (a * b) / getGcd(a, b);

export const binarySearch = (input: {
  min: number;
  max: number;
  target: number;
  fn: (x: number) => number;
  leeway?: number;
}): number => {
  const { min, max, target, fn } = input;
  const leeway = input.leeway ?? 0;
  const mid = Math.floor((min + max) / 2);
  const current = fn(mid);

  if (current <= target && current + leeway >= target) return mid;
  else if (target > current)
    return binarySearch({ min: mid + 1, max, target, fn, leeway });
  else return binarySearch({ min, max: mid - 1, target, fn, leeway });
};
