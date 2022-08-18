import React from "react";
import { useState } from "react";
import styles from "../css/UserBookingHistoryDetail.module.css";
import { useParams, NavLink } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BookingRoomPreviewGrid from "../components/BookingRoomPreviewGrid";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
interface IBookingInfos {
	id: number | null;
	price: number | null;
	head_count: number | null;
	status: string | null;
	district: string | null;
	username: string | null;
	profile_picture: string | null;
	room_pictures: any;
	space_name: string | null;
	email: string | null;
	hourly_price: number | null;
	phone_number: number | null;
	address: string | null;
	start_time: string | null;
	end_time: string | null;
	date: string | null;
	request_date: string | null;
	times_slots: any;
	user_id?: any
}
const d2 = (x: number) => {
	return x < 10 ? "0" + x : "" + x;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			'& > * + *': {
				marginTop: theme.spacing(2),
			},
		},
		button: {
			margin: theme.spacing(1),
		},
		table: {
			width: "750px",
		},
		mobile_table: {
			width: "600px"
		},
		narrow_table: {
			width: "430px"
		}
	}),
);
function diff_minutes(dt1: string, dt2: string) {
	let date1 = `2020-01-02 ${dt1}`;
	let date2 = `2020-01-02 ${dt2}`;
	let dtF = new Date(date1);
	let dtL = new Date(date2);
	let diff = (dtF.getTime() - dtL.getTime()) / 1000;
	diff = diff / 60 / 60;
	return Math.abs(diff);
}
const TimeSlotsRenderDate = ({ info }: any) => {
	return (
		<>
			<div className={styles.layout_of_innerBox}>
				<span>{moment(info.date).format("dddd, MMMM Do YYYY")}</span>
			</div>
		</>
	);
};
const TimeSlotsRenderTime = ({ info }: any) => {
	return (
		<>
			<div className={styles.layout_of_innerBox}>
				<span>
					{info.start_time.slice(0, 5)} - {info.end_time.slice(0, 5)}
				</span>
			</div>
		</>
	);
};

