import { logAnswer } from '../utils/logging';
import { day12, day12part2 } from './day12';
import { data, testData, testData2 } from './day12.data';

describe('day 12', () => {
  it('test cases', () => {
    expect(day12(testData, 10)).toBe(179);
  });
  it('test cases 2', () => {
    expect(day12(testData2, 100)).toBe(1940);
  });

  it('answer', () => {
    const answer = day12(data, 1000);
    logAnswer(answer, 12, 1);
    expect(answer).toBe(8454);
  });
});

describe('day 12 part 2', () => {
  it('test cases', () => {
    expect(day12part2(testData)).toBe(2772);
  });
  it('test cases', () => {
    expect(day12part2(testData2)).toBe(4686774924);
  });
  it.skip('answer', () => {
    const answer = day12part2(data);
    logAnswer(answer, 12, 2);
    expect(answer).toBe(362336016722948);
  });
});
