import { sumArr } from '../utils/array';
import { Coords3d } from '../utils/grid3d';
import { range } from '../utils/looping';
import { getLcm } from '../utils/math';

type Position = Coords3d;
type Velocity = Coords3d;
const coords = ['x', 'y', 'z'] as (keyof Coords3d)[];

const getMoonPositions = (input: string[]): Position[] =>
  input.map((line) => {
    const groups = line.match(
      new RegExp('^<x=([-0-9]+), y=([-0-9]+), z=([-0-9]+)>$'),
    );
    if (!groups) throw new Error(`Invalid moon positions: ${line}`);
    const [_, x, y, z] = groups;
    return { x: +x, y: +y, z: +z };
  });

const getStartingVelocities = (positions: Position[]) =>
  range(positions.length).map(() => ({
    x: 0,
    y: 0,
    z: 0,
  }));

const updateVelocities = (
  positions: Position[],
  currentVelocities: Velocity[],
): Velocity[] =>
  currentVelocities.map((currentVelocity, velIndex) => {
    const myPosition = positions[velIndex];
    return positions.reduce((newVelocity, otherPosition, posIndex) => {
      if (velIndex === posIndex) return newVelocity;
      const [dx, dy, dz] = coords.map((coord) => {
        const delta = otherPosition[coord] - myPosition[coord];
        return delta === 0 ? delta : delta / Math.abs(delta);
      });
      return {
        x: newVelocity.x + dx,
        y: newVelocity.y + dy,
        z: newVelocity.z + dz,
      };
    }, currentVelocity);
  });

const runStep = (positions: Position[], velocities: Velocity[]) => {
  const newVelocities = updateVelocities(positions, velocities);
  const newPositions = positions.map((position, index) => ({
    x: position.x + newVelocities[index].x,
    y: position.y + newVelocities[index].y,
    z: position.z + newVelocities[index].z,
  }));
  return { newPositions, newVelocities };
};

const runSteps = (
  positionsIn: Position[],
  velocitiesIn: Velocity[],
  numSteps: number,
) => {
  let positions = [...positionsIn];
  let velocities = [...velocitiesIn];
  range(numSteps).forEach(() => {
    const { newPositions, newVelocities } = runStep(positions, velocities);
    positions = newPositions;
    velocities = newVelocities;
  });
  return { positions, velocities };
};

const getTotalEnergy = (positions: Position[], velocities: Velocity[]) =>
  sumArr(
    positions,
    (position, index) =>
      sumArr(Object.values(position), (i) => Math.abs(i)) *
      sumArr(Object.values(velocities[index]), (i) => Math.abs(i)),
  );

const isMatchingOnCoord = (
  positionsA: Position[],
  velocitiesA: Velocity[],
  positionsB: Position[],
  velocitiesB: Velocity[],
  coord: keyof Coords3d,
) =>
  positionsA.every(
    (position, index) => position[coord] === positionsB[index][coord],
  ) &&
  velocitiesA.every(
    (velocity, index) => velocity[coord] === velocitiesB[index][coord],
  );

const getCoordPeriod = (
  positionsIn: Position[],
  velocitiesIn: Velocity[],
  coord: keyof Coords3d,
) => {
  let positions = [...positionsIn];
  let velocities = [...velocitiesIn];
  const { newPositions, newVelocities } = runStep(positions, velocities);
  positions = newPositions;
  velocities = newVelocities;
  let steps = 1;
  while (
    !isMatchingOnCoord(positionsIn, velocitiesIn, positions, velocities, coord)
  ) {
    const { newPositions, newVelocities } = runStep(positions, velocities);
    positions = newPositions;
    velocities = newVelocities;
    steps++;
  }
  return steps;
};

export const day12 = (input: string[], numSteps: number) => {
  const startingPositions = getMoonPositions(input);
  const startingVelocities = getStartingVelocities(startingPositions);
  const { positions, velocities } = runSteps(
    startingPositions,
    startingVelocities,
    numSteps,
  );
  return getTotalEnergy(positions, velocities);
};

export const day12part2 = (input: string[]) => {
  const startingPositions = getMoonPositions(input);
  const startingVelocities = getStartingVelocities(startingPositions);

  const periodX = getCoordPeriod(startingPositions, startingVelocities, 'x');
  const periodY = getCoordPeriod(startingPositions, startingVelocities, 'y');
  const periodZ = getCoordPeriod(startingPositions, startingVelocities, 'z');
  return getLcm(periodX, getLcm(periodY, periodZ));
};
