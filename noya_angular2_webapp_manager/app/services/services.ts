import {Injectable} from 'angular2/core'
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import * as model from '../dal/models'
import {Observable}     from 'rxjs/Observable';
@Injectable()
export class CacheManager {
    constructor() { }
    public StoreInCache(key: string, value: any): void {
        sessionStorage.setItem(key, value);
    }
    public GetFromCache<T>(key: string, defaultValue: T = null): T {
        var retVal = <T>sessionStorage.getItem(key);
        if (!retVal && defaultValue != null)
            retVal = defaultValue;
        return retVal;
    }
    public RemoveFromCache(key: string): void {
        sessionStorage.removeItem(key);
    }

    public ClearCache(): void {
        sessionStorage.clear();
    }


}




@Injectable()


export class DataService {

    constructor(private http: Http) { }
    //public ConnectToApiData(request: model.DataRequest, url: string): Promise<model.DataResponse> {
    //    let body = JSON.stringify({ request });
    //    let headers = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions({ headers: headers });
    //    return this.http.post(url, body, options)
    //        .toPromise()
    //        .then(this.extractData)
    //        .catch(this.handleError);
    //}


    //private extractData(res: Response): model.DataResponse {
    //    if (res.status < 200 || res.status >= 300) {
    //        throw new Error('Bad response status: ' + res.status);
    //    }
    //    let body = res.json();
    //    return body;
    //}

    public ConnectToApiData(request: model.DataRequest, url: string): Observable<model.DataResponse> {
        let body = JSON.stringify({ request });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, body, options).map((res) => <model.DataResponse>res.json())
            //.do(data => console.log(data)) // eyeball results in the console
            .catch(this.handleError)
    }


    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }


    //private handleError(error: any) {
    //    // In a real world app, we might send the error to remote logging infrastructure
    //    let errMsg = error.message || 'Server error';
    //    console.error(errMsg); // log to console instead
    //    return Promise.reject(errMsg);
    //}
}


/**
 * Async modal dialog service
 * DialogService makes this app easier to test by faking this service.
 * TODO: better modal implemenation that doesn't use window.confirm
 */
@Injectable()
export class DialogService {
    /**
     * Ask user to confirm an action. `message` explains the action and choices.
     * Returns promise resolving to `true`=confirm or `false`=cancel
     */
    confirm(message?: string) {
        return new Promise<boolean>((resolve, reject) =>
            resolve(window.confirm(message || 'Is it OK?')));
    };
}
