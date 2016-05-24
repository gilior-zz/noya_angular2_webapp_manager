import {Component, OnInit} from 'angular2/core'
import { CanDeactivate, ComponentInstruction } from 'angular2/router'

import * as services from '../services/services'
import * as model from '../dal/models'
@Component({
    template: require('./menu.html!text')
})
export class MenuComponent implements OnInit, CanDeactivate {
    menuItems: model.MenuItem[];
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    active = true;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService) {
    }
    ngOnInit() {
        this.loadItems(false);
    }

    loadItems(updateVariables: boolean) {
        var req: model.DataRequest = {};
        this.dataService.ConnectToApiData(req, 'api/Data/GetMenuItems').subscribe(
            (res: model.MenuResponse) => {
                this.menuItems = res.MenuItems;
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

    routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
        // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged.
        if (!this.pending) {
            return true;
        }
        // Otherwise ask the user with the dialog service and return its
        // promise which resolves to true or false when the user decides
        return this.dialogService.confirm('Discard changes?');
    }

    updateMenuItems() {
        this.updateVariables(true);
        var req: model.UpdateMenuRequest = { MenuItems: this.menuItems };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateMenuItems').subscribe(
            (res: model.UpdateResponse) => this.postUpdate(res.UpdateStatus)
            ,
            (err: model.DataError) => this.postUpdateFail()
        )
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

    postUpdateFail() {
        console.log('error in MenuComponent in updateMenuItems');
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
}