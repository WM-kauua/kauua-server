import { Directive }					from '@angular/core';
import { Validator, ValidatorFn, AbstractControl }	from '@angular/forms';
import { NG_VALIDATORS }				from '@angular/forms';

export function onlyAlphaNumValidator(exp: RegExp): ValidatorFn{
  return (control: AbstractControl): {[ key:string ]: any } => {
    const isNotAlphaNum = exp.test(control.value);
    isNotAlphaNum? console.log('isNotAlphaNum'):console.log('isAlphaNum');
    return isNotAlphaNum? { 'onlyAlphaNum' : { value: 'not an alpha numerical value' } } : null;
  };
}

@Directive({
  selector: '[onlyAlphaNum]',
  providers: [{ provide: NG_VALIDATORS,
    useExisting: onlyAlphaNumValidatorDirective,
    multi: true }]
})
export class onlyAlphaNumValidatorDirective implements Validator{
  
  validate(control: AbstractControl): { [key: string ]: any } {
    console.log('checking validation of '+control.value);
    return onlyAlphaNumValidator( new RegExp(/[^A-Za-z0-9]+/,'i') )(control);
  }
}

