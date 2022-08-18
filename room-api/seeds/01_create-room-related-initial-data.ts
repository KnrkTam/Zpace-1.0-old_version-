import * as Knex from "knex";
import { hashPassword } from '../hash';

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("rating_and_comment_on_room").del();
	await knex("rating_and_comment_on_customer").del();
	await knex("message").del();
	await knex("like").del();
	await knex("chat_table").del();
	await knex("booking_time_slot").del();
	await knex("oneoff_open_timeslot").del();
	await knex("customer_booking_time_slot").del();
	await knex("room_facility").del();
	await knex("room_pictures").del();
    await knex("weekly_open_timeslot").del();
    await knex("rooms").del();
    await knex("account").del();

    const password = await hashPassword("123456")
    // Inserts seed entries
	const [account_id1] = 
	await knex("account").insert([
        { username: "Amelia", password: password, profile_picture: "amelia.jpg", email: "amelia@gmail.com", 
        phone_number: 92398317, description: "Hi, i am amelia, Welcome to my place!", is_rooms_owner: true}
    ]).returning("id");
//**************new room****************
    const [rooms_id1] = await knex("rooms").insert([
        {
            hourly_price: 80, space_name: "Nice and comfy meeting room", capacity: 2, room_owner_id: account_id1,
            district: "Tsuen Wan", description: `This room has been designed and thought out so that your events can take place
			in the best conditions. Depending on the type of event, the number of people,
			Our spaces will be able to offer you a turnkey package`,latitude: 22.372508,longitude: 114.1064899,is_active: true, address: "12-20, 388 Castle Peak Rd , Tsuen Wan"
        }
	]).returning("id")

    await knex("room_pictures").insert([
		{picture_filename: "amelia01.jpg", rooms_id: rooms_id1},
		{picture_filename: "amelia02.jpg", rooms_id: rooms_id1},
    ])

    await knex("room_facility").insert([
        {
            wifi: true,
            desk: true,
            socket_plug: true,
            air_condition: true,
            rooms_id: rooms_id1
        }
	])

	await knex("weekly_open_timeslot").insert([
        {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
			friday: false,
			saturday: false,
			sunday: true,
			start_time: "09:00:00",
			end_time: "18:00:00",
			rooms_id: rooms_id1
        }
	])
//**************new room****************
	const [rooms_id2] = await knex("rooms").insert([
        {
            hourly_price: 50, space_name: "Meeting room in my heart", capacity: 2, room_owner_id: account_id1,
            district: "Yau Tsim Mong", description: `With a modern design, our spaces combine design and conviviality, and you will be able to
			give the possibility to adapt all the furniture according to your needs`,latitude: 22.3061513,longitude: 114.1714332,is_active: true, address: "1103, Kowloon Building, No.555 Nathan Rd, Yau Ma Tei"
        }
	]).returning("id")

    await knex("room_pictures").insert([
		{picture_filename: "amelia11.jpg", rooms_id: rooms_id2},
		{picture_filename: "amelia12.jpg", rooms_id: rooms_id2},
		{picture_filename: "amelia13.jpg", rooms_id: rooms_id2},
    ])

    await knex("room_facility").insert([
        {
            wifi: true,
            desk: true,
            socket_plug: true,
            air_condition: true,
            rooms_id: rooms_id2
        }
	])

	await knex("weekly_open_timeslot").insert([
        {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
			friday: true,
			saturday: false,
			sunday: false,
			start_time: "12:00:00",
			end_time: "20:30:00",
			rooms_id: rooms_id2
        }
	])
//***************************************NEW ACCOUNT*******************************************
	const [account_id2] = 
	await knex("account").insert([
        { username: "Charlie", password: password, profile_picture: "charlie.jpg", email: "charlie@gmail.com", 
        phone_number: 91234444, description: "Hi, i am Charlie, Please feel free to contact me!", is_rooms_owner: true}
    ]).returning("id");
