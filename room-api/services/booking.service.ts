import Knex from "knex";
import { mg } from "../controller/customerViewRoom.controller";

export default class BookingService {
	constructor(private knex: Knex) { }
	checkCanRateRoom = async (room_id:any, userInfo:any)=>{
		if(userInfo !== "notLoggedIn"){
			const bookedTimeSlotCheckCustomerSide = await this.knex(
				"customer_booking_time_slot"
			)
				.select("*")
				.where("customer_id", userInfo.id)
				.andWhere("rooms_id", room_id)
				.andWhere("status", "completed")
				.andWhere("is_rated_from_customer", false);
			return bookedTimeSlotCheckCustomerSide.length > 0

		}
		return false
	}
	getBookingByID = async (id: number) => {
		const booking = await this.knex
			.select([
				"customer_booking_time_slot.id",
				"customer_booking_time_slot.price",
				"customer_booking_time_slot.head_count",
				"customer_booking_time_slot.status",
				"customer_booking_time_slot.rooms_id",
				"booking_time_slot.start_time",
				"booking_time_slot.end_time",
				"booking_time_slot.date",
				"customer_booking_time_slot.request_date",
				"account.username",
				"account.id AS user_id",
				"account.profile_picture",
				"account.phone_number",
				"account.email",
				"rooms.address",
				"rooms.district",
				"rooms.space_name",
				"rooms.hourly_price",
				// "room_pictures.picture_filename",
			])
			.from("customer_booking_time_slot")
			.innerJoin(
				"account",
				"account.id",
				"customer_booking_time_slot.customer_id"
			)
			.innerJoin("rooms", "rooms.id", "customer_booking_time_slot.rooms_id")
			// .innerJoin("room_pictures", "room_pictures.rooms_id", "customer_booking_time_slot.rooms_id")
			.innerJoin(
				"booking_time_slot",
				"booking_time_slot.customer_booking_time_slot_id",
				"customer_booking_time_slot.id"
			)
			.where("customer_booking_time_slot.id", id);
		booking.forEach((room) => {
			room.pictures = [];
		});
		const picture = await this.knex("room_pictures").where(
			"rooms_id",
			booking[0].rooms_id
		);
		picture.forEach((picture) => {
			let room = booking.find((book) => book.rooms_id === picture.rooms_id);
			if (!room) {
				return;
			}
			room.pictures.push(picture.picture_filename);
		});
		return booking;
	};

	getUserBookingByID = async (id: number) => {
		const booking = await this.knex
			.select([
				"customer_booking_time_slot.id",
				"customer_booking_time_slot.price",
				"customer_booking_time_slot.head_count",
				"customer_booking_time_slot.status",
				"customer_booking_time_slot.rooms_id",
				"booking_time_slot.start_time",
				"booking_time_slot.end_time",
				"booking_time_slot.date",
				"customer_booking_time_slot.request_date",
				"account.username",
				"account.id AS user_id",
				"account.profile_picture",
				"account.phone_number",
				"account.email",
				"rooms.address",
				"rooms.district",
				"rooms.space_name",
				"rooms.hourly_price",
			])
			.from("customer_booking_time_slot")
			.innerJoin("rooms", "rooms.id", "customer_booking_time_slot.rooms_id")
			.innerJoin("account","account.id","rooms.room_owner_id")
			.innerJoin(
				"booking_time_slot",
				"booking_time_slot.customer_booking_time_slot_id",
				"customer_booking_time_slot.id"
			)
			.where("customer_booking_time_slot.id", id);
		booking.forEach((room) => {
			room.pictures = [];
		});
		const picture = await this.knex("room_pictures").where(
			"rooms_id",
			booking[0].rooms_id
		);
		picture.forEach((picture) => {
			let room = booking.find((book) => book.rooms_id === picture.rooms_id);
			if (!room) {
				return;
			}
			room.pictures.push(picture.picture_filename);
		});
		return booking;
	};

