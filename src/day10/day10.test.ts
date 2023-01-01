import { logAnswer } from '../utils/logging';
import {
  canSeeAsteroidAFromB,
  countVisibleAsteroids,
  day10,
  day10part2,
  parseAsteroids,
} from './day10';
import { data, testData, testData2 } from './day10.data';

const { grid, asteroids } = parseAsteroids(testData);

describe('countVisibleAsteroids', () => {
  it.each([
    [0, 7],
    [2, 6],
    [8, 8],
    [9, 7],
  ])('should count for asteroid %p', (asteroidIndex, numVisible) => {
    expect(
      countVisibleAsteroids(asteroids[asteroidIndex], asteroids, grid, {}),
    ).toBe(numVisible);
  });
});

describe('canSeeAsteroidAFromB', () => {
  it.each([[3, 2, true, asteroids]])(
    'can see %p from %p - %p',
    (a, b, canSee) => {
      expect(canSeeAsteroidAFromB(asteroids[a], asteroids[b], grid, {})).toBe(
        canSee,
      );
    },
  );
});

describe('day 10', () => {
  it('test cases', () => {
    expect(day10(testData)).toBe(8);
  });
  it('test cases 2', () => {
    expect(day10(testData2)).toBe(210); // 7.4s -> 4.3s(memo) -> 0.1s(look on line)
  });

  it('answer', () => {
    const answer = day10(data);
    logAnswer(answer, 10, 1);
    expect(answer).toBe(326); // 19.2 -> 11.1s(memo) -> 0.23s(look on line)
  });
});

describe('day 10 part 2', () => {
  it('test cases', () => {
    expect(day10part2(testData2)).toBe(802);
  });

  it('answer', () => {
    const answer = day10part2(data);
    logAnswer(answer, 10, 2);
    expect(answer).toBe(1623);
  });
});