//**************new room****************
    const [rooms_id3] = await knex("rooms").insert([
        {
            hourly_price: 100, space_name: "Bright and comfy workshop space", capacity: 10, room_owner_id: account_id2,
            district: "North District", description: `Printing, photocopying, and scanning services are available on demand.`,latitude: 22.3244546,longitude: 114.1688332,is_active: true, address: "SAHARA MALL, KING FAISAL STREET, ADJACENT TO LADIES MARKET, Al Raas"
        }
	]).returning("id")

    await knex("room_pictures").insert([
		{picture_filename: "charlie11.jpg", rooms_id: rooms_id3},
		{picture_filename: "charlie12.jpg", rooms_id: rooms_id3},
		{picture_filename: "charlie13.jpg", rooms_id: rooms_id3},
	])

    await knex("room_facility").insert([
        {
            wifi: true,
            desk: true,
            socket_plug: true,
            air_condition: true,
            rooms_id: rooms_id3
        }
	])	
	
	await knex("weekly_open_timeslot").insert([
        {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
			friday: true,
			saturday: true,
			sunday: true,
			start_time: "15:00:00",
			end_time: "20:30:00",
			rooms_id: rooms_id3
        }
	])

	
//**************new room****************
	const [rooms_id4] = await knex("rooms").insert([
        {
            hourly_price: 120, space_name: "Stylish workshops", capacity: 6, room_owner_id: account_id2,
            district: "North District", description: `The place has a kitchen with oven, microwave, table.`,latitude: 22.319696,longitude: 114.1695298,is_active: true, address: "20/F, Tung Choi St, Mong Kok"
        }
	]).returning("id")

    await knex("room_pictures").insert([
		{picture_filename: "charlie01.jpg", rooms_id: rooms_id4},
		{picture_filename: "charlie02.jpg", rooms_id: rooms_id4},
		{picture_filename: "charlie03.jpg", rooms_id: rooms_id4},
    ])

    await knex("room_facility").insert([
        {
            wifi: true,
            desk: true,
            socket_plug: true,
            air_condition: true,
            rooms_id: rooms_id4,
        }
	])	
	await knex("weekly_open_timeslot").insert([
        {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
			friday: true,
			saturday: true,
			sunday: true,
			start_time: "09:00:00",
			end_time: "21:30:00",
			rooms_id: rooms_id4,
        }
	])

//***************************************NEW ACCOUNT*******************************************
	const [account_id3] = 
	await knex("account").insert([
        { username: "Emily", password: password, profile_picture: "emily.jpg", email: "emily@gmail.com", 
        phone_number: 91234444, description: "Hi, i am Emily!!!", is_rooms_owner: true}
    ]).returning("id");
//**************new room****************
    const [rooms_id5] = await knex("rooms").insert([
        {
            hourly_price: 100, space_name: "Colourful seminar room with breakout rooms", capacity: 12, room_owner_id: account_id3,
            district: "Mong Kok", description: `Hire this charming seminar room for your business event or meeting.`,latitude: 22.3244546,longitude: 114.1688332,is_active: true, address: "SAHARA MALL, KING FAISAL STREET, ADJACENT TO LADIES MARKET, Al Raas"
        }
	]).returning("id")

    await knex("room_pictures").insert([
		{picture_filename: "emily01.jpg", rooms_id: rooms_id5},
		{picture_filename: "emily02.jpg", rooms_id: rooms_id5},
		{picture_filename: "emily03.jpg", rooms_id: rooms_id5},
	])

    await knex("room_facility").insert([
        {
            wifi: true,
            desk: true,
            socket_plug: true,
            air_condition: true,
            rooms_id: rooms_id5
        }
	])	
	
	await knex("weekly_open_timeslot").insert([
        {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
			friday: true,
			saturday: false,
			sunday: false,
			start_time: "01:00:00",
			end_time: "20:30:00",
			rooms_id: rooms_id5
        }
	])

	
