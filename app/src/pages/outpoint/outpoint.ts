import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the InputOutputPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: 'outpoint',
  segment: 'tx/:txId/:txDirection/:txIndex'
})
@Component({
  selector: 'page-outpoint',
  templateUrl: 'outpoint.html'
})
export class OutpointPage {

  public loading: boolean = true;
  private txId: string;
  public txIndex: number;
  public txDirection: string;
  public tx: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private api: ApiProvider) {
    this.txId = navParams.get('txId');
    this.txIndex = Number(navParams.get('txIndex'));
    this.txDirection = navParams.get('txDirection');
  }

  public ionViewDidLoad(): void {
    this.http.get(this.api.apiPrefix + 'tx/' + this.txId).subscribe(
      (data) => {
        this.tx = JSON.parse(data['_body']);
        this.loading = false;
      },
      (err) => {
        console.log('err is', err);
        this.loading = false;
      }
    );
  }

  public goToBlock(blockHash: string): void {
    this.navCtrl.push('block-detail', {
      'blockHash': blockHash
    });
  }

}
