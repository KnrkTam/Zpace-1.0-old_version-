import Knex from "knex";
import {TimezoneDate} from 'timezone-date.ts'
export default class ProfileService {
    constructor(private knex: Knex) { }

    getProfileByID = async (id: number) => {
        const user = await this.knex
            .select([
                "id",
                "email",
                "description",
                "created_at",
                "phone_number",
                "profile_picture",
                "updated_at",
                "username",
                "is_rooms_owner",
            ])
            .from("account")
            .where("id", id);
        return user;
    };
    fetchRateAndComment = async (id:any)=>{
		let userRateAndComment = await this.knex("rating_and_comment_on_customer")
                .select("rating_and_comment_on_customer.comment", "rating_and_comment_on_customer.rating", "rating_and_comment_on_customer.created_at", "account.username", "account.profile_picture")
                .innerJoin("account", "room_owner_id", "account.id")
                .where("rating_and_comment_on_customer.customer_id", id)
                
        let userRatingAvg = await this.knex("rating_and_comment_on_customer").select("rating").where("customer_id", id)
        return {userRateAndComment, userRatingAvg}
    }
    requestCheck = async (id: any) => {
        const timeSlotCheck = await this.knex
            .select("id")
            .from("customer_booking_time_slot")
            .where("customer_id", id)
            .andWhere("status", "accepted");

        const hostBookedTimeSlotCheck = await this.knex(
            "customer_booking_time_slot"
        )
            .select("customer_booking_time_slot.id")
            .innerJoin("rooms", "rooms_id", "rooms.id")
            .where("room_owner_id", id)
            .andWhere("status", "accepted");
        let d = TimezoneDate.fromDate(new Date())
        d.timezone = +8
        let timeReachedArr: any = [];
        let timeReachedArrHostSide: any = [];
        let currentYear = `${d.getFullYear()}`;
        let currentMonth = `${d.getMonth() + 1}`;
        let currentDate = `${d.getDate()}`;
        let currentHour = `${d.getHours()}`;
        let currentMinute = `${d.getMinutes()}`;
            

        // check the customer side, where time slots passed the current time
        for (let i = 0; i < timeSlotCheck.length; i++) {
            const acceptedTimeSlot = await this.knex
                .select(["start_time", "end_time", "date"])
                .from("booking_time_slot")
                .where("customer_booking_time_slot_id", timeSlotCheck[i].id)
                .orderBy("date", "DESC")
                .orderBy("end_time", "DESC")
                .first();
            let date = `${new Date(acceptedTimeSlot.date).getFullYear()}-${
                new Date(acceptedTimeSlot.date).getMonth() + 1
                }-${new Date(acceptedTimeSlot.date).getDate()}`;
            let splitedDate = date.split("-");
            let endTime = acceptedTimeSlot.end_time.slice(0, 5);
            let splitedTime = endTime.split(":");
            let bookedHour = splitedTime[0];
            let bookedMinute = splitedTime[1];
            let bookedYear = splitedDate[0];
            let bookedMonth = splitedDate[1];
            let bookedDate = splitedDate[2];
            if (parseInt(currentYear) > parseInt(bookedYear)) {
                timeReachedArr = timeReachedArr.concat([timeSlotCheck[i].id]);
            } else if (
                parseInt(currentYear) === parseInt(bookedYear) &&
                parseInt(currentMonth) > parseInt(bookedMonth)
            ) {
                timeReachedArr = timeReachedArr.concat([timeSlotCheck[i].id]);
            } else if (
                parseInt(currentYear) === parseInt(bookedYear) &&
                parseInt(currentMonth) === parseInt(bookedMonth) &&
                parseInt(currentDate) > parseInt(bookedDate)
            ) {
                timeReachedArr = timeReachedArr.concat([timeSlotCheck[i].id]);
            } else if (
                date === `${currentYear}-${currentMonth}-${currentDate}` &&
                parseInt(currentHour) > parseInt(bookedHour)
            ) {
                timeReachedArr = timeReachedArr.concat([timeSlotCheck[i].id]);
            } else if (
                date === `${currentYear}-${currentMonth}-${currentDate}` &&
                parseInt(currentHour) === parseInt(bookedHour) &&
                parseInt(currentMinute) > parseInt(bookedMinute)
            ) {
                timeReachedArr = timeReachedArr.concat([timeSlotCheck[i].id]);
            } else if (
                date === `${currentYear}-${currentMonth}-${currentDate}` &&
                parseInt(currentHour) === parseInt(bookedHour) &&
                parseInt(currentMinute) === parseInt(bookedMinute)
            ) {
                timeReachedArr = timeReachedArr.concat([timeSlotCheck[i].id]);
            }
        }
        // check the host side, where time slots passed the current time
        for (let j = 0; j < hostBookedTimeSlotCheck.length; j++) {
            const acceptedTimeSlotHostSide = await this.knex
                .select(["start_time", "end_time", "date", "id"])
                .from("booking_time_slot")
                .where("customer_booking_time_slot_id", hostBookedTimeSlotCheck[j].id)
                .orderBy("date", "DESC")
                .orderBy("end_time", "DESC")
                .first();
            let HostSideDate = `${new Date(
                acceptedTimeSlotHostSide.date
            ).getFullYear()}-${
                new Date(acceptedTimeSlotHostSide.date).getMonth() + 1
                }-${new Date(acceptedTimeSlotHostSide.date).getDate()}`;
            let splitedDateHostSide = HostSideDate.split("-");
            let endTimeHostSide = acceptedTimeSlotHostSide.end_time.slice(0, 5);
            let splitedTimeHostSide = endTimeHostSide.split(":");
            let bookedHourHostSide = splitedTimeHostSide[0];
            let bookedMinuteHostSide = splitedTimeHostSide[1];
            let bookedYearHostSide = splitedDateHostSide[0];
            let bookedMonthHostSide = splitedDateHostSide[1];
            let bookedDateHostSide = splitedDateHostSide[2];
            if (parseInt(currentYear) > parseInt(bookedYearHostSide)) {
                timeReachedArrHostSide = timeReachedArrHostSide.concat([
                    hostBookedTimeSlotCheck[j].id,
                ]);
            } else if (
                parseInt(currentYear) === parseInt(bookedYearHostSide) &&
                parseInt(currentMonth) > parseInt(bookedMonthHostSide)
            ) {
                timeReachedArrHostSide = timeReachedArrHostSide.concat([
                    hostBookedTimeSlotCheck[j].id,
                ]);
            } else if (
                parseInt(currentYear) === parseInt(bookedYearHostSide) &&
                parseInt(currentMonth) === parseInt(bookedMonthHostSide) &&
                parseInt(currentDate) > parseInt(bookedDateHostSide)
            ) {
                timeReachedArrHostSide = timeReachedArrHostSide.concat([
                    hostBookedTimeSlotCheck[j].id,
                ]);
            } else if (
                HostSideDate === `${currentYear}-${currentMonth}-${currentDate}` &&
                parseInt(currentHour) > parseInt(bookedHourHostSide)
            ) {
                timeReachedArrHostSide = timeReachedArrHostSide.concat([
                    hostBookedTimeSlotCheck[j].id,
                ]);
            } else if (
                HostSideDate === `${currentYear}-${currentMonth}-${currentDate}` &&
                parseInt(currentHour) === parseInt(bookedHourHostSide) &&
                parseInt(currentMinute) > parseInt(bookedMinuteHostSide)
            ) {
                timeReachedArrHostSide = timeReachedArrHostSide.concat([
                    hostBookedTimeSlotCheck[j].id,
                ]);
            } else if (
                HostSideDate === `${currentYear}-${currentMonth}-${currentDate}` &&
                parseInt(currentHour) === parseInt(bookedHourHostSide) &&
                parseInt(currentMinute) === parseInt(bookedMinuteHostSide)
            ) {
                timeReachedArrHostSide = timeReachedArrHostSide.concat([
                    hostBookedTimeSlotCheck[j].id,
                ]);
            }
        }
        
        for (let k = 0; k < timeReachedArr.length; k++) {
          await this.knex
                .update({ status: "completed" })
                .from("customer_booking_time_slot")
                .where("id", timeReachedArr[k])
                .returning("*")
        }
        
        for (let b = 0; b < timeReachedArrHostSide.length; b++) {
               await this.knex(
                "customer_booking_time_slot")
                .update({ status: "completed" })
                .where("id", timeReachedArrHostSide[b])
                .returning("*")
                
        }
    };
    checkCanRateUser = async (user_id:any, host_id:any) => {
        const bookedTimeSlotCheckHostSide = await this.knex(
            "customer_booking_time_slot"
        )
            .select("rooms.id")
            .innerJoin("rooms", "rooms_id", "rooms.id")
            .where("customer_booking_time_slot.customer_id", user_id)
            .andWhere("rooms.room_owner_id", host_id)
            .andWhere("customer_booking_time_slot.status", "completed")
            .andWhere("customer_booking_time_slot.is_rated_from_host", false);
        return bookedTimeSlotCheckHostSide
    }

