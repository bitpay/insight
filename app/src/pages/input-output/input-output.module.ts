import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InputOutputPage } from './input-output';
import { TransactionComponentModule } from '../../components/transaction/transaction.module';
import { HeadNavComponentModule } from '../../components/head-nav/head-nav.module';

@NgModule({
  declarations: [
    InputOutputPage,
  ],
  imports: [
    IonicPageModule.forChild(InputOutputPage),
    TransactionComponentModule,
    HeadNavComponentModule
  ],
  exports: [
    InputOutputPage
  ]
})
export class InputOutputPageModule {}
