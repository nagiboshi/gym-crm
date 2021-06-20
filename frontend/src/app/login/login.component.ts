import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommunicationService} from '@shared/communication.service';
import {UserService} from '@shared/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {Branch} from '@models/branch';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  returnUrl: string;
  branches$: Observable<Branch[]>;
  constructor(private router: Router,
              private communicationService: CommunicationService,
              private accountService: UserService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
    // redirect to home if already logged in
    if (this.accountService.token) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      branchId: ['', Validators.required]
    });

    this.branches$ = this.communicationService.fetchBranches();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  authenticate() {

    this.accountService.login(this.form.value.username, this.form.value.password, this.form.value.branchId)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
        });
  }
}
