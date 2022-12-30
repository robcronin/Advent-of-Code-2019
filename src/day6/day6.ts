import { sumArr } from '../utils/array';

type PlanetMoos = Record<string, string[]>;
type MoonPlanets = Record<string, string>;
type NumOrbits = Record<string, number>;

const CENTER = 'COM';

const parseMoonPlanets = (input: string[]): MoonPlanets =>
  input.reduce((moonPlanets: MoonPlanets, orbitString) => {
    const [planet, moon] = orbitString.split(')');
    return { ...moonPlanets, [moon]: planet };
  }, {});

const getNumOrbitOfMoon = (
  moonPlanets: MoonPlanets,
  moon: string,
  numOrbits: NumOrbits,
): number => {
  if (numOrbits[moon] !== undefined) return numOrbits[moon];
  const num = 1 + getNumOrbitOfMoon(moonPlanets, moonPlanets[moon], numOrbits);
  numOrbits[moon] = num;
  return num;
};

const getAllNumOrbits = (moonPlanets: MoonPlanets) => {
  const numOrbits = { [CENTER]: 0 };
  Object.keys(moonPlanets).forEach((moon) =>
    getNumOrbitOfMoon(moonPlanets, moon, numOrbits),
  );
  return numOrbits;
};

const getPathToCOM = (moonPlanets: MoonPlanets, moon: string) => {
  const path = [];
  let planet = moonPlanets[moon];
  while (planet !== CENTER) {
    path.push(planet);
    planet = moonPlanets[planet];
  }
  return path;
};

const getClosestCommonPlanet = (myPath: string[], santaPath: string[]) => {
  const commonPath = myPath.filter((planet) => santaPath.includes(planet));
  return commonPath[0];
};

export const day6 = (input: string[]) => {
  const moonPlanets = parseMoonPlanets(input);
  const numOrbits = getAllNumOrbits(moonPlanets);
  return sumArr(Object.values(numOrbits), (i) => i);
};

export const day6part2 = (input: string[]) => {
  const moonPlanets = parseMoonPlanets(input);
  const myPath = getPathToCOM(moonPlanets, 'YOU');
  const santaPath = getPathToCOM(moonPlanets, 'SAN');
  const closestCommonPlanet = getClosestCommonPlanet(myPath, santaPath);
  return (
    myPath.findIndex((planet) => planet === closestCommonPlanet) +
    santaPath.findIndex((planet) => planet === closestCommonPlanet)
  );
};
