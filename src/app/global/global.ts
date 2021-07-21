import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export class ValidatorsExt extends Validators{
    
    constructor(){
        super();
    }
    
    static checkPwd: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
        // console.log(group.);
        console.log(group.get('rePwd'));
        const pwd = group.get('Pwd').value;
        const rePwd = group.get('rePwd').value;
        return pwd === rePwd ? null : { notSame: true};
    }
}

export function validCheck(controls){
    for(const key in controls){
        if(controls[key] && !controls[key].valid){
            return true;
        }
    }
    return false;
}

export function formToObj(controls){
    let result: any = {};
    for(const key in controls){
        if(controls[key]){
            result[key] = controls[key].value;
        }
    }
    return result;
}