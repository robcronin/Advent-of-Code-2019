import { range } from '../utils/looping';

enum OpCode {
  ADD = 1,
  MULTIPLY = 2,
  INPUT = 3,
  OUTPUT = 4,
  JUMP_IF_TRUE = 5,
  JUMP_IF_FALSE = 6,
  LESS_THAN = 7,
  EQUALS = 8,
  ADJUST_RELATIVE_BASE = 9,
  HALT = 99,
}

enum ParameterMode {
  POSITION = 0,
  IMMEDIATE = 1,
  RELATIVE = 2,
}

export enum IntcodeStatus {
  PENDING = 1,
  READY = 2,
  HALTED = 3,
  PAUSED = 4,
}

export type Program = number[];
type Memory = Record<number, number>;
type ProgramChanges = Record<number, number>;

export class Intcode {
  private program: Program;
  private memory: Memory = {};
  private pointer: number = 0;
  private relativeBase: number = 0;
  private isHalted: boolean = false;
  private isReady: boolean = false;
  private isPaused: boolean = false;
  private inputs: number[] = [];
  private outputs: number[] = [];

  constructor(program: Program) {
    this.program = program;
    this.initialiseMemory();
  }

  private initialiseMemory = () => {
    this.memory = Object.assign({}, this.program);
    this.pointer = 0;
    this.relativeBase = 0;
    this.isHalted = false;
    this.isReady = false;
    this.isPaused = false;
    this.inputs = [];
    this.outputs = [];
  };

  public get = (index: number) => {
    if (this.memory[index] === undefined) {
      this.memory[index] = 0;
      return 0;
    }
    return this.memory[index];
  };
  public set = (index: number, value: number) => (this.memory[index] = value);

  private getParameterAddress = (parameter: number, mode: ParameterMode) => {
    const parameterMode = mode !== undefined ? mode : 0;
    switch (parameterMode) {
      case ParameterMode.POSITION:
        return this.get(this.pointer + parameter);
      case ParameterMode.IMMEDIATE:
        return this.pointer + parameter;
      case ParameterMode.RELATIVE:
        return this.get(this.pointer + parameter) + this.relativeBase;
      default:
        throw new Error(`Unsupported parameter mode: ${parameterMode}`);
    }
  };

  private getAllParameterAddresses = (modes: ParameterMode[]) =>
    range(1, 4).map((parameter, index) =>
      this.getParameterAddress(parameter, modes[index]),
    );

  private alterMemoryValues = (
    parameterValues: number[],
    writeAddress: number,
    fn: (parameters: number[]) => number,
  ) => {
    const opReturn = fn(parameterValues);
    this.set(writeAddress, opReturn);
  };

  private parseOpCode = (
    fullOpCode: number,
  ): { opCode: OpCode; modes: ParameterMode[] } => {
    const opCode = (fullOpCode % 100) as OpCode;
    const modeString = Math.floor(fullOpCode / 100).toString();
    const modes = [...modeString].reverse().map(Number) as ParameterMode[];
    return { opCode, modes };
  };

  private runOperation = () => {
    const { opCode, modes } = this.parseOpCode(this.get(this.pointer));
    const parameterAddresses = this.getAllParameterAddresses(modes);
    const parameterValues = parameterAddresses.map(this.get);
    switch (opCode) {
      case OpCode.ADD:
        this.alterMemoryValues(
          parameterValues,
          parameterAddresses[2],
          ([a, b]) => a + b,
        );
        this.pointer += 4;
        break;
      case OpCode.MULTIPLY:
        this.alterMemoryValues(
          parameterValues,
          parameterAddresses[2],
          ([a, b]) => a * b,
        );
        this.pointer += 4;
        break;
      case OpCode.INPUT:
        const input = this.inputs.shift();
        if (input === undefined) {
          this.isPaused = true;
        } else {
          this.alterMemoryValues(
            parameterValues,
            parameterAddresses[0],
            () => input,
          );
          this.pointer += 2;
        }
        break;
      case OpCode.OUTPUT:
        this.outputs.push(parameterValues[0]);
        this.pointer += 2;
        break;
      case OpCode.JUMP_IF_TRUE:
        if (parameterValues[0] !== 0) this.pointer = parameterValues[1];
        else this.pointer += 3;
        break;
      case OpCode.JUMP_IF_FALSE:
        if (parameterValues[0] === 0) this.pointer = parameterValues[1];
        else this.pointer += 3;
        break;
      case OpCode.LESS_THAN:
        this.alterMemoryValues(
          parameterValues,
          parameterAddresses[2],
          ([a, b]) => (a < b ? 1 : 0),
        );
        this.pointer += 4;
        break;
      case OpCode.EQUALS:
        this.alterMemoryValues(
          parameterValues,
          parameterAddresses[2],
          ([a, b]) => (a === b ? 1 : 0),
        );
        this.pointer += 4;
        break;
      case OpCode.ADJUST_RELATIVE_BASE:
        this.relativeBase += parameterValues[0];
        this.pointer += 2;
        break;
      case OpCode.HALT:
        this.isHalted = true;
        break;
      default:
        throw new Error(`Unsupported opcode: ${opCode}`);
    }
  };

  public setUpProgram = (setup?: {
    programChanges?: ProgramChanges;
    inputs?: number[];
  }) => {
    this.initialiseMemory();
    if (setup) {
      const { programChanges, inputs } = setup;
      if (programChanges) {
        Object.entries(programChanges).forEach(([address, value]) => {
          this.set(+address, value);
        });
      }
      if (inputs) this.inputs = [...inputs];
    }
    this.isReady = true;
    return this;
  };

  public runProgram = () => {
    if (!this.isReady) throw new Error('Tried running program pre setup');
    while (!this.isHalted && !this.isPaused) this.runOperation();
    this.isReady = false;
    return this.getOutput();
  };

  public resumeProgram = (inputs: number[]) => {
    if (!this.isPaused) throw new Error('Tried resuming non paused program');
    this.inputs = [...inputs];
    this.outputs = [];
    this.isReady = true;
    this.isPaused = false;
    return this.runProgram();
  };

  public getOutput = () => {
    if (this.outputs.length === 0) return this.get(0);
    return this.outputs[this.outputs.length - 1];
  };
  public getAllOutputs = () => this.outputs;

  public getStatus = (): IntcodeStatus => {
    if (this.isReady) return IntcodeStatus.READY;
    if (this.isPaused) return IntcodeStatus.PAUSED;
    if (this.isHalted) return IntcodeStatus.HALTED;
    return IntcodeStatus.PENDING;
  };

  public debugGetMemory = () => this.memory;
}
