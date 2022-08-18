import { ILocationState, ISettingState, IMarkerState, IToStoreRoomState, IToPlaceState } from './states';
import { ILocationActions, ISettingActions, IMarkerActions } from './actions';

const initialPlaceState:IToPlaceState = {
    place: []
}
const initialState:ILocationState = {
    iP: {
        lat: 22.396427,
        lng: 114.109497,
        zoom: 11,
    }
}
const initialSettingState: ISettingState = {
    setting: {
        ppl: 1,
        priceRg: [50, 500],
        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    }
}

const initialMarkerState:IMarkerState = {
    selected: {
        lat: null,
        lng: null,
    }
}
const initialStoreRoomState:IToStoreRoomState = {
        chosenRoom: {}
}

export const placeReducer = (state:IToPlaceState = initialPlaceState, actions: ILocationActions)=>{
    switch(actions.type){
        case "@@LOCATION/TO_STORE_PLACE":
            return {...state, place: actions.place}
        default:
            return state
    }
}
export const markerReducer = (state:IMarkerState = initialMarkerState, actions: IMarkerActions)=>{
    switch(actions.type){
        case "@@LOCATION/MARKER_IP":
            return {...state, selected: actions.selected}
        default:
            return state
    }
}
export const toStoreRoomReducer = (state:IToStoreRoomState = initialStoreRoomState, actions: IMarkerActions)=>{
    switch(actions.type){
        case "@@LOCATION/TO_STORE_ROOM_INFO":
            return {...state, chosenRoom: actions.chosenRoom}
        default:
            return state
    }
}

export const locationReducer = (state:ILocationState = initialState, actions: ILocationActions)=>{
    switch(actions.type){
        case "@@LOCATION/STORE_IP":
            return {...state, iP: actions.iP}
        case "@@LOCATION/CLEAR_LOCATE":
            return {...state, location: "", iP: {lat:22.396427, lng: 114.109497, zoom: 8}}
        default:
            return state
    }
}

export const settingReducer = (state: ISettingState = initialSettingState, actions: ISettingActions)=>{
    switch(actions.type){
        case "@@LOCATION/TOSET":
            return {...state, setting: actions.setting}
        default:
            return state
    }
}
