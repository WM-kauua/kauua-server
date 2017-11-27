export class User {

  private _id: number;
  private _admin: boolean;

  set admin( value: boolean){
    this._admin = value;
  }

  get admin(): boolean {
    return this._admin;
  }

  set id( value: number) {
    this._id = value;
  }

  get id(): number {
    return this._id;
  }

  constructor( 
    public name: string,
    public password: string,
    public token: string) {}
}
