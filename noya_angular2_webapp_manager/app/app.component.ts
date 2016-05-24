import {Component} from 'angular2/core'
import {HTTP_PROVIDERS} from "angular2/http"
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router, RouterLink, CanDeactivate, ComponentInstruction, LocationStrategy,
HashLocationStrategy } from "angular2/router";
import {BiographyComponent} from './biography/biography'
import {MenuComponent} from './menu/menu'
import {LinkComponent} from './links/links'
import {LinkEditorComponent} from './links/link.editor'
import * as services from './services/services'
@Component({
    selector: 'my-app',
    template: require('./app.component.html!text'),
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, services.DataService, HTTP_PROVIDERS, services.CacheManager, services.DialogService]
})

@RouteConfig([

    { path: '/menu', name: 'Menu', component: MenuComponent, useAsDefault: true },
    { path: '/biography', name: 'Biography', component: BiographyComponent },
    { path: '/links', name: 'Links', component: LinkComponent },
    { path: '/link.editor', name: 'LinkEditor', component: LinkEditorComponent },

])

export class AppComponent { }