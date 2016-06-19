
export interface DataRequest {

}



export interface UpdatesRsponse extends DataResponse {
    Updates: Update[];
}
export interface ImagesRsponse extends DataResponse {
    Images: ImageGalleryItem[];
}
export interface PressRsponse extends DataResponse {
    PressItems: PressItem[];
}



export interface ImageGalleryRequest extends DataRequest {

}


export interface ImageGalleryItem {
    ID: number;
    ImagePath: string
    ImageURL: string
    ImageID: string
    Visible: boolean
    Order: number;
    TimeStamp: Date;
    ToDelete: boolean;
    IsNew: boolean;
}

export interface ImageGalleryResponse extends DataResponse {
    Images: ImageGalleryItem[];

}

export interface PressResponse extends DataResponse {
    PressItems: PressItem[];
}
export interface PressItem {
    ID: number;
    Heb: string;
    Eng: string;
    TimeStamp: Date;
    ToDelete: boolean;
}


export interface Update {

    ID: number;
    Data_Heb: string;
    Data_Eng: string;
    Order: number;
    TimeStamp: Date;
    ToDelete: boolean;
}

export interface CalendarRequest extends DataRequest {


}
export interface UpdateProgramsRequest extends UpdateDataRequest {
    Programs: Program[];
}

export interface Program {
    ID: number;
    Name: string;
    Heb: string;
    Eng: string;
    TimeStamp: Date;
    Order: number;
    ToDelete: boolean;
}



export interface CalendarItem {
    Text_Heb: string;
    Text_Eng: string;
    Visible: boolean;
    TimeStamp: Date;
    DataDate: Date;
    DataDateString: string;
    ID: number;
    ToDelete: boolean;
}

export interface CV {
    ID: number;
    Heb: string;
    Eng: string;
    TimeStamp: Date;
    ToDelete: boolean;
}



export interface CalendarResponse extends DataResponse {
    CalendarItems: CalendarItem[];
}

export interface CVResponse extends DataResponse {
    CVs: CV[];
}

export interface ProgramResponse extends DataResponse {
    Programs: Program[];
}

export interface DataResponse {
}

export interface MenuResponse extends DataResponse {
    //public MenuItem] MenuItems { get; set; }
    MenuItems: MenuItem[];
}

export interface MessageResponse extends DataResponse { }


export interface LinksResponse extends DataResponse {
    Links: Link[];
}

export enum UpdateStatus { Success, Fail }

export interface UpdateResponse {
    UpdateStatus: UpdateStatus;
}

export interface UpdateDataRequest { }

export interface UpdateMenuRequest extends UpdateDataRequest {
    MenuItems: MenuItem[];
}

export interface UpdateLinksRequest extends UpdateDataRequest {
    Links: Link[];
}

export interface UpdateCVRequest extends UpdateDataRequest {
    CVs: CV[];
}

export interface UpdateCalendarRequest extends UpdateDataRequest {
    CalendarItems: CalendarItem[];
}

export interface UpdateUpdatesRequest extends UpdateDataRequest {
    Updates: Update[];
}

export interface UpdateImagesRequest extends UpdateDataRequest {
    Images: ImageGalleryItem[];
}

export interface UpdatePressRequest extends UpdateDataRequest {
    PressItems: PressItem[];
}




export interface Link {
    ID: number;
    Text_Heb: string;
    Address_Heb: string;
    Text_Eng: string;
    Address_Eng: string;
    Order: number
    TimeStamp: Date;
    toDelete: boolean
}

export interface MenuItem {
    ID: number;
    Order: number;
    Text_English: string;
    Text_Hebrew: string;
    isDefault: boolean;
    ToDelete: boolean;
    Name: string;
}

export interface DataError {
    ErrorCode: number;
    ErrorText: string;
}




