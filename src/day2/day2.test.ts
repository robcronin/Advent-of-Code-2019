import { logAnswer } from '../utils/logging';
import { day2, day2part2 } from './day2';
import { data } from './day2.data';

describe('day 2', () => {
  it('answer', () => {
    const answer = day2(data);
    logAnswer(answer, 2, 1);
    expect(answer).toBe(5482655);
  });
});

describe('day 2 part 2', () => {
  it('answer', () => {
    const answer = day2part2(data);
    logAnswer(answer, 2, 2);
    expect(answer).toBe(4967);
  });
});
