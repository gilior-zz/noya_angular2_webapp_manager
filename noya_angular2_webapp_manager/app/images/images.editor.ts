import {Component, OnInit, AfterViewInit, OnDestroy} from 'angular2/core'
import {Router} from 'angular2/router'
import * as services from '../services/services'
import * as model from '../dal/models'
@Component({ template: require('./images.editor.html!text') })
export class ImagesEditorComponent implements AfterViewInit, OnDestroy {
    item: model.ImageGalleryItem;
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    constructor(private dataService: services.DataService, private router: Router) {
        this.item = { ID: -1, ImageID: '', ImagePath: '', ImageURL: '', IsNew: true, Order: -1, TimeStamp: new Date(), ToDelete: false, Visible: true }
    }
    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }

    updateIamges() {
        var items: model.ImageGalleryItem[] = new Array();
        var ele = <HTMLInputElement>$("#fileupload")[0];

        for (var i = 0; i < ele.files.length; i++) {
            items.push({ ID: -1, ImageID: '-1', ImagePath: ele.files[i].name, ImageURL: '', IsNew: true, Order: -1, TimeStamp: new Date(), ToDelete: false, Visible: true });
        }

        var req: model.UpdateImagesRequest = { Images: items };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateImages').subscribe((res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus), (err: model.DataError) => this.postUpdateFail());
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
    }

    postUpdateFail() {
        console.log('error in LinkComponent in updateMenuItems');
        this.updateVariables(false, false, true);
    }
    postUpdateSuccess() {
        this.updateVariables(false, true, false);
        this.toImages();

    }

    updateVariables(pending: boolean = this.pending, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;

    }

    toImages() {
        this.router.navigate(['Images']);
    }



}