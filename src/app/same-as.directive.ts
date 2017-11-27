import { Directive, Input, forwardRef }				from '@angular/core';
import { Validator, ValidatorFn, AbstractControl }		from '@angular/forms';
import { NG_VALIDATORS }					from '@angular/forms';
import { User }							from './models/user';

export function sameAsValidator(thatString: string): ValidatorFn{
  return (control: AbstractControl): {[ key: string ]: any} => {
    const value = (control.value === thatString);
    return (!value)? { 'sameAs': { value: 'peu importe' }}: null;
  };
}

@Directive({
  selector: '[sameAs]',
  providers: [{provide:NG_VALIDATORS,
       useExisting: sameAsValidatorDirective,
       multi: true }]
})
export class sameAsValidatorDirective implements Validator{
  @Input('sameAs') passwordToVerify: string;
  
  validate(control: AbstractControl): {[ key: string ]: any }{
    console.log("mot de passe a verifier :"+this.passwordToVerify);
    return this.passwordToVerify? sameAsValidator(this.passwordToVerify)(control) : null ;  
  }
}
