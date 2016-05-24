import {Component, OnInit, ElementRef} from 'angular2/core'
import * as model from '../dal/models'
import * as services from '../services/services'
//import {CKEditor} from 'ng2-ckeditor';

@Component({
    template: require('./biography.html!text'),
    //directives: [CKEditor],
})

export class BiographyComponent implements OnInit {
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    goToBottom: boolean = false;
    active = true;
    cvs: model.CV[];
    tags: Map<string, string>;
    ckeditorContent: string;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService, private element: ElementRef) {
        this.ckeditorContent = `<p>My HTML</p>`;
        this.tags = new Map<string, string>();
        this.tags.set("align_left_1", "<span style='text-align:left'>");
        this.tags.set("align_left_2", "</span>");
        this.tags.set("bold_1", "<span style='font-weight:bold'>");
        this.tags.set("bold_2", "</span>");
    }

    alterText(action: string) {
        switch (action) {
            case "bold":
                var oldTxt = this.getSelectedNode();
                console.log(oldTxt);
                //var newTxt = this.tags.get("bold_1") + oldTxt + this.tags.get("bold_2");
                //console.log("newTxt  " + newTxt);
                //var newHtml = $("#heb").html().replace(oldTxt, newTxt);
                //$("#heb").html(newHtml);
                break;
            case "align_right":
                break;
            case "align_left":
                //var oldTxt = this.getSelectedNode();
                //console.log("oldTxt  " + oldTxt);
                //var newTxt = this.tags.get("align_left_1") + oldTxt + this.tags.get("align_left_2");
                //console.log("newTxt  " + newTxt);
                //var newHtml = $("#heb").html().replace(oldTxt, newTxt);
                //$("#heb").html(newHtml);
                //var ele = <HTMLTextAreaElement>document.getElementById('heb');
                //console.log(ele.selectionStart);
                //console.log(ele.selectionStart);
                ////console.log(ele.selectionEnd);
                //var html = ele.innerHTML;
                //var textBefore = html.slice(0, ele.selectionStart)
                
                //text = text.slice(0, ) + text.slice(ele.selectionEnd);
                //var newTxt = this.tags.get("align_right_1") + txt + this.tags.get("align_right_1");
             
                break;
            case "align_center":
                break;
            case "align_justify":
                break;
        }
    }

    updateCVs() {
        this.updateVariables(true);
        var req: model.UpdateCVRequest = { CVs: [{ Eng: $("#eng").html(), Heb: $("#heb").html(), ID: this.cvs[0].ID, TimeStamp: new Date(), ToDelete: false }] };
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

    getSelectedNode() {

        var selection = window.getSelection().anchorNode;
        return selection;

    }

    ngOnInit() {
        this.loadItems(true);
    }
}