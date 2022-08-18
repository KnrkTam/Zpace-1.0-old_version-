import React from "react";
import { useState } from "react";
import PayPalBtn from "../components/PayPalBtn";
import styles from "../css/BookingConfirmation.module.css";
import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ITimeSlotState } from "../redux/bookTimeSlot/states";
import { ISettingState } from "../redux/location/states";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Loading from "../components/Loading";
import MButton from "@material-ui/core/Button";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
			width: "0%"
		},
		narrow_table:{
			width: "100%"
		},

	}),
);

const BookingConfirmation = () => {
	const classes = useStyles();
	const d2 = (x: number) => {
		return x < 10 ? "0" + x : "" + x;
	};
	const time_slotFun = () => {
		const time_slot: any = [];
		for (let i = 0; i < 24; i++) {
			let hour;
			if (i < 10) {
				hour = `0${i}`;
			} else {
				hour = `${i}`;
			}

			for (let k = 0; k < 2; k++) {
				let minute;
				if (k === 0) {
					minute = `00`;
					time_slot.push(`${hour}:${minute}`);
				} else {
					minute = `30`;
					time_slot.push(`${hour}:${minute}`);
				}
			}
		}
		return time_slot;
	};
	let timeSlotArr = time_slotFun();
	const dispatch = useDispatch();
	const timeSlot: any = useSelector<ITimeSlotState>((state: ITimeSlotState) => {
		return state.timeSlot;
	});

	const setting: any = useSelector<ISettingState>((state: ISettingState) => { return state.setting })
	let params = useParams();
	const idMessage = (params as any).id;
	const bearer: string = "Bearer " + localStorage.token;
	const { REACT_APP_API_SERVER } = process.env;
	const matches = useMediaQuery('(min-width:850px)');
	const narrowMatches = useMediaQuery('(min-width:600px)');
	const [payment, setPayment] = useState(false);
	const [resMessage, setResMessage] = useState("")
	const [backendRes, setBackendRes] = useState(false)
	const [roomPicArr, setRoomPicArr] = useState<any>([]);
	const [amount, setAmount] = useState(0)
	const [roomInfo, setRoomInfo] = useState<any>([]);
	const [bookedTimeSlot, setBookedTimeSlot] = useState<any>([]);
	const [bookedSlotNum, setBookedSlotNum] = useState(0);
	const [roomOwnerInfo, setRoomOwnerInfo] = useState<any>([]);

	const fetchRoomData = async () => {
		const res = await fetch(
			`${REACT_APP_API_SERVER}/room-owner/room-detail/${idMessage}`,
			{
				method: "GET",
				headers: {
					Authorization: bearer,
				},
			}
		);
		if (res.status === 200) {
			const roomDateil = await res.json();
			setRoomPicArr(roomDateil.roomData.roomsPicture);
			setRoomInfo(roomDateil.roomData.roomDetail);
			setRoomOwnerInfo(roomDateil.roomData.roomOwnerInfo);
		}
	};

	const groupTimeSlot = () => {
		let sortedArr = timeSlot.timeSlot.map((e: any) => {
			return {
				date: e.date,
				index: timeSlotArr.indexOf(`${d2(e.hour)}:${d2(e.minute)}`),
			};
		});
		setBookedSlotNum(sortedArr.length);
		let group: any = sortedArr.reduce((r: any, a: any) => {
			r[a.date] = [...(r[a.date] || []), a];
			return r;
		}, {});

		let dateFormatArr: any = [];
		let value: any, key;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for ([key, value] of Object.entries(group)) {
			let groupArr: any = [];
			value.sort((a: any, b: any) => {
				return a.index - b.index;
			});
			for (let i = 0; i < value.length; i++) {
				let result = value.findIndex(
					(e: any, i: any, a: any) => i !== 0 && e.index - 1 !== a[i - 1].index
				);
				groupArr.push(value.splice(0, result));
			}
			groupArr = groupArr.concat([value]);
			for (let k = 0; k < groupArr.length; k++) {
				if (groupArr[k].length > 0) {
					dateFormatArr.push({
						date: groupArr[k][0].date,
						from: timeSlotArr[groupArr[k][0].index],
						to: timeSlotArr[groupArr[k][groupArr[k].length - 1].index],
					});
				}
			}
		}
		setBookedTimeSlot(dateFormatArr);
	};
	React.useEffect(() => {
		groupTimeSlot();
		fetchRoomData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	const TimeSlotsRenderDate = ({ info }: any) => {
		return (
			<>
				<div className={styles.layout_of_innerBox}>
					<span>{info.date}</span>
				</div>

			</>
		);
	};

	const TimeSlotsRenderTime = ({ info }: any) => {
		let timeAdjustmentIndx = timeSlotArr.indexOf(info.to);
		let timeAdjustment = timeSlotArr[timeAdjustmentIndx + 1];
		return (
			<>
				<div className={styles.layout_of_innerBox}>
					<span>
						{info.from} - {timeAdjustment}
					</span>
				</div>
			</>
		);
	};

	const onClickPayment = () => {
		setPayment(true);
		setAmount((roomInfo[0].hourly_price * bookedSlotNum) / 2)
	};

	const Payment = () => {
		const paymentHandler = async (details: any, data: any) => {
			setBackendRes(true)
			//  Here you can call your backend API
			// endpoint and update the database
			if (details.status === "COMPLETED") {
				sendSuccessToBackend()
			} 
		}
		return (
			<div>
				{backendRes && <div className={classes.root}><Alert severity="success">{resMessage}</Alert><Loading /></div>}
				{!backendRes && <Alert severity="info">Please don't leave the page until the transaction is completed</Alert>}
				<br></br>
				<PayPalBtn
					amount={amount}
					currency={"HKD"}
					onSuccess={paymentHandler}
				/>
			</div>
		)
	}
	const sendSuccessToBackend = async () => {
		let stringNum = (parseInt(roomInfo[0].hourly_price) * bookedSlotNum) / 2

		const responseJSON = await fetch(`${REACT_APP_API_SERVER}/view-room/to-success`,
			{
				method: "POST",
				headers: {
					Authorization: bearer,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ ppl: setting.setting.ppl, price: stringNum, rooms_id: roomInfo[0].id, room_owner_id: roomInfo[0].room_owner_id, space_name: roomInfo[0].space_name, room_owner_email: roomOwnerInfo[0].email, bookedTimeSlot: bookedTimeSlot })
			})
		if (responseJSON.status === 200) {
			
			let response = await responseJSON.json()
			setResMessage(`${response.message}`,
			)

			setTimeout(() => {
				dispatch(push(`/room-owner/user-booking-history-detail/${response.customerEmail}`))
				setBackendRes(false)
			}, 5000)

		}
	}
	return (
		<div className={styles.body}>
			{!payment && (
				<div >
					<h3 className={styles.booking_confirmation_heading}>Confirm Your Booking</h3>
					<hr />
					<div className={styles.layout_of_box}>
						<div className={styles.box_room}>
							<div className={styles.box_title}>
								{roomPicArr.length > 0 && (
									<img
										className={styles.profile_picture}
										alt="booking-pictures"
										src={
											REACT_APP_API_SERVER +
											"/" +
											roomPicArr[0].picture_filename
										}
									></img>
								)}
							</div>
							<br />
							<div className={styles.booking_info_container}>
								<div className={styles.about_room}>
									{roomInfo.length > 0 && (
										<h5 className={styles.room_name}>{roomInfo[0].space_name}</h5>
									)}
									{roomInfo.length > 0 && (
										<>
											<span className={styles.room_tag}>Address:</span>
											<span className={styles.room_info}> {roomInfo[0].address}</span>
										</>
									)}
									<br />
									{roomOwnerInfo.length > 0 && (
										<>
											<span className={styles.room_tag}>Host:</span>
											<span className={styles.room_info}> {roomOwnerInfo[0].username}</span>
										</>
									)}
									<div>
										<span className={styles.room_tag}>Number of Visitor(s): </span>
										<span className={styles.room_info}>{setting.setting.ppl}</span>
									</div>
								</div>
								<div className={styles.big_table_container}>
									<h3 className={styles.room_name}>Booking Timeslot</h3>
									<div>
									<TableContainer className={styles.table_container} component={Paper}>
										<Table className={`${matches ? classes.table : narrowMatches? classes.mobile_table : classes.narrow_table}`} size="small" aria-label="a dense table">
											<TableHead>
												<TableRow
													>
													<TableCell align="center"><span className={styles.time_table_cells}>Date(s)</span></TableCell>
													<TableCell align="center"><span className={styles.time_table_cells}>Time</span></TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{bookedTimeSlot.length > 0 && bookedTimeSlot.map((e: any, index: number) => (
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
						<h4 className={styles.price_label}>Total Payment: </h4>
						{roomInfo.length > 0 && (
							<h4 className={styles.price_tag}>
								{roomInfo.length > 0 &&
									"$" + (roomInfo[0].hourly_price * bookedSlotNum) / 2}{" "}
							</h4>
						)}
					</div>
					<div className={styles.confirm_payment_button_container}>
						<MButton
							onClick={()=> dispatch(push(`/room-detail/${idMessage}`))}
							className={classes.button}
							variant="contained"
							color="primary">Cancel
						</MButton>
						<MButton
							className={classes.button}
							variant="contained"
							color="secondary" onClick={onClickPayment}>Confirm Payment
						</MButton>
					</div>
				</div>
			)}
			{payment && <div className={styles.payment_Div}><Payment /></div>}
		</div>
	);
};

export default BookingConfirmation;
