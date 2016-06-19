import {Component, AfterViewInit, OnInit, AfterViewChecked, AfterContentInit, Input, OnDestroy} from 'angular2/core'
import * as services from '../services/services'
import * as model from '../dal/models'
import {Router} from  'angular2/router'
@Component({ selector: 'updates', template: require('./updates.html!text') })

export class UpdatesComponent implements OnInit, OnDestroy {
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    goToBottom: boolean = false;
    active = true;
    updates: model.Update[];
    editors: Array<string>;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService, private router: Router) {
        //document.location.reload();
    }
    ngOnDestroy() {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
    }
    ngAfterContentInit() {

    }
    ngAfterViewChecked() {

    }

    addNew() {
        this.router.navigate(['UpdatesEditor']);
    }
    updateUpdates() {

        this.updates.forEach((item) => {
            var id = 'editor_eng_update_' + item.ID;
            var editorEng = CKEDITOR.instances[id];
            id = 'editor_heb_update_' + item.ID;
            var editorHeb = CKEDITOR.instances[id];
            item.Data_Eng = editorEng.getData();
            item.Data_Heb = editorHeb.getData();
        });

        this.updateVariables(true);
        var req: model.UpdateUpdatesRequest = { Updates: this.updates };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateUpdates').subscribe(
            (res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus)
            ,
            (err: model.DataError) => this.postUpdateFail()
        )
    }


    toCKEDITOR(index: number) {

        if (index == this.updates.length - 1) {
            this.updates.forEach((item) => {
                var engID = 'editor_eng_update_' + item.ID;
                var hebID = 'editor_heb_update_' + item.ID;
                if (!CKEDITOR.instances[engID])
                    CKEDITOR.replace(engID);
                if (!CKEDITOR.instances[hebID])
                    CKEDITOR.replace(hebID);
            })

        }
    }

    //toCKEDITOR() {
    //    this.prgs.forEach((item) => {
    //        CKEDITOR.replace('editor_heb_' + item.ID);
    //        CKEDITOR.replace('editor_eng_' + item.ID);
    //    });
    //}
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
        this.dataService.ConnectToApiData(req, 'api/Data/GetUpdates').subscribe(
            (res: model.UpdatesRsponse) => {
                this.updates = res.Updates;
                if (updateVariables) {
                    this.updateVariables(undefined, false, undefined, undefined);
                    this.updateVariables(undefined, true, undefined, undefined);
                }
            }, (err: model.DataError) => {

            }
        );
    }

}