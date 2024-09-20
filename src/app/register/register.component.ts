import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoadingService } from 'src/services/loading.service';

@Component({
  selector: 'register-component',
  templateUrl: 'register.html',
  styleUrls: ['register.scss']
})
export class RegisterComponent implements OnInit {
  firstName: any;
  lastName: any;
  username: any;
  password: any;
  form: FormGroup;

  constructor(private loadingService: LoadingService, private alertController: AlertController, private formBuilder: FormBuilder, private registerService: RegisterService, private router: Router) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {

  }

  processForm(event) {
    event.preventDefault();
    this.loadingService.present();
    this.registerService.registerUser(this.form.value).subscribe((res) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `OK`,
        message: `<b> ${res.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then((alert) => {
        alert.present().finally(() => {
          this.router.navigate(['/login']);
        });
      });

    }, (err) => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

    });

  }

}
