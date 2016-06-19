import {Component, OnInit, AfterViewInit, OnDestroy} from 'angular2/core'
import {Router} from 'angular2/router'
import * as services from '../services/services'
import * as model from '../dal/models'
@Component({ template: require('./press.editor.html!text') })
export class PressEditorComponent implements AfterViewInit, OnDestroy {
    item: model.PressItem;
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    constructor(private dataService: services.DataService, private router: Router) {
        this.item = { Eng:'',Heb:'',ID:-1,TimeStamp:new Date(),ToDelete:false};
    }
    ngAfterViewInit() {
        CKEDITOR.replace('editor_heb_press');
        CKEDITOR.replace('editor_eng_press');
    }

    ngOnDestroy() {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
    }

    updatePressItems() {
        var eng = CKEDITOR.instances['editor_eng_press'].getData();
        var heb = CKEDITOR.instances['editor_heb_press'].getData();
        var pressItems: model.PressItem[] = [{  Eng:eng,Heb:heb,ID:this.item.ID,TimeStamp:this.item.TimeStamp,ToDelete:this.item.ToDelete }];

        var req: model.UpdatePressRequest = { PressItems:pressItems };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdatePress').subscribe((res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus), (err: model.DataError) => this.postUpdateFail());
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
        this.toPrograms();

    }

    updateVariables(pending: boolean = this.pending, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;

    }

    toPrograms() {
        this.router.navigate(['Home']);
    }

}