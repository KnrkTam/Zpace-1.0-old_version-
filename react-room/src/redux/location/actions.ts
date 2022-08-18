
export const STORE_IP = "@@LOCATION/STORE_IP"
export const CLEAR_LOCATE = "@@LOCATION/CLEAR_LOCATE"
export const TOSET = "@@LOCATION/TOSET"
export const MARKER_IP = "@@LOCATION/MARKER_IP"
export const TO_STORE_ROOM_INFO = "@@LOCATION/TO_STORE_ROOM_INFO"
export const TO_STORE_PLACE = "@@LOCATION/TO_STORE_PLACE"

export const toStorePlace = (place:any) =>{
    return {
        type: TO_STORE_PLACE as typeof TO_STORE_PLACE,
        place
    }
}
export const toStoreMarkerIP = (lat:number| null, lng:number | null) => {
    return {
        type: MARKER_IP as typeof MARKER_IP,
        selected: {
            lat,
            lng,
        }
    }
}
export const toStoreRoomInfo = (chosenRoom:any) => {
    return {
        type: TO_STORE_ROOM_INFO as typeof TO_STORE_ROOM_INFO,
        chosenRoom: chosenRoom
    }
}
export const toStoreIP = (lat:number, lng:number, zoom:number) => {
    return {
        type: STORE_IP as typeof STORE_IP,
        iP: {
            lat,
            lng,
            zoom,
        }
    }
}
export const toSet = (ppl: number, priceRg: number[], date:string) => {
    return {
        type: TOSET as typeof TOSET,
        setting: {
            ppl,
            priceRg,
            date,
        }
    }
}

export const toClearLocate = () => {
    return {
        type: CLEAR_LOCATE as typeof CLEAR_LOCATE,
    }
}


type actionCreators =  typeof toStoreIP | typeof toClearLocate | typeof toSet | typeof toStoreMarkerIP | typeof toStoreRoomInfo | typeof toStorePlace

export type ILocationActions = ReturnType<actionCreators>
export type ISettingActions = ReturnType<actionCreators>
export type IMarkerActions = ReturnType<actionCreators>