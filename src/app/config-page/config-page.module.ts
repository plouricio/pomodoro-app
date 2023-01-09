import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigPagePageRoutingModule } from './config-page-routing.module';

import { ConfigPagePage } from './config-page.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigPagePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ConfigPagePage]
})
export class ConfigPagePageModule {}