//**************new room****************
	const [rooms_id6] = await knex("rooms").insert([
        {
            hourly_price: 120, space_name: "Stylish workshops", capacity: 6, room_owner_id: account_id3,
            district: "Yau Tsim Mong", description: `The place has a kitchen with oven, microwave, table.`,latitude: 22.319696,longitude: 114.1695298,is_active: true, address: "20/F, Tung Choi St, Mong Kok"
        }
	]).returning("id")

    await knex("room_pictures").insert([
		{picture_filename: "emily11.jpg", rooms_id: rooms_id6},
		{picture_filename: "emily12.jpg", rooms_id: rooms_id6},
    ])

    await knex("room_facility").insert([
        {
            wifi: true,
            desk: true,
            socket_plug: true,
            air_condition: true,
            rooms_id: rooms_id6,
        }
	])	
	await knex("weekly_open_timeslot").insert([
        {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
			friday: true,
			saturday: true,
			sunday: true,
			start_time: "15:00:00",
			end_time: "22:30:00",
			rooms_id: rooms_id6,
        }
	])

//**************new room****************
const [rooms_id7] = await knex("rooms").insert([
	{
		hourly_price: 120, space_name: "Coocon space", capacity: 6, room_owner_id: account_id3,
		district: "Central and Western", description: `Fully modulable for meeting and workshop.`,latitude: 22.319696,longitude: 114.1695298,is_active: true, address: "10 Chater Rd, Central"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "emily21.jpg", rooms_id: rooms_id7},
	{picture_filename: "emily22.jpg", rooms_id: rooms_id7},
	{picture_filename: "emily23.jpg", rooms_id: rooms_id7},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id7,
	}
])	
await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: false,
		sunday: true,
		start_time: "12:00:00",
		end_time: "20:30:00",
		rooms_id: rooms_id7,
	}
])

//**************new room****************
const [rooms_id8] = await knex("rooms").insert([
	{
		hourly_price: 120, space_name: "Paris 11", capacity: 6, room_owner_id: account_id3,
		district: "Wan Chai", description: `This bright and spacious conference room is settled on the 11th.`,latitude: 22.319696,longitude: 114.1695298,is_active: true, address: "No. 200 Queen's Rd E, Wan Chai"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "emily41.jpg", rooms_id: rooms_id8},
	{picture_filename: "emily42.jpg", rooms_id: rooms_id8},
	{picture_filename: "emily43.jpg", rooms_id: rooms_id8},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id8,
	}
])	
await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: false,
		sunday: true,
		start_time: "13:00:00",
		end_time: "23:00:00",
		rooms_id: rooms_id8,
	}
])

//***************************************NEW ACCOUNT*******************************************
const [account_id4] = 
await knex("account").insert([
	{ username: "Harry", password: password, profile_picture: "harry.jpg", email: "harry@gmail.com", 
	phone_number: 61345334, description: "Hi, i am Harry!!!", is_rooms_owner: true}
]).returning("id");
//**************new room****************
const [rooms_id9] = await knex("rooms").insert([
	{
		hourly_price: 30, space_name: "Central seminar room", capacity: 4, room_owner_id: account_id4,
		district: "Central and Western", description: ` The brick wall and leather seats give a real character to the room.`,latitude: 22.3244546,longitude: 114.1688332,is_active: true, address: "10 Chater Rd, Central"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "harry01.jpg", rooms_id: rooms_id9},
	{picture_filename: "harry02.jpg", rooms_id: rooms_id9},
	{picture_filename: "harry03.jpg", rooms_id: rooms_id9},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id9
	}
])	

await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: false,
		sunday: false,
		start_time: "01:00:00",
		end_time: "20:30:00",
		rooms_id: rooms_id9
	}
])


//**************new room****************
const [rooms_id10] = await knex("rooms").insert([
	{
		hourly_price: 120, space_name: "Comfortable meeting space with garden view", capacity: 10, room_owner_id: account_id4,
		district: "Central and Western", description: `This comfortable and bright workshop space can accommodate 10/12 person.`,latitude: 22.2873311,longitude: 114.1366281,is_active: true, address: "343 Des Voeux Rd W, Sai Wan"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "harry21.jpg", rooms_id: rooms_id10},
	{picture_filename: "harry22.jpg", rooms_id: rooms_id10},
	{picture_filename: "harry23.jpg", rooms_id: rooms_id10},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id10,
	}
])	
await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: true,
		sunday: true,
		start_time: "15:00:00",
		end_time: "22:30:00",
		rooms_id: rooms_id10,
	}
])

