import { NgModule }         from '@angular/core';
import { IonicModule }      from 'ionic-angular';
import { ComponentsModule } from '../components';
import { HeadNavComponentModule } from '../components/head-nav/head-nav.module';
import {
  BlocksPage,
  BroadcastTxPage,
  NodeStatusPage,
  VerifyMessagePage
} from './index';

@NgModule({
  declarations: [
    BlocksPage,
    BroadcastTxPage,
    NodeStatusPage,
    VerifyMessagePage
  ],
  imports: [ IonicModule, ComponentsModule, HeadNavComponentModule ],
  exports: [
    // CustomComponent,
  ],
  entryComponents: [],
  providers: []
})

export class PagesModule {}
