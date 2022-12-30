enum OpCode {
  ADD = 1,
  MULTIPLY = 2,
  HALT = 99,
}

type Program = number[];
type ProgramChanges = Record<number, number>;

export class Intcode {
  private program: Program;
  private memory: Program = [];
  private pointer: number = 0;
  private isHalted: boolean = false;
  private isReady: boolean = false;

  constructor(program: Program) {
    this.program = program;
    this.initialiseMemory();
  }

  private initialiseMemory = () => {
    this.memory = [...this.program];
    this.pointer = 0;
    this.isHalted = false;
  };

  private getAddressOfParameter = (parameter: number) =>
    this.memory[this.pointer + parameter];

  private alterMemoryValues = (
    a: number,
    b: number,
    c: number,
    fn: (a: number, b: number) => number,
  ) => {
    const aVal = this.memory[this.getAddressOfParameter(a)];
    const bVal = this.memory[this.getAddressOfParameter(b)];
    const cVal = fn(aVal, bVal);
    this.memory[this.getAddressOfParameter(c)] = cVal;
  };

  private runOperation = () => {
    const opCode = this.memory[this.pointer] as OpCode;
    switch (opCode) {
      case OpCode.ADD:
        this.alterMemoryValues(1, 2, 3, (a, b) => a + b);
        this.pointer += 4;
        break;
      case OpCode.MULTIPLY:
        this.alterMemoryValues(1, 2, 3, (a, b) => a * b);
        this.pointer += 4;

        break;
      case OpCode.HALT:
        this.isHalted = true;
        break;
      default:
        throw new Error(`Unsupported opcode: ${opCode}`);
    }
  };

  public setUpProgram = (programChanges: ProgramChanges) => {
    this.initialiseMemory();
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
    return this.memory[0];
  };
}
