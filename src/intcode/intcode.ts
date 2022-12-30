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
  HALT = 99,
}

enum ParameterMode {
  POSITION = 0,
  IMMEDIATE = 1,
}

type Program = number[];
type ProgramChanges = Record<number, number>;

export class Intcode {
  private program: Program;
  private memory: Program = [];
  private pointer: number = 0;
  private isHalted: boolean = false;
  private isReady: boolean = false;
  private input?: number;
  private outputs: number[] = [];

  constructor(program: Program) {
    this.program = program;
    this.initialiseMemory();
  }

  private initialiseMemory = () => {
    this.memory = [...this.program];
    this.pointer = 0;
    this.isHalted = false;
    this.input = undefined;
    this.outputs = [];
  };

  private getParameter = (parameter: number) =>
    this.memory[this.pointer + parameter];

  private getParameterValue = (parameter: number, mode: ParameterMode) => {
    const parameterMode = mode !== undefined ? mode : 0;
    switch (parameterMode) {
      case ParameterMode.POSITION:
        return this.memory[this.getParameter(parameter)];
      case ParameterMode.IMMEDIATE:
        return this.getParameter(parameter);
      default:
        throw new Error(`Unsupported parameter mode: ${parameterMode}`);
    }
  };

  private getAllParameterValues = (modes: ParameterMode[]) =>
    range(1, 4).map((parameter, index) =>
      this.getParameterValue(parameter, modes[index]),
    );

  private alterMemoryValues = (
    parameterValues: number[],
    writeParamNum: number,
    fn: (parameters: number[]) => number,
  ) => {
    const opReturn = fn(parameterValues);
    this.memory[this.getParameter(writeParamNum)] = opReturn;
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
    const { opCode, modes } = this.parseOpCode(this.memory[this.pointer]);
    const parameterValues = this.getAllParameterValues(modes);
    switch (opCode) {
      case OpCode.ADD:
        this.alterMemoryValues(parameterValues, 3, ([a, b]) => a + b);
        this.pointer += 4;
        break;
      case OpCode.MULTIPLY:
        this.alterMemoryValues(parameterValues, 3, ([a, b]) => a * b);
        this.pointer += 4;
        break;
      case OpCode.INPUT:
        const input = this.input;
        if (input === undefined) throw new Error('Missing input value');
        this.alterMemoryValues(parameterValues, 1, () => input);
        this.pointer += 2;
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
        this.alterMemoryValues(parameterValues, 3, ([a, b]) => (a < b ? 1 : 0));
        this.pointer += 4;
        break;
      case OpCode.EQUALS:
        this.alterMemoryValues(parameterValues, 3, ([a, b]) =>
          a === b ? 1 : 0,
        );
        this.pointer += 4;
        break;
      case OpCode.HALT:
        this.isHalted = true;
        break;
      default:
        throw new Error(`Unsupported opcode: ${opCode}`);
    }
  };

  public setUpProgram = (programChanges: ProgramChanges, input?: number) => {
    this.initialiseMemory();
    if (input !== undefined) this.input = input;
    Object.entries(programChanges).forEach(([address, value]) => {
      this.memory[+address] = value;
    });
    this.isReady = true;
  };

  public runProgram = () => {
    if (!this.isReady) throw new Error('Tried running program pre setup');
    while (!this.isHalted) {
      this.runOperation();
    }
    return this.getOutput();
  };

  public getOutput = () => {
    if (this.outputs.length === 0) return this.memory[0];
    return this.outputs[this.outputs.length - 1];
  };

  public debugGetMemory = () => this.memory;
}
