import Knex from "knex";

class ViewAllRoomsService {
    constructor(private knex: Knex) { }

    getCreateRoomInfo = async (room_owner_id: number) => {
        try {
            let roomInfo = await this.knex("rooms")
                .select("id", "hourly_price", "address","capacity", "space_name", "district", "created_at", "description")
                .where("room_owner_id", room_owner_id)
                .orderBy("created_at", "desc")

            roomInfo.forEach((room) => {
                room.pictures = []
                room.weeklyTimeSlot = []
                room.oneOffTimeSlot = []
                room.facilityItems = []
                room.rating = []
            })

            let roomPictures = await this.knex("room_pictures")
                .select("picture_filename", "rooms.id")
                .innerJoin("rooms", "rooms_id", "rooms.id")
                .where("room_owner_id", room_owner_id)
            
            roomPictures.forEach((picture) => {
                let room = roomInfo.find((room) =>
                    room.id === picture.id
                )
                if (!room) {
                    return
                }
                room.pictures.push(picture.picture_filename)
            })
            
            let weeklyTime = await this.knex("weekly_open_timeslot")
                .select("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "start_time", "end_time", "rooms_id")
                .innerJoin("rooms", "rooms_id", "rooms.id")
                .where("room_owner_id", room_owner_id)

            
            let oneOffTime = await this.knex("oneoff_open_timeslot")
                .select("date", "start_time", "end_time", "rooms_id")
                .innerJoin("rooms", "rooms_id", "rooms.id")
                .where("room_owner_id", room_owner_id)
            

            let roomFacility = await this.knex("room_facility")
                .select("wifi", "desk", "socket_plug", "air_condition", "rooms_id")
                .innerJoin("rooms", "rooms_id", "rooms.id")
                .where("room_owner_id", room_owner_id)

            let roomRating = await this.knex("rating_and_comment_on_room")
                .select("rating", "rooms_id")
                .innerJoin("rooms", "rooms_id", "rooms.id")
                .where("room_owner_id", room_owner_id)

            let weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            let newRoomInfo = [];
            for(let room of roomInfo){
                const weektimeRecord = weeklyTime.filter(d=> d.rooms_id === (room as any).id);
                const oneoffTimeRecord = oneOffTime.filter(i=> i.rooms_id === (room as any).id);
                const ratingRecord = roomRating.filter(r => r.rooms_id === (room as any).id);
                const trueWeekRecord: any = weekdays.map((weekday)=>{
                    return {
                        weekday,
                        timeslots: weektimeRecord
                        .filter((timeslot: any)=> timeslot[weekday])
                        .map((s:any)=>({start: s.start_time, end: s.end_time}))
                    }
                })

                const facilityRecord = roomFacility.find(i=> i.rooms_id === (room as any).id);
                let newRow = {
                    ...room as any,
                    weeklyTimeSlot:[],
                    facilityItems: [],
                    oneOffTimeSlot: [],
                    rating: [...ratingRecord]
                }
                newRow.weeklyTimeSlot.push(trueWeekRecord);
                newRow.facilityItems.push(facilityRecord);
                newRow.oneOffTimeSlot.push(oneoffTimeRecord);
                newRoomInfo.push(newRow);
            }

            return {newRoomInfo}
            
        } catch(e) {
            console.log(e)
            return e.toString();
        }
        
    }

    deleteRoomInfo = async (room_id: number) => {
        try{
            let deletedTimeSlot = await this.knex("weekly_open_timeslot")
            .where("rooms_id", room_id)
            .del()

            let deletedOneTimeSlot = await this.knex("oneoff_open_timeslot")
            .where("rooms_id", room_id)
            .del()

            let deletedRoomFacility = await this.knex("room_facility")
            .where("rooms_id", room_id)
            .del()

            let deletedRoomPictures = await this.knex("room_pictures")
            .where("rooms_id", room_id)
            .del()

            let deletedRoom = await this.knex("rooms")
            .where("id", room_id)
            .del()
        return { deletedTimeSlot, deletedRoomFacility, deletedRoom, deletedRoomPictures, deletedOneTimeSlot }
        } catch(e) {
            console.log(e)
            return e.toString();
        }
    }
    fetchRoomDetail = async (id:number) => {
        let roomDetail = await this.knex.select("*").from("rooms").where("id", id)
        let roomsPicture = await this.knex.select("*").from("room_pictures").where("rooms_id", id)
        let roomOwnerInfo = await this.knex.select("username", "profile_picture", "email", "phone_number").where("id", roomDetail[0].room_owner_id).from("account")
		let roomFacility = await this.knex.select("*").from("room_facility").where("rooms_id", id)
		return {roomDetail,roomsPicture, roomFacility, roomOwnerInfo}
    }
    fetchChartData = async (id:number) => {
        let roomsData:any = []
        let chartData = await this.knex("rooms").select(["id", "space_name"]).where("rooms.room_owner_id", id)
        for(let i = 0 ; i < chartData.length; i++){
            // let roomPicture = await this.knex("room_pictures").select("picture_filename").where("rooms_id", chartData[i].id).first()
            // console.log("roomPicture", roomPicture)
            let roomRequest = await this.knex("customer_booking_time_slot").select(["status", "price", "id"]).where("rooms_id", chartData[i].id)
            let roomLike = await this.knex("like").select(["id"]).where("room_id", chartData[i].id)
            let roomRating = await this.knex("rating_and_comment_on_room").select(["rating"]).where("rooms_id", chartData[i].id)
            for(let k = 0 ; k < roomRequest.length; k++){
                let bookingTimeSlot = await this.knex("booking_time_slot").select("*").where("customer_booking_time_slot_id", roomRequest[k].id)
                roomRequest[k].timeSlot = bookingTimeSlot
            }
            roomsData.push({space_name: chartData[i].space_name, request: roomRequest, like: roomLike, rating: roomRating})
            
        }
        return roomsData
    }
    
}

export default ViewAllRoomsService