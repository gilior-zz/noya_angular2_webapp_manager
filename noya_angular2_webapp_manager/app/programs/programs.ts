import {Component, AfterViewInit, OnInit, AfterViewChecked, AfterContentInit, Input, OnDestroy} from 'angular2/core'
import * as services from '../services/services'
import * as model from '../dal/models'
import {Router} from 'angular2/router'
//declare var CKEDITOR: any;
@Component({ template: require('./programs.html!text') })

export class ProgramsComponent implements AfterViewInit, OnInit, AfterViewChecked, AfterContentInit, OnDestroy {
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    goToBottom: boolean = false;
    active = true;
    prgs: model.Program[];
    editors: Array<string>;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService, private router: Router) {
        //document.location.reload();
    }
    ngAfterContentInit() {

    }

    ngOnDestroy() {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
    }
    ngAfterViewChecked() {

    }

    addNew() {
        this.router.navigate(['ProgramEditor']);
    }
    updatePrograms() {


        this.prgs.forEach((item) => {
            var id = 'editor_eng_' + item.ID;
            var editorEng = CKEDITOR.instances[id];
            id = 'editor_heb_' + item.ID;
            var editorHeb = CKEDITOR.instances[id];
            item.Eng = editorEng.getData();
            item.Heb = editorHeb.getData();
        });

        this.updateVariables(true);
        var req: model.UpdateProgramsRequest = { Programs: this.prgs };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdatePrograms').subscribe(
            (res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus)
            ,
            (err: model.DataError) => this.postUpdateFail()
        )
    }


    toCKEDITOR(id: string) {
        if (CKEDITOR.instances[id]) {
            //CKEDITOR.instances[id].destroy(true);
            //CKEDITOR.instances[id].setData(CKEDITOR.instances[id].getData());
            return;
        }
        else
            CKEDITOR.replace(id);
        //this.editors.push(id);
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
        //for (name in CKEDITOR.instances) {
        //    CKEDITOR.instances[name].destroy(true);
        //}
        var req: model.DataRequest = {};
        this.dataService.ConnectToApiData(req, 'api/Data/GetPrograms').subscribe(
            (res: model.ProgramResponse) => {
                this.prgs = res.Programs;

                if (updateVariables) {
                    this.updateVariables(undefined, false, undefined, undefined);
                    this.updateVariables(undefined, true, undefined, undefined);
                }
            }, (err: model.DataError) => {

            }
        );
    }



}
