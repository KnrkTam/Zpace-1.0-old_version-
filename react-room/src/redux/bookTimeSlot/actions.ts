export const TO_STORE_TIME_SLOT = "@@BOOKTIMESLOT/TO_STORE_TIME_SLOT"

export const toStoreTimeSlot = (timeSlot:any) =>{
    return {
        type: TO_STORE_TIME_SLOT as typeof TO_STORE_TIME_SLOT,
        timeSlot
    }
}

type actionCreators = typeof toStoreTimeSlot

export type ITimeSlotActions = ReturnType<actionCreators>