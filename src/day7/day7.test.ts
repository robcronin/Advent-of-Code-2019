import { logAnswer } from '../utils/logging';
import { day7, day7part2 } from './day7';
import { data, testData, testData2 } from './day7.data';

describe('day 7', () => {
  it('test cases', () => {
    expect(day7(testData)).toBe(43210);
  });

  it('answer', () => {
    const answer = day7(data);
    logAnswer(answer, 7, 1);
    expect(answer).toBe(880726);
  });
});

describe('day 7 part 2', () => {
  it('test cases', () => {
    expect(day7part2(testData2)).toBe(139629729);
  });

  it('answer', () => {
    const answer = day7part2(data);
    logAnswer(answer, 7, 2);
    expect(answer).toBe(4931744);
  });
});
