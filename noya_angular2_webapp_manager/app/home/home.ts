import {Component} from 'angular2/core'
import {PressComponent} from './press'
import {CalendarComponent} from './calendar'
import {UpdatesComponent} from './updates'

@Component({ template: require('./home.html!text'), directives: [PressComponent, CalendarComponent, UpdatesComponent] })
export class HomeComponent {

}