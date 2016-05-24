import {Component} from 'angular2/core'
import * as model from '../dal/models'
import * as services from '../services/services'
import { Router } from "angular2/router";

@Component({
    template: require('./link.editor.html!text'),
})
export class LinkEditorComponent {
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    item: model.Link;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService, private router: Router) {
        this.item = { Address_Eng: '', Address_Heb: '', ID: -1, Order: -1, Text_Eng: '', Text_Heb: '', TimeStamp: null, toDelete: false };
    }

    updateLinks() {
        var links: model.Link[] = [{ Address_Eng: this.item.Address_Eng, Address_Heb: this.item.Address_Heb, ID: this.item.ID, Order: this.item.Order, Text_Eng: this.item.Text_Eng, Text_Heb: this.item.Text_Heb, toDelete: false, TimeStamp: new Date() }]
        var req: model.UpdateLinksRequest = { Links: links };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateLinks').subscribe((res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus), (err: model.DataError) => this.postUpdateFail());
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
        this.toLinks(true);

    }

    updateVariables(pending: boolean = this.pending, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;

    }

    toLinks(goToBottom: boolean) {
        this.router.navigate(['Links', { goToBottom: goToBottom }]);
    }
}
