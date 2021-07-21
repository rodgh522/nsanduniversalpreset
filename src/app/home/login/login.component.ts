import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginform: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { 

    this.loginform = fb.group({
      id: ['', [
        Validators.required
      ]],
      pwd: ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
  }

}
