import e from "express";
import Knex from "knex";

class EditRoomsService {
    constructor(private knex: Knex) { }

    getOriginalInfoByRoomId = async (room_id: number) => {
        try {
            let room = await this.knex("rooms")
                .select("id", "hourly_price", "capacity", "space_name", "district", "created_at", "description", "address")
                .where("id", room_id)
                .first()

            let room_pictures = await this.knex("room_pictures")
                .select("id", "picture_filename", "rooms_id")
                .where("rooms_id", room_id)

            let weekly_open_timeslot = await this.knex("weekly_open_timeslot")
                .select("id", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "start_time", "end_time", "rooms_id")
                .where("rooms_id", room_id)

            let oneoff_open_timeslot = await this.knex("oneoff_open_timeslot")
                .select("id", "date", "start_time", "end_time", "rooms_id")
                .where("rooms_id", room_id)

            return {
                room,
                room_pictures,
                weekly_open_timeslot,
                oneoff_open_timeslot
            }

        } catch (e) {
            console.log(e)
            return e.toString()
        }
    }

    updateRoomInfo = async (room_id: number, newSpaceName: string, newHourlyPrice: any, newCapacity: string, newDescription: string) => {
        try {
            let originalRoomInfo = await this.knex("rooms")
                .select("hourly_price", "capacity", "space_name", "district", "description")
                .where("id", room_id)

            if (!newSpaceName) {
                newSpaceName = originalRoomInfo["space_name"]
            }
            if (!newHourlyPrice) {
                newHourlyPrice = originalRoomInfo["hourly_price"]
            }
            if (!newCapacity) {
                newCapacity = originalRoomInfo["capacity"]
            }
            if (!newDescription) {
                newDescription = originalRoomInfo["description"]
            }
            let updateRoomInfo = await this.knex("rooms").update({
                space_name: newSpaceName,
                hourly_price: newHourlyPrice,
                capacity: newCapacity,
                description: newDescription
            })
                .where("id", room_id)

            originalRoomInfo[0]["space_name"] = newSpaceName
            originalRoomInfo[0]["hourly_price"] = newHourlyPrice
            originalRoomInfo[0]["capacity"] = newCapacity
            originalRoomInfo[0]["description"] = newDescription
            return { updateRoomInfo }

        } catch (e) {
            console.log(e)
            return e.toString()
        }
    }

    deleteRoomPhotosFromEdit = async (delete_pic_array: any) => {
        try {
            if (Array.isArray(delete_pic_array)) {
                for (let i = 0; i < delete_pic_array.length; i++) {
                    await this.knex("room_pictures")
                        .where("id", delete_pic_array[i])
                        .del()
                }
            } else {
                await this.knex("room_pictures")
                    .where("id", delete_pic_array)
                    .del()
            }

            return;
        } catch (e) {
            console.log(e)
            return e.toString()
        }
    }

    addRoomPhotoFromEdit = async (room_id: number, newPictures: any) => {
        try {
            let originalPictures = await this.knex("room_pictures")
                .select("room_pictures.id", "picture_filename", "rooms_id")
                .innerJoin("rooms", "rooms_id", "rooms.id")
                .where("rooms_id", room_id)

            if (!newPictures) {
                newPictures = originalPictures
            }

            for (let i = 0; i < newPictures.length; i++) {
                await this.knex.insert({
                    picture_filename: newPictures[i].filename,
                    rooms_id: room_id
                }).into("room_pictures")
            }

            return { newPictures }

        } catch (e) {
            console.log(e)
            return e.toString()
        }
    }

    updateWeeklyTimeSlot = async (room_id: number, updateWeeklyTimeSlot: any) => {
        try {
			await this.knex.transaction(async (trx) =>{
				await trx("weekly_open_timeslot").where("rooms_id", room_id).del()
				let parsedWeekly:any = [];
				if(Array.isArray(updateWeeklyTimeSlot)){
				for (let week of updateWeeklyTimeSlot){
					let weeks = JSON.parse(week)
					parsedWeekly.push(weeks)
				}
				}else {
					updateWeeklyTimeSlot = JSON.parse(updateWeeklyTimeSlot)
					parsedWeekly.push(updateWeeklyTimeSlot)
				}
				for (let parseWeek of parsedWeekly) {
					await trx("weekly_open_timeslot").insert([
						{	monday: parseWeek.monday, 
							tuesday: parseWeek.tuesday, 
							wednesday: parseWeek.wednesday, 
							thursday: parseWeek.thursday,
							friday: parseWeek.friday,
							saturday: parseWeek.saturday,
							sunday: parseWeek.sunday,
							start_time: parseWeek.start_time,
							end_time: parseWeek.end_time,
							rooms_id: parseWeek.rooms_id,
						}
					])
				}
			})
            return { updateWeeklyTimeSlot };
        } catch (e) {
            console.log(e)
            return e.toString()
        }
	}
	
	updateOneOffTimeSlot = async(room_id: number, oneOffTimeSlot: any) =>{
		try {
			await this.knex.transaction(async (trx) =>{
				await trx("oneoff_open_timeslot").where("rooms_id", room_id).del()
				let parsedWeekly:any = [];
				if(Array.isArray(oneOffTimeSlot)){
				for (let week of oneOffTimeSlot){
					let weeks = JSON.parse(week)
					parsedWeekly.push(weeks)
				}
				}else {
					oneOffTimeSlot = JSON.parse(oneOffTimeSlot)
					parsedWeekly.push(oneOffTimeSlot)
				}
				for (let parseWeek of parsedWeekly) {
					await trx("oneoff_open_timeslot").insert([
						{	date: parseWeek.date, 
							start_time: parseWeek.start_time, 
							end_time: parseWeek.end_time, 
							rooms_id: parseWeek.rooms_id,
						}
					])
				}
			})
            return { oneOffTimeSlot };
        } catch (e) {
            console.log(e)
            return e.toString()
        }
	}

    deleteWeeklyTimeSlot = async (deleteWeeklyArray: any) => {
        try {
            if (Array.isArray(deleteWeeklyArray)) {
                for (let i = 0; i < deleteWeeklyArray.length; i++) {
                    await this.knex("weekly_open_timeslot")
                        .where("weekly_open_timeslot.id", deleteWeeklyArray[i])
                        .del()
                }
            } else {
                await this.knex("weekly_open_timeslot")
                    .where("weekly_open_timeslot.id", deleteWeeklyArray)
                    .del()
            }
            return;
        } catch {
            console.log(e)
            return e.toString();
        }
    }

    deleteOneOffTimeSlot = async (deleteOneOffArray: any) => {
        try {
            if (Array.isArray(deleteOneOffArray)) {
                for (let i = 0; i < deleteOneOffArray.length; i++) {
                    await this.knex("oneoff_open_timeslot")
                        .where("oneoff_open_timeslot.id", deleteOneOffArray[i])
                        .del()
                }
            } else {
                await this.knex("oneoff_open_timeslot")
                    .where("oneoff_open_timeslot.id", deleteOneOffArray)
                    .del()
            }
            return;
        } catch {
            console.log(e)
            return e.toString();
        }
    }
}

export default EditRoomsService