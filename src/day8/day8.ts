import { countArr } from '../utils/array';
import { Grid } from '../utils/grid';

const chunkInput = (input: number[], numCols: number, numRows: number) => {
  const layerSize = numCols * numRows;
  const layers = [];
  for (let i = 0; i < input.length; i += layerSize) {
    layers.push(input.slice(i, i + layerSize));
  }
  return layers;
};

const findMinZeroLayer = (layers: number[][]) => {
  let layerIndex = 0;
  let minNumZeroes = layers[0].length;
  layers.forEach((layer, index) => {
    const numZeroes = countArr(layer, (i) => i === 0);
    if (numZeroes < minNumZeroes) {
      layerIndex = index;
      minNumZeroes = numZeroes;
    }
  });
  return layers[layerIndex];
};

const createGridFromLayers = (
  layers: number[][],
  numCols: number,
  numRows: number,
) => {
  const grid = new Grid(numRows, numCols, ' ');
  layers.forEach((layer) => {
    grid.runSettingFn(({ coords: { x, y } }) => {
      const pixel = layer[x * numCols + y];
      const value = grid.get({ x, y });
      if (value === ' ' && (pixel === 0 || pixel === 1)) {
        return pixel === 0 ? '.' : '#';
      }
      return value;
    });
  });
  return grid.print(true);
};

export const day8 = (input: number[], numCols: number, numRows: number) => {
  const layers = chunkInput(input, numCols, numRows);
  const layer = findMinZeroLayer(layers);
  const numOnes = countArr(layer, (i) => i === 1);
  const numTwos = countArr(layer, (i) => i === 2);
  return numOnes * numTwos;
};

export const day8part2 = (
  input: number[],
  numCols: number,
  numRows: number,
) => {
  const layers = chunkInput(input, numCols, numRows);
  return createGridFromLayers(layers, numCols, numRows);
};
