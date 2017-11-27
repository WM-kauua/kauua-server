import { ValidatorFn, AbstractControl }		from '@angular/forms';

export function sameAsValidator(stringToVerify: string) :ValidatorFn{
  return (control: AbstractControl): {[ key: string ] :any } => {
    console.log('valeur controlée :'+control.value+', valeur à controler :'+stringToVerify);
    let value = (control.value == stringToVerify);
    return (value)? null : { 'sameAs' : { value: 'error' }};
  }
}
