import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the InputPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage({
   name: 'input',
   segment: 'tx/:txId/:dxNm'
 })
@Component({
  selector: 'page-input',
  templateUrl: 'input.html'
})
export class InputPage {

  public loading: boolean = true;
  private txId: string;
  public dxNm: number;
  public tx: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private api: ApiProvider) {
    this.txId = navParams.get('txId');
    this.dxNm = Number(navParams.get('dxNm'));
    console.log(this.dxNm);
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad InputPage');
  // }

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
