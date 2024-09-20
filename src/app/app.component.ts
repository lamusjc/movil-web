import { Component } from '@angular/core';

import { Platform, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './login/login.service';
import { LoadingService } from 'src/services/loading.service';
import { HomeService } from './home/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loadingService: LoadingService,
    private menu: MenuController,
    private loginService: LoginService,
    private alertController: AlertController,
    private router: Router,
    private homeService: HomeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  logout() {
    this.loadingService.present();
    this.homeService.logout().subscribe(res => {
      this.loadingService.dismiss();
      this.loginService.isAuthenticated = false;
      this.router.navigate(['/login']);
    }, err => {
      this.loadingService.dismiss();
      this.alertController.create({
        header: `Error ${err.error.status}`,
        message: `<b> ${err.error.message} </b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
      this.router.navigate(['/login']);
    });
  }
}
