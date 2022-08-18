import {  IRoomState } from './states';
import { IRoomActions } from './actions';


const initialState:IRoomState = {
    room: []
}



export const roomInfoReducer = (state:IRoomState = initialState, actions: IRoomActions)=>{
    switch(actions.type){
        case "@@ROOMINFO/TO_STORE_ROOMS":
            return actions.rooms
        default:
            return state
    }
}