	getRoomPreview = async (weekDay: any, date: any) => {
		let availableRooms = await this.knex
			.select(["*"])
			.from("weekly_open_timeslot")
			.innerJoin("rooms", "rooms.id", "weekly_open_timeslot.rooms_id")
			.innerJoin(
				"room_pictures",
				"room_pictures.rooms_id",
				"weekly_open_timeslot.rooms_id"
			)
			.where(weekDay, true)
			.andWhere("rooms.is_active", true);
		let availableRoomsOneTime = await this.knex
			.select(["*"])
			.from("oneoff_open_timeslot")
			.innerJoin("rooms", "rooms.id", "oneoff_open_timeslot.rooms_id")
			.innerJoin(
				"room_pictures",
				"room_pictures.rooms_id",
				"oneoff_open_timeslot.rooms_id"
			)
			.where("oneoff_open_timeslot.date", date)
			.andWhere("rooms.is_active", true);
		return {
			roomInfos: availableRooms,
			roomInfosOneOff: availableRoomsOneTime,
		};
	};

	fetchRoomDetail = async (id: number) => {
		let roomDetail = await this.knex.select("*").from("rooms").where("id", id);
		let roomsPicture = await this.knex
			.select("*")
			.from("room_pictures")
			.where("rooms_id", id);
		let weeklyAvailability = await this.knex
			.select("*")
			.from("weekly_open_timeslot")
			.where("rooms_id", id);
		let bookedTimeSlots = await this.knex
			.select("*")
			.from("customer_booking_time_slot")
			.where("rooms_id", id)
			.andWhere("status", "accepted");
		let hostDetail = await this.knex
			.select("*")
			.from("account")
			.where("id", roomDetail[0].room_owner_id);
		let likeCount = await this.knex("like").count("id").where("room_id", id);
		let ratingAvg = await this.knex("rating_and_comment_on_room").select("rating", "id").where("rooms_id", id)
		let rateAndComment = await this.knex("rating_and_comment_on_room")
                .select("rating_and_comment_on_room.comment", "rating_and_comment_on_room.rating", "rating_and_comment_on_room.created_at", "account.username", "account.profile_picture")
                .innerJoin("account", "account_id", "account.id")
				.where("rating_and_comment_on_room.rooms_id", id)
		let individualBookingTimeSlot: any = [];
		for (let i = 0; i < bookedTimeSlots.length; i++) {
			let individualBookingTimeSlotData = await this.knex
				.select("*")
				.from("booking_time_slot")
				.where("customer_booking_time_slot_id", bookedTimeSlots[i].id);
			individualBookingTimeSlot = individualBookingTimeSlot.concat(
				individualBookingTimeSlotData
			);
		}

		let oneTimeOffAvailability = await this.knex
			.select("*")
			.from("oneoff_open_timeslot")
			.where("rooms_id", id);
		let roomFacility = await this.knex
			.select("*")
			.from("room_facility")
			.where("rooms_id", id);
		return {
			roomDetail,
			roomsPicture,
			weeklyAvailability,
			oneTimeOffAvailability,
			roomFacility,
			bookedTimeSlots,
			individualBookingTimeSlot,
			hostDetail,
			likeCount,
			rateAndComment,
			ratingAvg
		};
	};

