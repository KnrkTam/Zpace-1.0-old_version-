import React, { useState } from "react";
import styles from "../css/BookingAcceptPage.module.css";
import { push } from "connected-react-router";
import { useParams, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MButton from "@material-ui/core/Button";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import moment from 'moment';
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
			width: "750px"
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
const BookingAcceptPage = () => {
	const matches = useMediaQuery('(min-width:850px)');
	const narrowMatches = useMediaQuery('(min-width:600px)');
	const d2 = (x: number) => {
		return x < 10 ? "0" + x : "" + x;
	};



	const dispatch = useDispatch()
	let params = useParams();
	const timeSlot_id = (params as any).id;
	const bearer: string = "Bearer " + localStorage.token;
	const { REACT_APP_API_SERVER } = process.env;
	const classes = useStyles();
	const [durationHour, setDurationHour] = useState<number>(0);
	const [roomPicArr, setRoomPicArr] = useState<any>([]);
	const [roomInfo, setRoomInfo] = useState<any>([]);
	const [bookedTimeSlot, setBookedTimeSlot] = useState<any>({});
	const [eachTimeSlot, setEachTimeSlot] = useState<any>([]);
	const [customerInfo, setCustomerInfo] = useState<any>([])

	const fetchRoomData = async () => {
		const res = await fetch(
			`${REACT_APP_API_SERVER}/booking/room-request/${timeSlot_id}`,
			{
				method: "GET",
				headers: {
					Authorization: bearer,
				},
			}
		);
		if (res.status === 200) {
			let { timeSlotInfo, eachTimeSlot, customerInfo, roomPic, roomInfo } = await res.json();

			if (eachTimeSlot.length > 0) {
				for (let i = 0; i < eachTimeSlot.length; i++) {
					let [hour, minute] = eachTimeSlot[i].end_time.split(':');
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
					eachTimeSlot[i].end_time = end_time_slot
				}
			}
			setRoomPicArr(roomPic)
			setRoomInfo(roomInfo)
			let time = 0;
			for (let i of eachTimeSlot) {
				let duration = diff_minutes(i.start_time, i.end_time)
				time += duration
			}
			setDurationHour(time)
			setBookedTimeSlot(timeSlotInfo)
			setEachTimeSlot(eachTimeSlot)
			setCustomerInfo(customerInfo)
		}
	};


	React.useEffect(() => {
		fetchRoomData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onClickAccept = async () => {
		await fetch(`${REACT_APP_API_SERVER}/booking/request-accept`, {
			method: "POST",
			headers: {
				Authorization: bearer,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ timeSlot_id })
		})
		dispatch(push("/"))

	};
	const onClickReject = async () => {
		await fetch(`${REACT_APP_API_SERVER}/booking/request-reject`, {
			method: "POST",
			headers: {
				Authorization: bearer,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ timeSlot_id })
		})
		dispatch(push("/"))
	};
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
	return (
		<div className={styles.body}>
			<div>
				<div className={styles.request_info}>
					<h3 className={styles.booking_confirmation_heading}>Booking Request <span className={styles.pending}>[PENDING]</span></h3>
					<br />
					<div className={styles.layout_of_box}>
						<div className={styles.box_room}>
							<div className={styles.box_title}>
								{roomPicArr.length > 0 && (
									<img
										className={styles.profile_picture}
										alt="booking-pictures"
										src={roomPicArr[0].picture_filename.slice(0, 5) === "https" ? roomPicArr[0].picture_filename :
											REACT_APP_API_SERVER +
											"/" +
											roomPicArr[0].picture_filename
										}
									></img>
								)}
							</div>
						</div>
						<br />
						<div className={styles.booking_info_container}>
							<div className={styles.about_room}>
								{roomInfo.length > 0 && (
									<h5>Space Name: <span className={styles.data}>{roomInfo[0].space_name}</span></h5>
								)}
								{roomInfo.length > 0 && (
									<h5>District: <span className={styles.data}>{roomInfo[0].district}</span></h5>
								)}
								{roomInfo.length > 0 && (
									<span>Address: <span className={styles.data}>{roomInfo[0].address}</span></span>
								)}
								<div>
									<span>Number of Visitor(s): </span>
									<span className={styles.data}>{bookedTimeSlot.head_count}</span>
								</div>
								<br />
								{customerInfo.length > 0 && <div>
									<div>Customer: <NavLink to={`/profile/${customerInfo[0].id}`} className={styles.profile_div}>
										<span className={styles.user_profile_pic}><img src={customerInfo[0].profile_picture.slice(0, 5) === "https" ? customerInfo[0].profile_picture : REACT_APP_API_SERVER + "/" + customerInfo[0].profile_picture} alt="profile_pic" /></span><span className={styles.data}>{customerInfo[0].username}</span></NavLink></div>
								</div>}
								<div>
									<span>Duration: <span className={styles.data}>{parseTime(durationHour)}</span></span>
								</div>
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
											{eachTimeSlot.length > 0 && eachTimeSlot.map((e: any, index: number) => (
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
					{roomInfo.length > 0 && <h5>${roomInfo[0].hourly_price.replace(/0+$/, '')[roomInfo[0].hourly_price.replace(/0+$/, '').length - 1] === "." ?
						roomInfo[0].hourly_price.replace(/.0+$/, '') : roomInfo[0].hourly_price.replace(/0+$/, '')}</h5>}
				</div>
				<div className={styles.total_payment}>
					<h4>Total Payment:</h4>
					{roomInfo.length > 0 && (
						<h4>
							{roomInfo.length > 0 &&
								"$" + bookedTimeSlot.price}{" "}
						</h4>
					)}
				</div>
				<div className={styles.confirm_payment_button_container}>
					<MButton
						onClick={onClickAccept}
						className={classes.button}
						variant="contained"
						color="primary">Accept
							</MButton>
					<MButton
						className={classes.button}
						variant="contained"
						color="primary" onClick={onClickReject}>Reject
							</MButton>
				</div>
			</div>
		</div>
	)
};

export default BookingAcceptPage;


