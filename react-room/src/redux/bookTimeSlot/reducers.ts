import { ITimeSlotActions } from "./actions"
import { ITimeSlotState } from "./states"

const initialState:ITimeSlotState = {
    timeSlot: []
}

export const timeSlotReducer = (state:ITimeSlotState = initialState, actions: ITimeSlotActions)=>{
    switch(actions.type){
        case "@@BOOKTIMESLOT/TO_STORE_TIME_SLOT":
            return {...state, timeSlot: actions.timeSlot}
        default:
            return state
    }
}