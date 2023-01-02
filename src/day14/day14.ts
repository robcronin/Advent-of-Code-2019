import { binarySearch } from '../utils/math';

type Chemical = {
  name: string;
  num: number;
};
type Reaction = {
  inputs: Chemical[];
  output: Chemical;
};
type Reactions = Record<string, Reaction>;
type State = { chemicals: Record<string, number>; oreUsed: number };
const ORE = 'ORE';
const FUEL = 'FUEL';

const parseReactions = (input: string[]): Reactions =>
  input.reduce((reactions, line) => {
    const [lhs, rhs] = line.split(' => ');
    const inputs = lhs.split(', ').map((chemical) => {
      const [num, name] = chemical.split(' ');
      return { name, num: +num };
    });
    const [num, name] = rhs.split(' ');
    const output = { name, num: +num };
    return { ...reactions, [name]: { inputs, output } };
  }, {});

const getOreToCreateChemical = (
  reactions: Reactions,
  chemical: string,
  numNeeded: number = 1,
  state: State = { chemicals: {}, oreUsed: 0 },
) => {
  let currentState = { ...state, chemicals: { ...state.chemicals } };
  const { inputs, output } = reactions[chemical];
  const numReactionsNeeded = Math.ceil(numNeeded / output.num);
  inputs.forEach((input) => {
    if (input.name === ORE) {
      currentState.oreUsed =
        currentState.oreUsed + input.num * numReactionsNeeded;
    } else {
      if (!currentState.chemicals[input.name])
        currentState.chemicals[input.name] = 0;
      if (currentState.chemicals[input.name] < input.num * numReactionsNeeded) {
        currentState = getOreToCreateChemical(
          reactions,
          input.name,
          input.num * numReactionsNeeded - currentState.chemicals[input.name],
          currentState,
        );
      }
      currentState.chemicals[input.name] -= input.num * numReactionsNeeded;
    }
  });
  currentState.chemicals[chemical] += output.num * numReactionsNeeded;
  return currentState;
};

export const day14 = (input: string[]) => {
  const reactions = parseReactions(input);
  return getOreToCreateChemical(reactions, FUEL).oreUsed;
};

export const day14part2 = (input: string[]) => {
  const reactions = parseReactions(input);
  const numOre = 1000000000000;
  const leeway = getOreToCreateChemical(reactions, FUEL).oreUsed;
  return binarySearch({
    min: 0,
    max: Math.ceil((2 * numOre) / leeway),
    target: numOre,
    fn: (numFuel) => getOreToCreateChemical(reactions, FUEL, numFuel).oreUsed,
    leeway,
  });
};