	getBookingHistoryList = async (id: number) => {
		const histList = await this.knex("customer_booking_time_slot")
			.select([
				"customer_booking_time_slot.id",
				"customer_booking_time_slot.price",
				"customer_booking_time_slot.head_count",
				"customer_booking_time_slot.status",
				"customer_booking_time_slot.created_at",
				"account.username",
				"account.profile_picture",
				"account.phone_number",
				"account.email",
				"rooms.address",
				"rooms.space_name",
				"rooms.hourly_price",
			])
			.innerJoin(
				"account",
				"account.id",
				"customer_booking_time_slot.customer_id"
			)
			.innerJoin("rooms", "rooms.id", "customer_booking_time_slot.rooms_id")
			.where("rooms.room_owner_id", id)
			.orderBy("customer_booking_time_slot.status", "pending");
		histList.forEach((hist) => {
				hist.time_slots = [];
			});
		let time_slotArr:any = []; 
		for (let hist of histList){
			let time_slot = await this.knex("booking_time_slot").where("customer_booking_time_slot_id", hist.id)
			time_slotArr = time_slotArr.concat(time_slot)
		}
		time_slotArr.forEach((time_slot: any) => {
			let hist = histList.find((histListed) => histListed.id === time_slot.customer_booking_time_slot_id);
			if (!hist) {
				return;
			}
			hist.time_slots.push({start_time: time_slot.start_time,end_time: time_slot.end_time});

		})
		return histList;
	};
	getUserBookingHistoryList = async (id: number) => {
		let histList = await this.knex("customer_booking_time_slot")
			.select([
				"customer_booking_time_slot.id",
				"customer_booking_time_slot.price",
				"customer_booking_time_slot.head_count",
				"customer_booking_time_slot.status",
				"customer_booking_time_slot.created_at",
				"rooms.district",
				"rooms.space_name",
				"rooms.hourly_price",
				"room_pictures.picture_filename"
			])
			.innerJoin("rooms", "rooms.id", "customer_booking_time_slot.rooms_id")
			.innerJoin("room_pictures","room_pictures.rooms_id","customer_booking_time_slot.rooms_id")
			.where("customer_booking_time_slot.customer_id", id)
			.orderBy("customer_booking_time_slot.status", "pending");

		let obj = {};

		for ( let i=0, len=histList.length; i < len; i++ )
			obj[histList[i]['id']] = histList[i];
		
			histList = new Array();
		for ( let key in obj )
		histList.push(obj[key]);

		histList.map((hist) => {
				hist.time_slots = [];
			});
		let time_slotArr:any = []; 
		for (let hist of histList){
			let time_slot = await this.knex("booking_time_slot").select("*").where("customer_booking_time_slot_id", hist.id)
			time_slotArr = time_slotArr.concat(time_slot)
		}
		time_slotArr.map((time_slot: any) => {
			let hist = histList.find((histListed) => histListed.id === time_slot.customer_booking_time_slot_id);
			if (!hist) {
				return;
			}
			hist.time_slots.push({start_time: time_slot.start_time,end_time: time_slot.end_time, date: time_slot.date});
		})
		return histList;
	};

	getRoomRequestInfo = async (timeSlot_id: any) => {
		let timeSlotInfo = await this.knex
			.select("*")
			.from("customer_booking_time_slot")
			.where("id", timeSlot_id)
			.first();
		let eachTimeSlot = await this.knex
			.select("*")
			.from("booking_time_slot")
			.where("customer_booking_time_slot_id", timeSlot_id);
		let customerInfo = await this.knex
			.select(["id","username", "profile_picture"])
			.from("account")
			.where("id", timeSlotInfo.customer_id);
		let roomPic = await this.knex
			.select("picture_filename")
			.from("room_pictures")
			.where("rooms_id", timeSlotInfo.rooms_id);
		let roomInfo = await this.knex
			.select([
				"space_name",
				"hourly_price",
				"address",
				"room_owner_id",
				"capacity",
				"description",
				"district",
			])
			.from("rooms")
			.where("id", timeSlotInfo.rooms_id);
		return { timeSlotInfo, eachTimeSlot, customerInfo, roomPic, roomInfo };
	};
	timeSlotReject = async (timeSlot_id: any) => {
		const customerID = await this.knex("customer_booking_time_slot")
			.update({
				status: "rejected",
			})
			.where("id", timeSlot_id)
			.returning(["customer_id", "rooms_id"]);
		const customerInfo = await this.knex
			.select(["email", "username"])
			.where("id", customerID[0].customer_id)
			.from("account")
			.first();
		const roomInfo = await this.knex
			.select(["space_name"])
			.where("id", customerID[0].rooms_id)
			.from("rooms")
			.first();
		return { customerInfo, roomInfo };
	};

