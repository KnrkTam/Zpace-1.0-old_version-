import Knex from "knex";

class CustomerViewRoomsService {
    constructor(private knex: Knex) {}
    toGiveRate = async (room_id:any,customer_id:any,commentState:any, ratingState:any)=>{
       await this.knex.insert({comment: commentState || "", rating: ratingState, account_id: customer_id, rooms_id: room_id}).into("rating_and_comment_on_room")
       await this.knex("customer_booking_time_slot").update({is_rated_from_customer: true}).where("customer_id", customer_id).andWhere("rooms_id", room_id)
        let userInfo = await this.knex("account").select(["username", "profile_picture", "id"]).where("id", customer_id).first()
        return {userInfo}
    }
    toFetchOneLike = async (userId:any, room_id:any) =>{
        let result = await this.knex.select("*").from("like").where("account_id", userId).andWhere("room_id", room_id)
        return result
    }
    toLike = async (room_id:any,customer_id:any) =>{
        try{
           await this.knex.insert({room_id, account_id: customer_id}).into("like").returning("id")
           let likeCount = await this.knex("like").count("id").where("room_id", room_id);
           return likeCount
        }catch(e){
            return e
        }
    }

    toUnLike = async (room_id:any,customer_id:any) =>{
        try{
            await this.knex('like').where('room_id',room_id).andWhere("account_id", customer_id).del();
            let likeCount = await this.knex("like").count("id").where("room_id", room_id);
            return likeCount
        }catch(e){
            return e
        }
    }
    toFetchRating = async (room_id:any) =>{
        try{
            let rating = await this.knex("rating_and_comment_on_room").select("rating").where("rooms_id", room_id);
            return rating
        }catch(e){
            return e
        }
    }
    toBookingSuccess = async (user_id:any, bookedTimeSlot:any, ppl:any, price:any, room_owner_id:any, rooms_id:any) => {   
		const customerEmail = await this.knex.select(["email", "username"]).from("account").where("id", user_id)
		const booking:any = await this.knex.insert({ status: "pending" ,rooms_id: rooms_id, is_refund: false, request_refund: false, refund_description: '', head_count: ppl, customer_id: user_id, price, is_rated_from_customer: false, is_rated_from_host: false}).into("customer_booking_time_slot").returning("id")
		let checkIfChatExist = await this.knex.select("*").from("chat_table").where("host_id", room_owner_id).andWhere("customer_id", user_id)
        if(checkIfChatExist.length === 0){
            let id:any = await this.knex.insert({customer_id: user_id, host_id: room_owner_id}).into("chat_table").returning("id")
			await this.knex.insert({sender_id: user_id, content: `${booking[0]}`, is_read: true,chat_table_id: id[0] , is_request: true }).into("message")
        }else{
			await this.knex.insert({sender_id: user_id, content: `${booking[0]}`, is_read: true,chat_table_id: checkIfChatExist[0].id, is_request: true  }).into("message")
        }
		for(let i = 0 ; i < bookedTimeSlot.length; i++){
			await this.knex.insert({customer_booking_time_slot_id: booking[0], date: bookedTimeSlot[i].date, start_time: bookedTimeSlot[i].from, end_time: bookedTimeSlot[i].to }).into("booking_time_slot")
		}
		return customerEmail[0], booking[0]
	}
    getCreateRoomInfo = async (room_owner_id: number) => {
        try {
            let roomInfo = await this.knex("rooms")
                .select("id", "hourly_price", "address","capacity", "space_name", "district", "created_at", "description")
                .where("room_owner_id", room_owner_id)
                .orderBy("created_at", "desc")


            roomInfo.forEach((room) => {
                room.pictures = []
                room.weeklyTimeSlot = []
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
            

            let newRoomInfo = [];
            for(let room of roomInfo){
                const record = weeklyTime.find(d=> d.rooms_id === (room as any).id);
                let newRow = {
                    ...room as any,
                    weeklyTimeSlot:[]
                }
                newRow.weeklyTimeSlot.push(record);
                // if(record){
                //     (room as any).weeklyTimeSlot.push(record);
                // }
                newRoomInfo.push(newRow);
            }
            
            return {newRoomInfo}
            
        } catch(e) {
            console.log(e)
            return e.toString();
        }
        
    }


  
}

export default CustomerViewRoomsService;