    requestCheckIfRated = async (id:any)=>{
        let roomRatingArr:any = []
        let customerRatingArr:any = []
        const timeSlotCheck = await this.knex
            .select(["rooms_id", "customer_booking_time_slot.id"])
            .from("customer_booking_time_slot")
            .where("customer_id", id)
            .andWhere("status", "completed")
            .andWhere("is_rated_from_customer", false);
        const bookedTimeSlotCheckHostSide = await this.knex(
            "customer_booking_time_slot"
        )
            .select(["customer_booking_time_slot.customer_id", "customer_booking_time_slot.id"])
            .innerJoin("rooms", "rooms_id", "rooms.id")
            .where("room_owner_id", id)
            .andWhere("status", "completed")
            .andWhere("is_rated_from_host", false);
        for(let i = 0 ; i < timeSlotCheck.length; i++){
            let {space_name} = await this.knex("rooms").select("space_name").where("id", timeSlotCheck[i].rooms_id).first()
            roomRatingArr = roomRatingArr.concat([{id: timeSlotCheck[i].rooms_id, space_name, timeSlotID: timeSlotCheck[i].id }])
        }
        for(let k = 0 ; k < bookedTimeSlotCheckHostSide.length; k++){
            let {username} =  await this.knex("account").select("username").where("id", bookedTimeSlotCheckHostSide[k].customer_id).first()
            customerRatingArr = customerRatingArr.concat([{id: bookedTimeSlotCheckHostSide[k].customer_id,username, timeSlot: bookedTimeSlotCheckHostSide[k].id }])
        }
        return {roomRatingArr, customerRatingArr}
    }
    editDescription = async (body: any, id: number) => {
        if (!body.username) {
            delete body.username;
        }
        const des = await this.knex.update(body).into("account").where("id", id);
        return des;
    };
    postProfilePicture = async (body: any, id: number) => {
        const picture = await this.knex
            .update(body)
            .into("account")
            .where("id", id);
        return picture;
    };
    toGiveRate = async (host_id:any,customer_id:any,commentState:any, ratingState:any, room_id:any)=>{
        await this.knex.insert({comment: commentState || "", rating: ratingState, customer_id: customer_id, room_owner_id: host_id}).into(" rating_and_comment_on_customer")
        await this.knex("customer_booking_time_slot").update({is_rated_from_host: true}).where("customer_id", customer_id).andWhere("rooms_id", room_id)
        let userInfo = await this.knex("account").select(["username", "profile_picture"]).where("id", host_id).first()
        return {userInfo}
    }

