import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'form-outlet',
  templateUrl: './form-outlet.component.html',
  styleUrls: ['./form-outlet.component.scss']
})
export class FormOutletComponent {

  form: FormGroup;
  constructor(private httpClient: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
    //TODO will be dynamic
    this.form = this.fb.group({
      'phoneNumber': [ null, Validators.required ],
      'subject': [ null, Validators.required ],
      'message': [ null, Validators.required ],
    })
  }


  runFlow() {
    this.httpClient.post('/api/runWorkflow', this.form.value ).subscribe((res)=>{
      console.log(res);
      this.form.reset();
    });
  }

}
