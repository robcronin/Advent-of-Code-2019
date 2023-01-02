import { logAnswer } from '../utils/logging';
import { day15, day15part2 } from './day15';
import { data } from './day15.data';

describe('day 15', () => {
  it.skip('answer', () => {
    const answer = day15(data);
    logAnswer(answer, 15, 1);
    expect(answer).toBe(330);
  });
});

describe('day 15 part 2', () => {
  it.skip('answer', () => {
    const answer = day15part2(data);
    logAnswer(answer, 15, 2);
    expect(answer).toBe(352);
  });
});
