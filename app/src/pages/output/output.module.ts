import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutputPage } from './output';
import { TransactionComponentModule } from '../../components/transaction/transaction.module';
import { HeadNavComponentModule } from '../../components/head-nav/head-nav.module';

@NgModule({
  declarations: [
    OutputPage
  ],
  imports: [
    IonicPageModule.forChild(OutputPage),
    TransactionComponentModule,
    HeadNavComponentModule
  ],
  exports: [
    OutputPage
  ]
})
export class OutputPageModule {}
