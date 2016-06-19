import {Component, OnInit, AfterViewInit, OnDestroy} from 'angular2/core'
import {Router} from 'angular2/router'
import * as services from '../services/services'
import * as model from '../dal/models'
@Component({ template: require('./updates.editor.html!text') })
export class UpdatesEditorComponent implements AfterViewInit, OnDestroy {
    item: model.Update;
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    constructor(private dataService: services.DataService, private router: Router) {
        this.item = { Data_Eng: '', Data_Heb: '', ID: -1, Order: -1, TimeStamp: new Date(), ToDelete: false }
    }
    ngAfterViewInit() {
        CKEDITOR.replace('editor_eng_update');
        CKEDITOR.replace('editor_heb_update');
    }

    ngOnDestroy() {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
    }

    updateUpdates() {
        var eng = CKEDITOR.instances['editor_eng_update'].getData();
        var heb = CKEDITOR.instances['editor_heb_update'].getData();
        var updatesItems: model.Update[] = [{ Data_Eng: eng, Data_Heb: heb, ID: this.item.ID, Order: this.item.Order, TimeStamp: this.item.TimeStamp, ToDelete: this.item.ToDelete }];

        var req: model.UpdateUpdatesRequest = { Updates: updatesItems };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateUpdates ').subscribe((res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus), (err: model.DataError) => this.postUpdateFail());
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
        this.toHome();

    }

    updateVariables(pending: boolean = this.pending, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;

    }

    toHome() {
        this.router.navigate(['Home']);
    }

}