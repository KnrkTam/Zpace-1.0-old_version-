export const TO_STORE_ROOMS = "@@ROOMINFO/TO_STORE_ROOMS"


export const toStoreRoom = (rooms: any) => {
    return {
        type: TO_STORE_ROOMS as typeof TO_STORE_ROOMS,
        rooms: rooms
    }
}


type actionCreators =  typeof toStoreRoom 

export type IRoomActions = ReturnType<actionCreators>