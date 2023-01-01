export const countArr = <T>(arr: T[], countFn: (i: T) => boolean) =>
  arr.reduce((acc, i) => (countFn(i) ? acc + 1 : acc), 0);

export const sumArr = <T>(arr: T[], sumFn: (i: T, index: number) => number) =>
  arr.reduce((acc, i, index) => sumFn(i, index) + acc, 0);

export const maxArr = (arr: number[]) =>
  arr.reduce((max, i) => Math.max(max, i), Number.MIN_SAFE_INTEGER);

export const minArr = (arr: number[]) =>
  arr.reduce((min, i) => Math.min(min, i), Number.MAX_SAFE_INTEGER);

export const getPermutations = (inputs: number[]): number[][] => {
  if (inputs.length === 1) return [inputs];
  return inputs.reduce((allPerms: number[][], value) => {
    const remaining = inputs.filter((a) => a !== value);
    const remainingPerms = getPermutations(remaining);
    const perms = remainingPerms.map((perm) => [value].concat(perm));
    return [...allPerms, ...perms];
  }, []);
};
