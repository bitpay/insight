import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InputPage } from './input';
import { TransactionComponentModule } from '../../components/transaction/transaction.module';
import { HeadNavComponentModule } from '../../components/head-nav/head-nav.module';

@NgModule({
  declarations: [
    InputPage
  ],
  imports: [
    IonicPageModule.forChild(InputPage),
    TransactionComponentModule,
    HeadNavComponentModule
  ],
  exports: [
    InputPage
  ]
})
export class InputPageModule {}
