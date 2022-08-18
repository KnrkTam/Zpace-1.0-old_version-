import Knex from 'knex';
import {TimezoneDate} from 'timezone-date.ts'
class loginService {
    constructor(private knex: Knex){}
    getUser = async (id:number)=>{
        let fetchedData = await this.knex.select("*").from("account").where("id", id)
        return fetchedData
    }
    getUserByUsername = async (email:string)=>{
        let fetchedData = await this.knex.select("*").from("account").where("email", email)
        return fetchedData
    }
    toCreateAccount = async (username:string, password:string, profile_picture:string, email:string)=>{
        let is_rooms_owner = false
        let ids = await this.knex.insert({
            username,
            password,
            profile_picture,
            email,
            is_rooms_owner 
        }).into("account")
        .returning(['id', 'created_at', 'is_rooms_owner']);
        return ids
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

    requestCheckIfRated = async (id:any)=>{
        let roomRatingArr:any = []
        let customerRatingArr:any = []
        const timeSlotCheck = await this.knex
            .select("rooms_id")
            .from("customer_booking_time_slot")
            .where("customer_id", id)
            .andWhere("status", "completed")
            .andWhere("is_rated_from_customer", false);
        const bookedTimeSlotCheckHostSide = await this.knex(
            "customer_booking_time_slot"
        )
            .select("customer_booking_time_slot.customer_id")
            .innerJoin("rooms", "rooms_id", "rooms.id")
            .where("room_owner_id", id)
            .andWhere("status", "completed")
            .andWhere("is_rated_from_host", false);
        for(let i = 0 ; i < timeSlotCheck.length; i++){
           let {space_name} = await this.knex("rooms").select("space_name").where("id", timeSlotCheck[i].rooms_id).first()
           roomRatingArr = roomRatingArr.concat([{id: timeSlotCheck[i].rooms_id,space_name }])
        }
        for(let k = 0 ; k < bookedTimeSlotCheckHostSide.length; k++){
            let {username} =  await this.knex("account").select("username").where("id", bookedTimeSlotCheckHostSide[k].customer_id).first()
            customerRatingArr = customerRatingArr.concat([{id: bookedTimeSlotCheckHostSide[k].customer_id,username}])
        }
        return {roomRatingArr, customerRatingArr}
    }
}


export default loginService