//**************new room****************
const [rooms_id11] = await knex("rooms").insert([
{
	hourly_price: 40, space_name: "Pro space", capacity: 2, room_owner_id: account_id4,
	district: "Central and Western", description: `This Bright and cozy venues organized in three different parts open to each other and here to satisfy 3 key points of a perfect meeting: a relaxation area for breaks, dinning area with delicious catering and a creative, productive space for business and work.`,latitude: 22.319696,longitude: 114.1695298,is_active: true, address: "Shop 1, GF, 263 Queen's Rd W, Sai Ying Pun"
}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "harry31.jpg", rooms_id: rooms_id11},
	{picture_filename: "harry32.jpg", rooms_id: rooms_id11},
	{picture_filename: "harry33.jpg", rooms_id: rooms_id11},
])

await knex("room_facility").insert([
{
	wifi: true,
	desk: true,
	socket_plug: true,
	air_condition: true,
	rooms_id: rooms_id11,
}
])	
await knex("weekly_open_timeslot").insert([
{
	monday: true,
	tuesday: true,
	wednesday: true,
	thursday: true,
	friday: true,
	saturday: false,
	sunday: true,
	start_time: "12:00:00",
	end_time: "20:30:00",
	rooms_id: rooms_id11,
}
])


//***************************************NEW ACCOUNT*******************************************
const [account_id5] = 
await knex("account").insert([
	{ username: "Isla", password: password, profile_picture: "isla.jpg", email: "isla@gmail.com", 
	phone_number: 92340934, description: "Hi, i am Isla!!!", is_rooms_owner: true}
]).returning("id");
//**************new room****************
const [rooms_id12] = await knex("rooms").insert([
	{
		hourly_price: 50, space_name: "XD-workshop", capacity: 4, room_owner_id: account_id5,
		district: "Kwun Tong", description: `Stylish furniture create an exclusive environment which will impress team members or clients.`,latitude: 22.3144696,longitude: 114.2203522,is_active: true, address: "300 Ngau Tau Kok Rd, Kwun Tong"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "isla01.jpg", rooms_id: rooms_id12},
	{picture_filename: "isla02.jpg", rooms_id: rooms_id12},
	{picture_filename: "isla03.jpg", rooms_id: rooms_id12},
	{picture_filename: "isla04.jpg", rooms_id: rooms_id12},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id12
	}
])	

await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: false,
		sunday: false,
		start_time: "01:00:00",
		end_time: "20:30:00",
		rooms_id: rooms_id12
	}
])


//**************new room****************
const [rooms_id13] = await knex("rooms").insert([
	{
		hourly_price: 120, space_name: "Prestigious zpace", capacity: 6, room_owner_id: account_id5,
		district: "Kwun Tong", description: `This unique and unusual place is for rent for all your business events: conferences, meetings, seminars, cocktail parties, receptions and more.`,
		latitude: 22.3107354,longitude: 114.2227668,is_active: true, address: "181 Wai Yip St, Kwun Tong"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "isla21.jpg", rooms_id: rooms_id13},
	{picture_filename: "isla22.jpg", rooms_id: rooms_id13},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id13,
	}
])	
await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: true,
		sunday: true,
		start_time: "15:00:00",
		end_time: "22:30:00",
		rooms_id: rooms_id13,
	}
])

//**************new room****************
const [rooms_id14] = await knex("rooms").insert([
{
	hourly_price: 40, space_name: "Art Design Room", capacity: 2, room_owner_id: account_id5,
	district: "Tsuen Wan", description: `Projector only include an HDMI connection, no VGA. Alternative with VGA connection.`,latitude: 22.3714254,longitude: 114.1128855,is_active: true, address: "No. S70 Hoi Pa St, Tsuen Wan"
}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "isla11.jpg", rooms_id: rooms_id14},
	{picture_filename: "isla12.jpg", rooms_id: rooms_id14},
	{picture_filename: "isla13.jpg", rooms_id: rooms_id14},
])

