import { IWeeklyTimeSlotState } from './state';
import { IWeeklyTimeSlotActions } from './actions';

const initialState: IWeeklyTimeSlotState = {
    weektimeslot: [] 
}

export const weeklyTimeSlotReducer = (state: IWeeklyTimeSlotState = initialState, actions: IWeeklyTimeSlotActions) => {
    switch(actions.type){
        case "@@CREATEROOM/TO_STORE_WEEKLY_TIME_SLOT_CREATE":
            return {...state, weektimeslot: actions.weektimeslot}
        default: 
            return state
    }
}