	timeSlotAccept = async (timeSlot_id: any, timeSlotArr: any) => {
		const customerIDAndRoomId = await this.knex("customer_booking_time_slot")
			.update({
				status: "accepted",
			})
			.where("id", timeSlot_id)
			.returning(["customer_id", "rooms_id"]);
		const roomInfo = await this.knex
			.select(["space_name", "room_owner_id"])
			.where("id", customerIDAndRoomId[0].rooms_id)
			.from("rooms")
			.first();
		const customerInfo = await this.knex
			.select(["email", "username"])
			.where("id", customerIDAndRoomId[0].customer_id)
			.from("account")
			.first();
		const getAllSameRoomPendingRequestTimeSlot = await this.knex
			.select("id")
			.from("customer_booking_time_slot")
			.where("rooms_id", customerIDAndRoomId[0].rooms_id)
			.andWhere("status", "pending");
		const acceptedTimeSlot = await this.knex
			.select("*")
			.from("booking_time_slot")
			.where("customer_booking_time_slot_id", timeSlot_id);
		const chatRoomId = await this.knex.select("id").from("chat_table").where("customer_id", customerIDAndRoomId[0].customer_id).andWhere("host_id", roomInfo.room_owner_id).first()
		await this.knex.insert({sender_id: roomInfo.room_owner_id, content: `Request on ${roomInfo.space_name} is accepted`, is_read: false, chat_table_id: chatRoomId.id, is_request: false  }).into("message")
		let combinedTimeSlotArr: any[] = [];
		for (let i = 0; i < getAllSameRoomPendingRequestTimeSlot.length; i++) {
			let bookingTimeSlotArr = await this.knex
				.select("*")
				.from("booking_time_slot")
				.where(
					"customer_booking_time_slot_id",
					getAllSameRoomPendingRequestTimeSlot[i].id
				);
			combinedTimeSlotArr = combinedTimeSlotArr.concat(bookingTimeSlotArr);
		}
		let filterArr:any =[]
for (let k = 0; k < acceptedTimeSlot.length; k++) {
    let acceptedStartTimeIndex = timeSlotArr.indexOf(acceptedTimeSlot[k].start_time.slice(0, 5))
    let acceptedEndTimeIndex = timeSlotArr.indexOf(acceptedTimeSlot[k].end_time.slice(0, 5))
    for (let j = acceptedStartTimeIndex; j <= acceptedEndTimeIndex; j++) {
        let filtered = combinedTimeSlotArr.filter((requestTimeSlot) => {
            let startTimeIndex = timeSlotArr.indexOf(requestTimeSlot.start_time.slice(0, 5))
            let endTimeIndex = timeSlotArr.indexOf(requestTimeSlot.end_time.slice(0, 5))
            if (`${new Date(acceptedTimeSlot[k].date).getFullYear()}-${new Date(acceptedTimeSlot[k].date).getMonth() + 1}-${new Date(acceptedTimeSlot[k].date).getDate()}` === `${new Date(requestTimeSlot.date).getFullYear()}-${new Date(requestTimeSlot.date).getMonth() + 1}-${new Date(requestTimeSlot.date).getDate()}`) {
                return startTimeIndex === j || endTimeIndex === j
            }
            return false
        })
        filterArr = filterArr.concat(filtered)
    }
}
		let obj = {};
		for (let i = 0, len = filterArr.length; i < len; i++) {
			obj[filterArr[i]["customer_booking_time_slot_id"]] =
			filterArr[i];
		}
		filterArr = new Array();

		for (let key in obj) {
			filterArr.push(obj[key]);
		}
		for (let b = 0; b < filterArr.length; b++) {
			let customerID: any = await this.knex("customer_booking_time_slot")
				.update({ status: "rejected" })
				.where("id", filterArr[b].customer_booking_time_slot_id)
				.returning("customer_id")
			let rejectedCustomerInfo = await this.knex("account")
				.select(["email", "username"])
				.where("id", customerID[0])
			const toCustoemr = {
				from: "Zpace <zpaceroomrenting@gmail.com>",
				to: `${rejectedCustomerInfo[0].email}`,
				subject: `Time-Slots request on ${roomInfo.space_name} is rejected`,
				text: "You may choose another time-slots.",
			};
			mg.messages().send(toCustoemr, function (error: any, body: any) { });
		}
		return { customerInfo, roomInfo };
	};
}
