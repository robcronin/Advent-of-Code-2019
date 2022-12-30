import { logAnswer } from '../utils/logging';
import { day4, day4part2 } from './day4';

const data = '165432-707912';

describe('day 4', () => {
  it('answer', () => {
    const answer = day4(data);
    logAnswer(answer, 4, 1);
    expect(answer).toBe(1716);
  });
});

describe('day 4 part 2', () => {
  it('answer', () => {
    const answer = day4part2(data);
    logAnswer(answer, 4, 2);
    expect(answer).toBe(1163);
  });
});
