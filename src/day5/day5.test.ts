import { logAnswer } from '../utils/logging';
import { day5, day5part2 } from './day5';
import { data } from './day5.data';

describe('day 5', () => {
  it('answer', () => {
    const answer = day5(data);
    logAnswer(answer, 5, 1);
    expect(answer).toBe(13978427);
  });
});

describe('day 5 part 2', () => {
  it('answer', () => {
    const answer = day5part2(data);
    logAnswer(answer, 5, 2);
    expect(answer).toBe(11189491);
  });
});
