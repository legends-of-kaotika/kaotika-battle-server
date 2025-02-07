export default class Die{
  private num_faces: number;
  private num_die: number;
  private modifier: number;

  constructor
  (num_die: number, num_faces: number, modifier: number){
    this.num_faces = num_faces;
    this.num_die = num_die;
    this.modifier = modifier;
  }

  public static create(num_die: number, num_faces: number, modifier: number) : Die{
    return new Die(num_die, num_faces, modifier);
  }
  
  public roll() : number{
    let roll = 0;

    for(let i = 0; i < this.num_die; i++){
      roll += Math.floor((Math.random() * this.num_faces) + 1);
    }

    return roll;
  }

  public rollWithModifier() : number{
    return Math.floor(this.roll() + this.modifier);
  } 
}