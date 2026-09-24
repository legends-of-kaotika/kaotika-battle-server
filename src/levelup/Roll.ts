export class Roll {
  readonly numFaces: number;
  readonly numDies: number;
  readonly modifier: number;

  constructor(numFaces: number, numDies: number, modifier: number) {
    this.numFaces = numFaces;
    this.numDies = numDies;
    this.modifier = modifier;
  }

  throwOneDie(): number {
    return Math.floor(Math.random() * this.numFaces) + 1;
  }

  execute(): number {
    let roll = 0;
    for (let i = 0; i < this.numDies; ++i) {
      roll += this.throwOneDie();
    }
    return roll + this.modifier;
  }
}
