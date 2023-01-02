import { logAnswer } from '../utils/logging';
import { day13, day13part2 } from './day13';
import { data } from './day13.data';

describe('day 13', () => {
  it('answer', () => {
    const answer = day13(data);
    logAnswer(answer, 13, 1);
    expect(answer).toBe(213);
  });
});

describe('day 13 part 2', () => {
  it('answer', () => {
    const answer = day13part2(data, 0);
    logAnswer(answer, 13, 2);
    expect(answer).toBe(11441);
  });
});
