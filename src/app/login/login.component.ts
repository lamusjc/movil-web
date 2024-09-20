import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { UrlService } from 'src/services/url.service';
import { LoadingService } from 'src/services/loading.service';

@Component({
  selector: 'login-component',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
export class LoginComponent {
  form: FormGroup;

  constructor(public loadingService: LoadingService, private url: UrlService, private alertController: AlertController, private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  processForm(event) {
    event.preventDefault();
    this.loadingService.present();

    this.loginService.loginUser(this.form.value).subscribe(async (res) => {
      this.loadingService.dismiss();
      this.loginService.isAuthenticated = true;
      this.router.navigate(['/home']);

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
