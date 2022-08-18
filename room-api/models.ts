export interface User{
    id:number
    username:string
    password:string
}

export interface createRoomInfo{
    space_name: string,
    hourly_price: number,
    room_type: string,
    district: string,
    capacity: string,
    description: string|null|undefined,
    wifi: boolean,
    desk: boolean,
    socket_plug: boolean,
    air_condition: boolean,
    room_pictures: string|null
}


declare global{
    namespace Express{
        interface Request{
            user?: User
        }
    }
}