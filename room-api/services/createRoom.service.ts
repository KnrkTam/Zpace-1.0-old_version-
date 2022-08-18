import Knex from "knex";

class CreateRoomService {
    constructor(private knex: Knex){}
    
    // remember to adjust according to frontend logic
    postCreateRoomInfo = async(address: string,weekly_time_slot:any,oneoff_time_slot:any, longitude:any, latitude:any, createRoomInfo: {space_name: string|number, hourly_price: string|number, district: string, capacity: string|number,
    description: string|null|undefined, wifi:boolean|string|null, desk: boolean|string|null, socket_plug: boolean|string|null, air_condition: boolean|string|null, 
    rooms_pictures: any}, account_id:number, files: any)=>{
        let [rooms_id] = await this.knex.insert({
            address,
            latitude,
            longitude,
            room_owner_id: account_id,
            space_name: createRoomInfo.space_name,
            hourly_price: Number(createRoomInfo.hourly_price),
            district: createRoomInfo.district,
            capacity: createRoomInfo.capacity,
            description: createRoomInfo.description,
            is_active: true,
        }).into("rooms")
        .returning("id")
        
        for(let k = 0; k < weekly_time_slot.length; k++){
            let startTime, endTime
            if(weekly_time_slot[k].weekHalfday1 === "A.M." && weekly_time_slot[k].weekStarthr === '12'){
                    startTime =  '00'
                    
            }else if(weekly_time_slot[k].weekHalfday1 === "A.M."){
                startTime =  weekly_time_slot[k].weekStarthr
            } else {
                let convertedTime = Number(weekly_time_slot[k].weekStarthr) + 12
                startTime = convertedTime.toString()
            }

            if(weekly_time_slot[k].weekHalfday2 === "A.M." && weekly_time_slot[k].weekEndhr === '12'){
                endTime =  '00'
                
            }else if(weekly_time_slot[k].weekHalfday2 === "A.M."){
                endTime =  weekly_time_slot[k].weekEndhr
            } else {
                let convertedTime = Number(weekly_time_slot[k].weekEndhr) + 12
                endTime = convertedTime.toString()
            }
            startTime = startTime + ":" + weekly_time_slot[k].weekStartmin
            endTime = endTime + ":" + weekly_time_slot[k].weekEndmin


            await this.knex.insert({
                monday: weekly_time_slot[k].monday,
                tuesday: weekly_time_slot[k].tuesday,
                wednesday: weekly_time_slot[k].wednesday,
                thursday: weekly_time_slot[k].thursday,
                friday: weekly_time_slot[k].friday,
                saturday: weekly_time_slot[k].saturday,
                sunday: weekly_time_slot[k].sunday,
                start_time: startTime,
                end_time: endTime,
                rooms_id: rooms_id
            }).into("weekly_open_timeslot")
        }
        

        for(let j = 0; j < oneoff_time_slot.length; j++){
            let startTime, endTime
            if(oneoff_time_slot[j].halfOneDay1 === "A.M." && oneoff_time_slot[j].oneOffStarthr === '12'){
                    startTime =  '00'
                    
            }else if(oneoff_time_slot[j].halfOneDay1 === "A.M."){
                startTime =  oneoff_time_slot[j].oneOffStarthr
            } else {
            let convertedTime = Number(oneoff_time_slot[j].oneOffStarthr) + 12
            startTime = convertedTime.toString()
            }

            if(oneoff_time_slot[j].halfOneDay2 === "A.M." && oneoff_time_slot[j].oneOffEndhr === '12'){
                endTime =  '00'
                
            }else if(oneoff_time_slot[j].halfOneDay2 === "A.M."){
                endTime =  oneoff_time_slot[j].oneOffEndhr
            } else {
                let convertedTime = Number(oneoff_time_slot[j].oneOffEndhr) + 12
                endTime = convertedTime.toString()
            }
            startTime = startTime + ":" + oneoff_time_slot[j].oneOffendmin
            endTime = endTime + ":" + oneoff_time_slot[j].oneOffendmin

            await this.knex.insert({
                date: oneoff_time_slot[j].oneoffdate,
                start_time: startTime,
                end_time: endTime,
                rooms_id: rooms_id,
            }).into("oneoff_open_timeslot")
        }
        

        for(let i = 0; i < files.length; i++){
            await this.knex.insert({
                picture_filename: files[i].filename,
                rooms_id: rooms_id
            }).into("room_pictures")
        }
        
        await this.knex.insert({
            wifi: createRoomInfo.wifi,
            desk: createRoomInfo.desk,
            socket_plug: createRoomInfo.socket_plug,
            air_condition: createRoomInfo.air_condition,
            rooms_id: rooms_id,
        }).into("room_facility")

        return;
    }
}

export default CreateRoomService;