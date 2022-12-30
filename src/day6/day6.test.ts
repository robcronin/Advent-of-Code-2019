import { logAnswer } from '../utils/logging';
import { day6, day6part2 } from './day6';
import { data, testData, testData2 } from './day6.data';

describe('day 6', () => {
  it('test cases', () => {
    expect(day6(testData)).toBe(42);
  });

  it.skip('answer', () => {
    const answer = day6(data);
    logAnswer(answer, 6, 1);
    expect(answer).toBe(308790);
  });
});

describe('day 6 part 2', () => {
  it('test cases', () => {
    expect(day6part2(testData2)).toBe(4);
  });

  it('answer', () => {
    const answer = day6part2(data);
    logAnswer(answer, 6, 2);
    expect(answer).toBe(472);
  });
});