await knex("room_facility").insert([
{
	wifi: true,
	desk: true,
	socket_plug: true,
	air_condition: true,
	rooms_id: rooms_id14,
}
])	
await knex("weekly_open_timeslot").insert([
{
	monday: true,
	tuesday: true,
	wednesday: true,
	thursday: true,
	friday: true,
	saturday: false,
	sunday: true,
	start_time: "12:00:00",
	end_time: "20:30:00",
	rooms_id: rooms_id14,
}
])

//***************************************NEW ACCOUNT*******************************************
const [account_id6] = 
await knex("account").insert([
	{ username: "Jacob", password: password, profile_picture: "jacob.jpg", email: "jacob@gmail.com", 
	phone_number: 91230983, description: "Hi, i am Jacob!!!", is_rooms_owner: true}
]).returning("id");
//**************new room****************
const [rooms_id15] = await knex("rooms").insert([
	{
		hourly_price: 50, space_name: "Unusual studio loft", capacity: 4, room_owner_id: account_id6,
		district: "Kwun Tong", description: `Creative district will help generate a wealth of ideas - ideal for innovative and new approaches such as design thinking workshops.`,latitude: 22.3120123,longitude: 114.2193389,is_active: true, address: "182 Wai Yip St, Kwun Tong"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "jacob01.jpg", rooms_id: rooms_id15},
	{picture_filename: "jacob02.jpg", rooms_id: rooms_id15},
	{picture_filename: "jacob02.jpg", rooms_id: rooms_id15},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id15
	}
])	

await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: false,
		sunday: false,
		start_time: "13:00:00",
		end_time: "20:30:00",
		rooms_id: rooms_id15
	}
])


//**************new room****************
const [rooms_id16] = await knex("rooms").insert([
	{
		hourly_price: 120, space_name: "Future of Workspace", capacity: 6, room_owner_id: account_id5,
		district: "Kwun Tong", description: `Professional and representative spaces for your meetings, seminars and conferences`,
		latitude: 22.3120123,longitude: 114.2193389,is_active: true, address: "Unit 4, 9/F, Hung Tai Ind Bldg, 37-39 Hung To Rd, Kwun Tong, Kowloon, Hong Kong"
	}
]).returning("id")

await knex("room_pictures").insert([
	{picture_filename: "jacob11.jpg", rooms_id: rooms_id16},
	{picture_filename: "jacob12.jpg", rooms_id: rooms_id16},
])

await knex("room_facility").insert([
	{
		wifi: true,
		desk: true,
		socket_plug: true,
		air_condition: true,
		rooms_id: rooms_id16,
	}
])	
await knex("weekly_open_timeslot").insert([
	{
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: true,
		sunday: true,
		start_time: "00:00:00",
		end_time: "23:30:00",
		rooms_id: rooms_id16,
	}
])

