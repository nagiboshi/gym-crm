import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SocialNetworkAccount} from '@models/member';

function socialAccountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
      const isNotValid = !value.startsWith('http://') && !value.startsWith('https://');
    return  isNotValid ?  {socialAccountError: true}: null;

  };
}

@Component({
  selector: 'social-accounts',
  templateUrl: './social-accounts.component.html',
  styleUrls: ['./social-accounts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SocialAccountsComponent implements OnInit {
  formGroup: FormGroup;
  socialAccountsFormArray: FormArray;
  formArrayValueChangesSub: Subscription;
  socialNetworkIcon: string;
  @Input()
  socialAccounts: SocialNetworkAccount[];
  @Output()
  socialAccountsChanged: EventEmitter<SocialNetworkAccount[]> = new EventEmitter();

  constructor(private fb: FormBuilder) {
  }


  newSocialAccountForm(socialAcc?: SocialNetworkAccount) {
    return this.fb.group({
      id: socialAcc?.id ?? 0,
      address: [socialAcc?.address ?? '', [socialAccountValidator(), Validators.required]]
    });
  }

  ngOnInit(): void {
    this.socialAccountsFormArray = new FormArray([]);
    this.formArrayValueChangesSub = this.socialAccountsFormArray.valueChanges.subscribe((val) => {
      if( this.socialAccountsFormArray.valid ) {
        this.socialAccountsChanged.next(val);
      }
    });
    if( this.socialAccounts) {
      for( const socialAcc of this.socialAccounts ) {
        this.socialAccountsFormArray.push(this.newSocialAccountForm(socialAcc));
      }
    } else {
      this.socialAccountsFormArray.push(this.newSocialAccountForm());
    }
    this.formGroup = this.fb.group({
      socialAccounts: this.socialAccountsFormArray
    });

  }

  addSocialAccount() {
    if(this.socialAccountsFormArray.invalid) {
      return;
    }

    this.socialAccountsFormArray.push(this.newSocialAccountForm());
  }

  removeSocialAcc(i: number) {
    this.socialAccountsFormArray.removeAt(i, {emitEvent: true});
  }
}
