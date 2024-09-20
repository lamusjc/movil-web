import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics';
import { StatisticsService } from './statistics.service';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StatisticsRoutingModule,
        FlexLayoutModule,
        ChartsModule
    ],
    declarations: [StatisticsComponent],
    providers: [StatisticsService]
})
export class StatisticsModule { }
