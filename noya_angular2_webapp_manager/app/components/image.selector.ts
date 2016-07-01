import {Component, OnInit} from 'angular2/core'
import { CanDeactivate, ComponentInstruction } from 'angular2/router'

import * as services from '../services/services'
import * as model from '../dal/models'
@Component({
    selector: 'image-selector',
    template: require('./image.selec tor.html!text')
})
export class ImageSelectorComponent implements OnInit, CanDeactivate {
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

    }


}