import {Component, AfterViewInit, OnInit, AfterViewChecked, AfterContentInit, Input, OnDestroy} from 'angular2/core'
import * as services from '../services/services'
import * as model from '../dal/models'
import {Router} from  'angular2/router'
@Component({ selector: 'updates', template: require('./images.pool.html!text') })

export class ImagesPoolComponent implements OnInit, OnDestroy {
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    goToBottom: boolean = false;
    active = true;
    images: model.ImageGalleryItem[];
    editors: Array<string>;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService, private router: Router) {
        //document.location.reload();
    }

    public selectText(ele: HTMLInputElement): void {
        ele.setSelectionRange(0, ele.value.length);
    }



    ngOnDestroy() {

    }
    ngAfterContentInit() {

    }
    ngAfterViewChecked() {

    }

    addNew() {

        this.router.navigate(['ImagesEditor']);
    }
    updateImages() {
        this.updateVariables(true);
        var req: model.UpdateImagesRequest = { Images: this.images };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateImages').subscribe(
            (res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus)
            ,
            (err: model.DataError) => this.postUpdateFail()
        )
    }




    ngAfterViewInit() {

    }
    ngOnInit() {
        this.loadItems(false)
    }
    postUpdateFail() {
        console.log('error in LinkComponent in updateMenuItems');
        this.updateVariables(false, undefined, false, true);
    }
    postUpdateSuccess() {
        this.updateVariables(false, undefined, true, false);
        document.location.reload();
    }
    updateVariables(pending: boolean = this.pending, active: boolean = this.active, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;
        this.active = active;
    }
    postUpdate(updateStatus: model.UpdateStatus): void {
        switch (updateStatus) {
            case model.UpdateStatus.Fail:
                this.postUpdateFail();
                break;
            case model.UpdateStatus.Success:
                this.postUpdateSuccess();
                break;
        }
        this.loadItems(true);

    }



    loadItems(updateVariables: boolean) {
        var req: model.DataRequest = {};
        this.dataService.ConnectToApiData(req, 'api/Data/GetImages').subscribe(
            (res: model.ImagesRsponse) => {
                this.images = res.Images;
                if (updateVariables) {
                    this.updateVariables(undefined, false, undefined, undefined);
                    this.updateVariables(undefined, true, undefined, undefined);
                }
            }, (err: model.DataError) => {

            }
        );
    }

}