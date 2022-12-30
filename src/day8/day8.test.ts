import { logAnswer } from '../utils/logging';
import { day8, day8part2 } from './day8';
import { data, testData, testData2 } from './day8.data';

describe('day 8', () => {
  it('test cases', () => {
    expect(day8(testData, 3, 2)).toBe(1);
  });

  it('answer', () => {
    const answer = day8(data, 25, 6);
    logAnswer(answer, 8, 1);
    expect(answer).toBe(2440);
  });
});

describe('day 8 part 2', () => {
  it('test cases', () => {
    expect(day8part2(testData2, 2, 2)).toBe(`. #
# .
`);
  });

  it('answer', () => {
    const answer = day8part2(data, 25, 6);
    logAnswer(answer, 8, 2);
    expect(answer).toBe(`. # # . . # # # # . . # # . . . . # # . . # # . .
# . . # . . . . # . # . . # . . . . # . # . . # .
# . . # . . . # . . # . . . . . . . # . # . . . .
# # # # . . # . . . # . . . . . . . # . # . . . .
# . . # . # . . . . # . . # . # . . # . # . . # .
# . . # . # # # # . . # # . . . # # . . . # # . .
`);
  });
});
