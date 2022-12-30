import { Intcode } from './intcode';
import { addMult, simpleAddMult } from './intcode.data';

describe('intcode - addition and multiplication', () => {
  it('should return the right output for simple program', () => {
    const intcode = new Intcode(simpleAddMult);
    intcode.setUpProgram({});
    expect(intcode.runProgram()).toBe(3500);
  });
  it('should allow setup and return the right output for simple program', () => {
    const intcode = new Intcode(addMult);
    intcode.setUpProgram({ 1: 12, 2: 2 });
    expect(intcode.runProgram()).toBe(5482655);
  });
});

describe('intcode - errors', () => {
  it('should throw an error if running before setup', () => {
    const intcode = new Intcode(addMult);
    expect(intcode.runProgram).toThrow('Tried running program pre setup');
  });
  it('should throw an error for unsupported opcode', () => {
    const intcode = new Intcode(addMult);
    intcode.setUpProgram({ 0: 100 });
    expect(intcode.runProgram).toThrow('Unsupported opcode: 100');
  });
});
