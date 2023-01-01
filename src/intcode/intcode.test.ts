import { Intcode, IntcodeStatus } from './intcode';
import { addMult, jumpOps } from './intcode.data';

describe('intcode - addition and multiplication', () => {
  it('should return the right output for simple program', () => {
    const intcode = new Intcode([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]);
    intcode.setUpProgram();
    expect(intcode.runProgram()).toBe(3500);
  });
});

describe('intcode - input and output', () => {
  it('should return the right output for single input', () => {
    const intcode = new Intcode([3, 0, 4, 0, 99]);
    intcode.setUpProgram({ inputs: [37] });
    expect(intcode.runProgram()).toBe(37);
  });
  it('should return the right output for multiple inputs', () => {
    const intcode = new Intcode([3, 0, 3, 1, 1, 0, 1, 0, 4, 0, 99]);
    intcode.setUpProgram({ inputs: [37, 5] });
    expect(intcode.runProgram()).toBe(42);
  });
});

describe('intcode - jump operators', () => {
  it('should return the right output for jump operator - position', () => {
    const intcode = new Intcode([
      3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9,
    ]);
    intcode.setUpProgram({ inputs: [0] });
    expect(intcode.runProgram()).toBe(0);
    intcode.setUpProgram({ inputs: [9] });
    expect(intcode.runProgram()).toBe(1);
  });
  it('should return the right output for jump operator - immediate', () => {
    const intcode = new Intcode([
      3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1,
    ]);
    intcode.setUpProgram({ inputs: [9] });
    expect(intcode.runProgram()).toBe(1);
    intcode.setUpProgram({ inputs: [0] });
    expect(intcode.runProgram()).toBe(0);
  });
});

describe('intcode - comparison operators', () => {
  it('should return the right output for equal to 8 program - position', () => {
    const intcode = new Intcode([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8]);
    intcode.setUpProgram({ inputs: [8] });
    expect(intcode.runProgram()).toBe(1);
    intcode.setUpProgram({ inputs: [9] });
    expect(intcode.runProgram()).toBe(0);
  });
  it('should return the right output for less than 8 program - position', () => {
    const intcode = new Intcode([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]);
    intcode.setUpProgram({ inputs: [7] });
    expect(intcode.runProgram()).toBe(1);
    intcode.setUpProgram({ inputs: [8] });
    expect(intcode.runProgram()).toBe(0);
  });
  it('should return the right output for equal to 8 program - immediate', () => {
    const intcode = new Intcode([3, 3, 1108, -1, 8, 3, 4, 3, 99]);
    intcode.setUpProgram({ inputs: [8] });
    expect(intcode.runProgram()).toBe(1);
    intcode.setUpProgram({ inputs: [9] });
    expect(intcode.runProgram()).toBe(0);
  });
  it('should return the right output for less than 8 program - immediate', () => {
    const intcode = new Intcode([3, 3, 1107, -1, 8, 3, 4, 3, 99]);
    intcode.setUpProgram({ inputs: [7] });
    expect(intcode.runProgram()).toBe(1);
    intcode.setUpProgram({ inputs: [8] });
    expect(intcode.runProgram()).toBe(0);
  });
  it('should return the right output for larger comparison program', () => {
    const intcode = new Intcode([
      3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106,
      0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1,
      46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99,
    ]);
    intcode.setUpProgram({ inputs: [7] });
    expect(intcode.runProgram()).toBe(999);
    intcode.setUpProgram({ inputs: [8] });
    expect(intcode.runProgram()).toBe(1000);
    intcode.setUpProgram({ inputs: [9] });
    expect(intcode.runProgram()).toBe(1001);
  });
});

describe('intcode - pausing and resuming', () => {
  it('should handle pausing and resuming a program', () => {
    const intcode = new Intcode([3, 0, 4, 0, 99]);
    intcode.setUpProgram({ inputs: [] });
    expect(intcode.runProgram()).toBe(3);
    expect(intcode.resumeProgram([36])).toBe(36);
  });
  it('should return the correct statuses', () => {
    const intcode = new Intcode([3, 0, 4, 0, 99]);
    expect(intcode.getStatus()).toBe(IntcodeStatus.PENDING);
    intcode.setUpProgram({ inputs: [] });
    expect(intcode.getStatus()).toBe(IntcodeStatus.READY);
    intcode.runProgram();
    expect(intcode.getStatus()).toBe(IntcodeStatus.PAUSED);
    intcode.resumeProgram([36]);
    expect(intcode.getStatus()).toBe(IntcodeStatus.HALTED);
  });
});

describe('parameter modes', () => {
  it('should handle position and immediate parameter modes', () => {
    const intcode = new Intcode([1002, 4, 3, 4, 33]);
    intcode.setUpProgram();
    expect(intcode.runProgram()).toBe(1002);
    expect(intcode.debugGetMemory()).toEqual({
      '0': 1002,
      '1': 4,
      '2': 3,
      '3': 4,
      '4': 99,
      '5': 0,
      '6': 0,
      '7': 0,
    });
  });
  it('should handle relative mode', () => {
    const program = [
      109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99,
    ];
    const intcode = new Intcode(program).setUpProgram();
    expect(intcode.runProgram()).toEqual(99);
    expect(intcode.getAllOutputs()).toEqual(program);
  });
});

describe('intcode - errors', () => {
  it('should throw an error if running before setup', () => {
    const intcode = new Intcode(addMult);
    expect(intcode.runProgram).toThrow('Tried running program pre setup');
  });
  it('should throw an error if resuming non paused', () => {
    const intcode = new Intcode(addMult);
    expect(intcode.resumeProgram).toThrow('Tried resuming non paused program');
  });
  it('should throw an error for unsupported opcode', () => {
    const intcode = new Intcode(addMult);
    intcode.setUpProgram({ programChanges: { 0: 49 } });
    expect(intcode.runProgram).toThrow('Unsupported opcode: 49');
  });
  it('should throw an error for unsupported parameter mode', () => {
    const intcode = new Intcode([9901]);
    intcode.setUpProgram();
    expect(intcode.runProgram).toThrow('Unsupported parameter mode: 9');
  });
});

describe('intcode - larger programs', () => {
  it('should handle add,mult & setup', () => {
    const intcode = new Intcode(addMult);
    intcode.setUpProgram({ programChanges: { 1: 12, 2: 2 } });
    expect(intcode.runProgram()).toBe(5482655);
  });
  it('should handle the addition of inputs,outputs,comparisons,jumps & parameter mode', () => {
    const intcode = new Intcode(jumpOps);
    intcode.setUpProgram({ inputs: [1] });
    expect(intcode.runProgram()).toBe(13978427);
    intcode.setUpProgram({ inputs: [5] });
    expect(intcode.runProgram()).toBe(11189491);
  });
});
