
export interface ILocationState {
    iP: {
        lat: number | null
        lng: number | null
        zoom: number
    }
}

export interface ISettingState {
    setting: {
        ppl: any
        priceRg: number[] | []
        date: string
    }
}

export interface IMarkerState {
    selected: {
        lat: number | null,
        lng: number | null,
    }
}
export interface IToStoreRoomState {
    chosenRoom: any
}

export interface IToPlaceState {
    place: any
}