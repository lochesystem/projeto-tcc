import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { HttpUtilService } from './http-util.service';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

 
@Injectable()
export class TipoTelefoneService {
 
	private path = 'contato/';
 
	constructor(private http: Http, private httpUtil: HttpUtilService) {
	}
 
	listarTodos(): Observable<any[]> { 
		return this.http.get(this.httpUtil.url(this.path) + "getTiposTelefone")
	                .map(this.httpUtil.extrairDados)
	                .catch(this.httpUtil.processarErros);
	}
		
	
}