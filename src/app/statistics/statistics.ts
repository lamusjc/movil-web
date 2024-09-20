import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoadingService } from 'src/services/loading.service';
import { StatisticsService } from './statistics.service';
import { LoginService } from '../login/login.service';
import * as moment from 'moment';

@Component({
  selector: 'statistics-component',
  templateUrl: 'statistics.html',
  styleUrls: ['statistics.scss']
})
export class StatisticsComponent {
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Notes created by days' }
  ];
  public notes = [];

  constructor(private loadingService: LoadingService, private menu: MenuController, private loginService: LoginService, private alertController: AlertController, private formBuilder: FormBuilder, private statisticService: StatisticsService, private router: Router) {

  }

  ionViewWillEnter() {
    this.menu.enable(true, 'first');
    this.getNotes();
  }
  getNotes() {
    this.statisticService.getNote().subscribe(res => {
      this.notes = res.data;
      let fechas = [];
      let count = 0;
      let data = [{ data: [], label: 'Notes created by days' }];
      this.notes.forEach((element, index) => {
        if (index == 0) {
          fechas.push(moment(element.note_date_created).format("DD/MM/YYYY"));
          count++;
        } else {
          if (moment(element.note_date_created).format("DD/MM/YYYY") == moment(this.notes[index - 1].note_date_created).format("DD/MM/YYYY")) {
            count++;
          } else {
            fechas.push(moment(element.note_date_created).format("DD/MM/YYYY"));
            data[0].data.push(count);
            count = 1;
          }
        }
        if (index == this.notes.length - 1) {
          data[0].data.push(count);
          count = 1;
        }

      });
      this.barChartLabels = fechas;
      this.barChartData = data;
    }, err => {
      // console.log(err);
    });
  }

  logout() {
    this.loadingService.present();
    this.statisticService.logout().subscribe(res => {
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