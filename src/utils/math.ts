export const getGcd = (a: number, b: number) => {
  while (a != b) {
    if (a > b) a = a - b;
    else b = b - a;
  }
  return b;
};

export const getLcm = (a: number, b: number) => (a * b) / getGcd(a, b);
