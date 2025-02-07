export default class Die{
  private num_faces: number;
  private num_die: number;
  private modifier: number;

  constructor
  (num_faces: number, num_die: number, modifier: number){
    this.num_faces = num_faces;
    this.num_die = num_die;
    this.modifier = modifier;
  }

  public static create(num_faces: number, num_die: number, modifier: number) : Die{
    return new Die(num_faces, num_die, modifier);
  }
  
  public roll() : number{
    let roll = 0;

    for(let i = 0; i < this.num_die; i++){
      roll += Math.floor(Math.random() * this.num_faces);
    }

    return roll;
  }

  public rollWithModifier() : number{
    return Math.floor(this.roll() + this.modifier);
  } 
}