    // get back what the user has liked
    getLikeContent = async (account_id: number) => {
			let getLikeResults = await this.knex
			.from("like")
            .select("*")
			.innerJoin("rooms", "room_id", "rooms.id")
			.innerJoin("account","account.id","rooms.room_owner_id")
			.where("account_id", account_id)
			getLikeResults.forEach((results) => {
				results.pictures = [];
			});
			let getLikePictureArr:any = []
			for (let getLikeResult of getLikeResults) {
				let getLikePicture = await this.knex.from("room_pictures").where("rooms_id", getLikeResult.room_id)
				getLikePictureArr = getLikePictureArr.concat(getLikePicture)
			}
			getLikePictureArr.forEach((getLikePicture: any)=> {
				let like = getLikeResults.find((liked) => liked.room_id === getLikePicture.rooms_id);
				if (!like) {
					return;
				}
				like.pictures.push(getLikePicture.picture_filename)
			});
			return getLikeResults
			// let getLikePicture = await this.knex.from("room_picture").
            // return getLikeResult
	}
    skipRateOnRoom = async (id:any) => {
        await this.knex("customer_booking_time_slot").update({is_rated_from_customer: true}).where("id", id)
    }
    skipRateOnCustimer = async (id:any) =>{
        await this.knex("customer_booking_time_slot").update({is_rated_from_host: true}).where("id", id)
    }
}
