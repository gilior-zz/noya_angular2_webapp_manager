import {Component, OnInit, AfterViewInit, OnDestroy} from 'angular2/core'
import * as model from '../dal/models'
import * as services from '../services/services'


@Component({
    template: require('./biography.html!text')
})

export class BiographyComponent implements OnInit, AfterViewInit, OnDestroy {

    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    goToBottom: boolean = false;
    active = true;
    cvs: model.CV[];
    heb: string;
    eng: string;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService) {

    }

    ngOnDestroy() {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
    }

    ngAfterViewInit() {


    }



    updateCVs() {
        var eng = CKEDITOR.instances['editor_eng'].getData();
        var heb = CKEDITOR.instances['editor_heb'].getData();
        this.updateVariables(true);
        var req: model.UpdateCVRequest = { CVs: [{ Eng: eng, Heb: heb, ID: this.cvs[0].ID, TimeStamp: new Date(), ToDelete: false }] };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateBiography').subscribe(
            (res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus)
            ,
            (err: model.DataError) => this.postUpdateFail()
        )
    }

    postUpdateFail() {
        console.log('error in LinkComponent in updateMenuItems');
        this.updateVariables(false, undefined, false, true);
    }
    postUpdateSuccess() {
        this.updateVariables(false, undefined, true, false);
    }

    updateVariables(pending: boolean = this.pending, active: boolean = this.active, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;
        this.active = active;
    }

    loadItems(updateVariables: boolean): void {
        var req: model.DataRequest = {};
        this.dataService.ConnectToApiData(req, 'api/Data/GetCV').subscribe(
            (res: model.CVResponse) => {
                this.cvs = res.CVs;
                this.heb = this.cvs[0].Heb;
                this.eng = this.cvs[0].Eng;
                if (updateVariables) {
                    this.updateVariables(undefined, false, undefined, undefined);
                    this.updateVariables(undefined, true, undefined, undefined);
                }
            },
            (err: model.DataError) => {
                console.log(err.ErrorText);
                if (updateVariables) {
                    this.updateVariables(undefined, false, undefined, undefined);
                    this.updateVariables(undefined, true, undefined, undefined);
                }
            })
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


    toCKEDITOR() {
        var engID = 'editor_eng';
        var hebID = 'editor_heb';
        if (!CKEDITOR.instances[engID])
            CKEDITOR.replace(engID);
        if (!CKEDITOR.instances[hebID])
            CKEDITOR.replace(hebID);
    }

    ngOnInit() {
        this.loadItems(true);

    }
}


