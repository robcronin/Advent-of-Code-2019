import { logAnswer } from '../utils/logging';
import { day14, day14part2 } from './day14';
import { data, testData, testData2 } from './day14.data';

describe('day 14', () => {
  it('test cases', () => {
    expect(day14(testData)).toBe(31);
  });
  it('test cases 2', () => {
    expect(day14(testData2)).toBe(13312);
  });

  it('answer', () => {
    const answer = day14(data);
    logAnswer(answer, 14, 1);
    expect(answer).toBe(873899);
  });
});

describe('day 14 part 2', () => {
  it('test cases', () => {
    expect(day14part2(testData2)).toBe(82892753);
  });

  it('answer', () => {
    const answer = day14part2(data);
    logAnswer(answer, 14, 2);
    expect(answer).toBe(1893569);
  });
});
