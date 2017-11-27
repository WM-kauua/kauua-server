export class Serveur {

  private identifiant_: string ;
  private ip_ : string ; 
  private port_: number ;

  constructor( add: string, id: string ){
    this.identifiant_ = add ;
    this.ip_ = id ;
  }

  get identifiant(): string {
    return this.identifiant_ ;
  }

  set identifiant(value: string) {
    this.identifiant_ = value ;
  }

  get ip(): string {
    return this.ip_;
  }

  set ip(value: string) {
    this.ip_ = value;
  }

  get port(): number {
    return this.port_;
  }

  set port(value: number){
    this.port_ = value ;
  }
}
