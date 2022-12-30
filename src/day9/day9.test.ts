import { logAnswer } from '../utils/logging';
import { day9, day9part2 } from './day9';
import { data, testData, testData2, testData3 } from './day9.data';

describe('day 9', () => {
  it('test cases', () => {
    expect(day9(testData)).toBe(99);
  });
  it('test cases 2', () => {
    expect(day9(testData2)).toBe(1219070632396864);
  });
  it('test cases 3', () => {
    expect(day9(testData3)).toBe(1125899906842624);
  });

  it('answer', () => {
    const answer = day9(data);
    logAnswer(answer, 9, 1);
    expect(answer).toBe(2745604242);
  });
});

describe('day 9 part 2', () => {
  it('answer', () => {
    const answer = day9part2(data);
    logAnswer(answer, 9, 2);
    expect(answer).toBe(51135);
  });
});
