import {Component, OnInit, AfterViewChecked} from 'angular2/core'
import { CanDeactivate, ComponentInstruction, Router, RouteParams } from 'angular2/router'
import * as services from '../services/services'
import * as model from '../dal/models'
@Component({
    template: require('./links.html!text')
})
export class LinkComponent implements OnInit, CanDeactivate, AfterViewChecked {
    links: model.Link[];
    HideProblem: boolean = true;
    HideSuccess: boolean = true;
    pending: boolean = false;
    goToBottom: boolean = false;
    active = true;
    constructor(private dataService: services.DataService, private dialogService: services.DialogService, private router: Router, private routeParams: RouteParams) {
    }
    ngOnInit() {
        this.goToBottom = !!this.routeParams.get('goToBottom');
        this.loadItems(false);
    }

    ngAfterViewChecked() {
        //if (this.goToBottom)
        //$("html, body").animate({ scrollTop: $('#foo').offset().top }, 1000);
    }

    loadItems(updateVariables: boolean): void {
        var req: model.DataRequest = {};
        this.dataService.ConnectToApiData(req, 'api/Data/GetLinks').subscribe(
            (res: model.LinksResponse) => {
                this.links = res.Links;
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

    updateLinks() {
        this.updateVariables(true);
        var req: model.UpdateLinksRequest = { Links: this.links };
        this.dataService.ConnectToApiData(req, 'api/Data/UpdateLinks').subscribe(
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
        console.log('error in LinkComponent in updateMenuItems');
        this.updateVariables(false, undefined, false, true);
    }
    postUpdateSuccess() {
        this.updateVariables(false, undefined, true, false);
    }

    addNew() {
        //var link = ['HeroDetail', { id: this.selectedHero.id }];
        this.router.navigate(['LinkEditor']);
    }

    updateVariables(pending: boolean = this.pending, active: boolean = this.active, hideProblem: boolean = this.HideProblem, hideSuccess: boolean = this.HideSuccess): void {
        this.pending = pending;
        this.HideProblem = hideProblem;
        this.HideSuccess = hideSuccess;
        this.active = active;
    }
}