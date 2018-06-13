import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DefaultProvider } from '../../providers/default/default';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiProvider {

  public apiPrefix: string;

  constructor(
    public http: Http,
    private defaults: DefaultProvider
  ) {
    this.apiPrefix = defaults.getDefault('%API_PREFIX%') + '/';
  }

}