//***************************************NEW ACCOUNT*******************************************
await knex("account").insert([
	{ username: "Jacob", password: password, profile_picture: "james.jpg", email: "james@gmail.com", 
	phone_number: 67230983, description: "Hi, i am James!!!", is_rooms_owner: false}
]).returning("id");
//***************************************NEW ACCOUNT*******************************************
await knex("account").insert([
	{ username: "Jessica", password: password, profile_picture: "jessica.jpg", email: "jessica@gmail.com", 
	phone_number: 69893983, description: "Hi, i am Jessica!!!", is_rooms_owner: false}
]).returning("id");
//***************************************NEW ACCOUNT*******************************************
await knex("account").insert([
	{ username: "Oliver", password: password, profile_picture: "oliver.jpg", email: "oliver@gmail.com", 
	phone_number: 97002134, description: "Hi, i am Oliver!!!", is_rooms_owner: false}
]).returning("id");
//***************************************NEW ACCOUNT*******************************************
await knex("account").insert([
	{ username: "Thomas", password: password, profile_picture: "thomas.jpg", email: "thomas@gmail.com", 
	phone_number: 90235281, description: "Hi, i am Thomas!!!", is_rooms_owner: false}
]).returning("id");
// Time slot 1
	const [booking_id1] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 90,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-01-21", customer_booking_time_slot_id: booking_id1}
	])
	

	const [booking_id2] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 900,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-02-21", customer_booking_time_slot_id: booking_id2}
	])

	const [booking_id3] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 500,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-03-21", customer_booking_time_slot_id: booking_id3}
	])
	

	const [booking_id4] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 1000,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-04-21", customer_booking_time_slot_id: booking_id4}
	])

	const [booking_id5] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 1400,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-05-21", customer_booking_time_slot_id: booking_id5}
	])

	const [booking_id6] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 900,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-06-21", customer_booking_time_slot_id: booking_id6}
	])
	const [booking_id7] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 300,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-06-21", customer_booking_time_slot_id: booking_id7}
	])
	const [booking_id8] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 100,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-07-21", customer_booking_time_slot_id: booking_id8}
	])
	const [booking_id9] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 400,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-06-21", customer_booking_time_slot_id: booking_id9}
	])
	
	const [booking_id10] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 300,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-02-21", customer_booking_time_slot_id: booking_id10}
	])

	const [booking_id11] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 900,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-08-21", customer_booking_time_slot_id: booking_id11}
	])
	const [booking_id12] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 500,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-09-21", customer_booking_time_slot_id: booking_id12}
	])

	const [booking_id14] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 1240,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-10-21", customer_booking_time_slot_id: booking_id14}
	])
	const [booking_id13] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 640,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-09-21", customer_booking_time_slot_id: booking_id13}
	])
	const [booking_id15] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 800,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-10-21", customer_booking_time_slot_id: booking_id15}
	])

	const [booking_id18] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 1200,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-11-21", customer_booking_time_slot_id: booking_id18}
	])

	const [booking_id17] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 1500,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-11-21", customer_booking_time_slot_id: booking_id17}
	])

	const [booking_id19] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 600,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-07-21", customer_booking_time_slot_id: booking_id19}
	])
	const [booking_id20] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 500,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-10-21", customer_booking_time_slot_id: booking_id20}
	])
	const [booking_id21] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 2100,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-11-21", customer_booking_time_slot_id: booking_id21}
	])

	const [booking_id22] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 300,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-04-21", customer_booking_time_slot_id: booking_id22}
	])
	const [booking_id23] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 300,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-05-21", customer_booking_time_slot_id: booking_id23}
	])
	const [booking_id26] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 200,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-10-21", customer_booking_time_slot_id: booking_id26}
	])
	const [booking_id25] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 1200,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-09-21", customer_booking_time_slot_id: booking_id25}
	])
	const [booking_id28] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 700,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-11-21", customer_booking_time_slot_id: booking_id28}
	])
	const [booking_id29] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 300,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-09-21", customer_booking_time_slot_id: booking_id29}
	])
	const [booking_id30] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 450,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id2, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-08-21", customer_booking_time_slot_id: booking_id30}
	])
	const [booking_id31] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 600,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-07-21", customer_booking_time_slot_id: booking_id31}
	])
	const [booking_id32] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 700,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-06-21", customer_booking_time_slot_id: booking_id32}
	])
	const [booking_id233] = await knex("customer_booking_time_slot").insert([
		{status: "completed", price: 800,
		head_count: 4, is_refund: false, request_refund: false, refund_description: "", rooms_id: rooms_id1, customer_id: account_id3, is_rated_from_customer: true, is_rated_from_host:true}
	]).returning("id")

	await knex("booking_time_slot").insert([
		{start_time: "18:00:00" , end_time: "20:00:00", date: "2020-02-21", customer_booking_time_slot_id: booking_id233}
	])
	



};
