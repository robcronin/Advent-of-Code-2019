import { logAnswer } from '../utils/logging';
import { day11, day11part2 } from './day11';
import { data } from './day11.data';

describe('day 11', () => {
  it('answer', () => {
    const answer = day11(data);
    logAnswer(answer, 11, 1);
    expect(answer).toBe(2418);
  });
});

// vscode/prettier is trimming the whitespaces at the end here
describe.skip('day 11 part 2', () => {
  it('answer', () => {
    const answer = day11part2(data);
    logAnswer(answer, 11, 2);
    expect(answer)
      .toBe(`. . # # . . # # # . . # # # # . . . # # . . # # . . # . . . . # # # . . # # # . . .··
      # . . # . # . . # . # . . . . . . . # . # . . # . # . . . . # . . # . # . . # . . .
      # . . . . # . . # . # # # . . . . . # . # . . # . # . . . . # . . # . # . . # . . .
    . # . # # . # # # . . # . . . . . . . # . # # # # . # . . . . # # # . . # # # . . .··
    . # . . # . # . # . . # . . . . # . . # . # . . # . # . . . . # . . . . # . # . .··
      . # # # . # . . # . # # # # . . # # . . # . . # . # # # # . # . . . . # . . # .····`);
  });
});