const parseTime = (num: number) => {
	let str = ''
	if (`${num}`.includes(".") && Math.floor(num) === 0) {
		str = `30 minutes`
	} else if (`${num}`.includes(".")) {
		str = `${Math.floor(num)} ${Math.floor(num) > 1 ? `hours` : `hour`} and 30 minutes`
	} else {
		str = `${num} ${Math.floor(num) > 1 ? `hours` : `hour`}`
	}

	return str
}
const UserBookingHistoryDetail: React.FC = () => {
	const bearer: string = "Bearer " + localStorage.token;
	const { REACT_APP_API_SERVER } = process.env;
	const classes = useStyles();
	const initialBookingInfo = {
		id: null,
		price: null,
		head_count: null,
		status: null,
		username: null,
		district: null,
		profile_picture: null,
		room_pictures: [null],
		space_name: null,
		email: null,
		hourly_price: null,
		phone_number: null,
		address: null,
		start_time: null,
		end_time: null,
		date: null,
		request_date: null,
		times_slots: [],
		user_id: null
	};

	const [durationHour, setDurationHour] = useState<number>(0);
	const [bookingRecord, setBookingRecord] = useState<IBookingInfos>(
		initialBookingInfo
	);
	const { id }: any = useParams();
	const matches = useMediaQuery('(min-width:850px)');
	const narrowMatches = useMediaQuery('(min-width:600px)');
	function fetchBookingData() {
		return new Promise(async function (resolve, reject) {
			const res = await fetch(
				`${REACT_APP_API_SERVER}/booking/user-booking-record-history/${id}`,
				{
					method: "GET",
					headers: {
						Authorization: bearer,
					},
				}
			);

			const { checkBookingRecord } = await res.json();
			let groupedBooking = new Map();
			for (let item of checkBookingRecord) {
				const times_slot = {
					start_time: item.start_time,
					end_time: item.end_time,
					date: item.date,
				};
				if (groupedBooking.has(item.space_name)) {
					groupedBooking
						.get(item.space_name)
						.times_slots.push(times_slot);
				} else {
					const bookingRecord = {
						id: item.id,
						price: item.price,
						head_count: item.head_count,
						status: item.status,
						district: item.district,
						username: item.username,
						user_id: item.user_id,
						profile_picture: item.profile_picture,
						phone_number: item.phone_number,
						email: item.email,
						space_name: item.space_name,
						hourly_price: item.hourly_price,
						address: item.address,
						room_pictures: item.pictures,
						times_slots: [times_slot],
						request_date: item.request_date,
					};
					groupedBooking.set(item.space_name, bookingRecord);
				}
			}
			const BookingResult = Array.from(groupedBooking.values());
			let timeSlotArr = BookingResult[0].times_slots
			for (let timeSlot of timeSlotArr) {
				let [hour, minute] = timeSlot.end_time.split(':');
				if (minute === "30") {
					hour = parseInt(hour) + 1
					hour = d2(hour)
					minute = "00"
				} else {
					// eslint-disable-next-line no-self-assign
					hour = hour
					minute = "30"
				}
				// eslint-disable-next-line no-useless-concat
				let end_time_slot = hour + ":" + minute + ":" + "00"
				timeSlot.end_time = end_time_slot
			}
			BookingResult[0].times_slots = timeSlotArr
			resolve(BookingResult[0]);
		});
	}



	React.useEffect(() => {

		fetchBookingData().then((record: any) => {
			setBookingRecord(record);
			let time = 0;
			for (let i of record.times_slots) {
				let duration = diff_minutes(i.start_time, i.end_time)
				time += duration
			}
			setDurationHour(time)
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className={styles.body}>
				<h3 className={styles.booking_confirmation_heading}>Booking Request <span style={{ color: bookingRecord.status === "completed" || bookingRecord.status === "accepted" ? `#28df99` : bookingRecord.status === "pending" ? "#ffc93c" : "#ec524b" }}>[{bookingRecord.status?.toUpperCase()}]</span></h3>
				<div>
					<div className={styles.box_room}>
						<div>
							{bookingRecord.room_pictures[0] && (
								<BookingRoomPreviewGrid
									element={bookingRecord}
								/>
							)}
						</div>
						<br />
						<div className={styles.booking_info_container}>
							<div className={styles.about_room}>
								{bookingRecord.space_name && (
									<div>Space Name: <span className={styles.data}>{bookingRecord.space_name}</span></div>
								)}
								{bookingRecord.district && (
									<div>District: <span className={styles.data}>{bookingRecord.district}</span></div>
								)}
								{(bookingRecord.status === "completed" || bookingRecord.status === "accepted") && (
									<div>Address: <span className={styles.data}>{bookingRecord.address}</span></div>
								)}
								<div>
									<span>Number of Visitor(s): <span className={styles.data}>{bookingRecord.head_count}</span></span>
								</div>
								<div>
									<span>Duration: <span className={styles.data}>{parseTime(durationHour)}</span></span>
								</div>
								{bookingRecord.user_id && bookingRecord.profile_picture && <div>
									<div>Host: <NavLink to={`/profile/${bookingRecord.user_id}`} className={styles.profile_div}>
										<span className={styles.user_profile_pic}><img src={bookingRecord.profile_picture.slice(0, 5) === "https" ? bookingRecord.profile_picture : REACT_APP_API_SERVER + "/" + bookingRecord.profile_picture} alt="profile_pic" /></span><span className={styles.data}>{bookingRecord.username}</span></NavLink></div>
								</div>}
							</div>
							<div className={styles.big_table_container}>
								<TableContainer className={styles.table_container} component={Paper}>
									<Table className={`${matches ? classes.table : narrowMatches ? classes.mobile_table : classes.narrow_table}`} size="small" aria-label="a dense table">
										<TableHead>
											<TableRow>
												<TableCell align="center"><span className={styles.time_table_cells}>Date(s)</span></TableCell>
												<TableCell align="center"><span className={styles.time_table_cells}>Time</span></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{bookingRecord.times_slots.length > 0 && bookingRecord.times_slots.map((e: any, index: number) => (
												<TableRow key={index}>
													<TableCell component="th" scope="row">
														<div key={index}>
															<TimeSlotsRenderDate info={e} />
														</div>
													</TableCell>
													<TableCell component="th" scope="row">
														<div key={index}>
															<TimeSlotsRenderTime info={e} />
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</div>
					</div>
					<br />
				</div>
				<br />
				<div className={styles.total_payment}>
					<h5 className={styles.hourly_price_span}>Hourly Price: </h5>
					{bookingRecord.hourly_price && <h5>${`${bookingRecord.hourly_price}`.replace(/0+$/, '')[`${bookingRecord.hourly_price}`.replace(/0+$/, '').length - 1] === "." ?
						`${bookingRecord.hourly_price}`.replace(/.0+$/, '') : `${bookingRecord.hourly_price}`.replace(/0+$/, '')}</h5>}
				</div>
				<div className={styles.total_payment}>
					<h4>Total Payment:</h4>
					{bookingRecord.price && (
						<h4>
							{bookingRecord.price &&
								"$" + bookingRecord.price}{" "}
						</h4>
					)}
				</div>
		</div>
	)
};

export default UserBookingHistoryDetail;
