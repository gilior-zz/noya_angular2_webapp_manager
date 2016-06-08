import {Component, OnInit, AfterViewInit, OnDestroy} from 'angular2/core'
import {Router} from 'angular2/router'
import * as services from '../services/services'
import * as model from '../dal/models'
@Component({ template: require('./program.editor.html!text') })
export class ProgramEditorComponent implements AfterViewInit, OnDestroy {
    item: model.Program;
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    constructor(private dataService: services.DataService, private router: Router) {
        this.item = { Eng: '', Heb: '', ID: -1, Name: '', Order: 0, TimeStamp: null, ToDelete: false }
    }
    ngAfterViewInit() {
        CKEDITOR.replace('editor_heb');
        CKEDITOR.replace('editor_eng');
    }

    ngOnDestroy() {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
    } 

    updatePrograms() {
        var eng = CKEDITOR.instances['editor_eng'].getData();
        var heb = CKEDITOR.instances['editor_heb'].getData();
        var prgs: model.Program[] = [{ Eng: eng, Heb: heb, ID: this.item.ID, Order: this.item.Order, ToDelete: this.item.ToDelete, TimeStamp: new Date(), Name: this.item.Name }]
        var req: model.UpdateProgramsRequest = { Programs: prgs };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdatePrograms').subscribe((res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus), (err: model.DataError) => this.postUpdateFail());
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
        this.toPrograms(true);

    }

    updateVariables(pending: boolean = this.pending, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;

    }

    toPrograms(goToBottom: boolean) {
        this.router.navigate(['Programs']);
    }

}