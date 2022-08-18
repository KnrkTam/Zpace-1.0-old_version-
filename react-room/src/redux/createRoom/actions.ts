export const TO_STORE_WEEKLY_TIME_SLOT_CREATE = "@@CREATEROOM/TO_STORE_WEEKLY_TIME_SLOT_CREATE"

export const toStoreWeeklyTimeSlot = (weektimeslot: []) => {
    return {
        type: TO_STORE_WEEKLY_TIME_SLOT_CREATE as typeof TO_STORE_WEEKLY_TIME_SLOT_CREATE,
        weektimeslot
    }
}

type actionCreators = typeof toStoreWeeklyTimeSlot

export type IWeeklyTimeSlotActions = ReturnType<actionCreators> 