import React, { useState, useEffect } from "react";
import DateBookingSection from "../components/DateBookingSection";
import { useParams } from "react-router-dom";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import "../css/RoomDetailPage.css";
import { Button, Chip, TextField } from "@material-ui/core";
import Carousel from "react-bootstrap/Carousel";
import RateReviewIcon from "@material-ui/icons/RateReview";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Container, Row, Col } from "react-bootstrap";
import CommentGrid from "../components/CommentGrid";
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import Alert from "@material-ui/lab/Alert";
import { faLaptopHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import InfoIcon from "@material-ui/icons/Info";
import { ISettingState } from "../redux/location/states";
import { useSelector, useDispatch } from "react-redux";
import { toSet } from "../redux/location/actions";
import styles from "../css/Profile.module.css";
import { push } from "connected-react-router";


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			marginRight: theme.spacing(1),
			marginBottom: theme.spacing(1),
			marginLeft: "5px",
			marginTop: "16px",
			paddingTop: "15px",
			paddingBottom: "15px",
		},
		likeBtnContainer: {
			display: "flex",
			alignItems: "center",
			justifyContent: "flex-end",
		},

		likeBtn: {
			display: "flex",
			alignItems: "center",
			"&:hover": {
				cursor: "pointer",
			},
		},
		pickDateBtn: {
			margin: "3% 1%",
			backgroundColor: "#5455a9",
			color: "white",
			"&:hover": {
				backgroundColor: "#FF385D",
				color: "white",
			},
		},
		sticky: {
			width: "100%",
			height: "fit-content",
			padding: "20px",
			position: "sticky",
			top: "490px",
		},
		root: {
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "space-around",
			overflow: "hidden",
			backgroundColor: theme.palette.background.paper,
		},
		gridList: {
			width: 500,
			height: 450,
		},
		typography: {
			padding: theme.spacing(2),
		},
		button_submit: {
			width: "20%",
			marginTop: "16px",
			height: "55px"
		}
	})
);

function RoomDetailPage(props: React.FC) {
	let userInfo = "notLoggedIn";
	if (localStorage.payload) {
		userInfo = JSON.parse(localStorage.payload);
	}
	const dispatch = useDispatch();
	const setting: any = useSelector<ISettingState>((state: ISettingState) => {
		return state.setting;
	});
	const [initChatInput, setInitChatInput] = useState("");
	const [oneTimeSchedule, setOneTimeSchedule] = useState([]);
	const [weeklyTimeSchedule, setWeeklyTimeSchedule] = useState([]);
	let [roomPicArr, setRoomPicArr] = useState([]);
	let [roomInfo, setRoomInfo] = useState<any>([]);
	const [ratingState, setRatingState] = useState<any>(null);
	let [roomFacility, setRoomFacility] = useState([] as any);
	const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
	const [individualBookingTimeSlot, setIndividualBookingTimeSlot] = useState(
		[]
	);
	const [submitRatingAlert, setSubmitRatingAlert] = useState(false)
	const [ifUserIsHost, seIfUserIsHost] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [messageSent, setMessageSent] = useState(false);
	const [resMessage, setResMessage] = useState(false);
	const bearer: string = "Bearer " + localStorage.token;
	const [pickedDate, setPickedDate] = useState(false);
	const [canRate, setCanRate] = useState(false);
	const [commentState, setCommentState] = useState("");
	const [ratingAvg, setRatingAvg] = useState<any>([]);
	const [ratingAndCommentState, setRatingAndCommentState] = useState([]);
	let [toSubmit, setToSubmit] = useState(false);
	let [hostDetail, setHostDetail] = useState([] as any);
	let [likeCount, setLikeCount] = useState("0");
	let [valueBox, setValueBox] = useState(0);
	let [pickDate, setPickDate] = useState("");

	const starsArr = ["star", "star", "star", "star", "star"];
	let params = useParams();
	const idMessage = (params as any).id;
	const { REACT_APP_API_SERVER } = process.env;

	let [bookingVisitors, setBookingVisitors] = useState("");
	const classes = useStyles();

	useEffect(() => {
		if (localStorage.payload) {
			const fetchLike = async () => {
				let likesJSON = await fetch(
					`${process.env.REACT_APP_API_SERVER}/view-room/one/like/${idMessage}`,
					{
						method: "GET",
						headers: {
							Authorization: "Bearer " + localStorage.token,
						},
					}
				);
				if (likesJSON.status === 200) {
					let { likes } = await likesJSON.json();
					if (likes.length > 0) {
						setIsLiked(true);
					}
				}
			};
			fetchLike();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onClickLike = async () => {
		if (isLiked) {
			let likesJSON = await fetch(
				`${process.env.REACT_APP_API_SERVER}/view-room/unlike/${idMessage}`,
				{
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + localStorage.token,
					},
				}
			);
			if (likesJSON.status === 200) {
				let { likeCount } = await likesJSON.json();
				setIsLiked(false);
				setLikeCount(likeCount[0].count);
			}
		} else {
			let likesJSON = await fetch(
				`${process.env.REACT_APP_API_SERVER}/view-room/like/${idMessage}`,
				{
					method: "GET",
					headers: {
						Authorization: "Bearer " + localStorage.token,
					},
				}
			);
			if (likesJSON.status === 200) {
				let { likeCount } = await likesJSON.json();
				setIsLiked(true);
				setLikeCount(likeCount[0].count);
			}
		}
	};
	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValueBox(newValue);
	};
	const handleOverviewClick = () => {
		setValueBox(0);
	};
	const handleReviewsClick = () => {
		setValueBox(1);
	};
	useEffect(() => {
		const fetchRoomData = async () => {
			const res = await fetch(
				`${REACT_APP_API_SERVER}/booking/room-detail/${idMessage}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userInfo }),
				}
			);
			if (res.status === 200) {
				const roomDetail = await res.json();
				if (localStorage.payload) {
					let userInfo = JSON.parse(localStorage.payload);
					let roomOwnerId =
						roomDetail.roomData.roomDetail[0].room_owner_id;
					if (userInfo.id === roomOwnerId) {
						seIfUserIsHost(true);
					}
				}
				let likeCount = roomDetail.roomData.likeCount[0].count;
				setLikeCount(likeCount);
				let hostDetail = roomDetail.roomData.hostDetail[0];
				setHostDetail(hostDetail);
				setRatingAvg(roomDetail.roomData.ratingAvg);
				setRatingAndCommentState(roomDetail.roomData.rateAndComment);
				setCanRate(roomDetail.canRate);
				setOneTimeSchedule(roomDetail.roomData.oneTimeOffAvailability);
				setWeeklyTimeSchedule(roomDetail.roomData.weeklyAvailability);
				setRoomPicArr(roomDetail.roomData.roomsPicture);
				setRoomInfo(roomDetail.roomData.roomDetail);
				setRoomFacility(roomDetail.roomData.roomFacility);
				setBookedTimeSlots(roomDetail.roomData.bookedTimeSlots);
				setIndividualBookingTimeSlot(
					roomDetail.roomData.individualBookingTimeSlot
				);
			}
		};
		fetchRoomData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmitBookingInfo = async (e: any) => {
		e.preventDefault();
	};

	const onSubmitChat = async (e: any) => {
		e.preventDefault();
		let chatJSON = await fetch(
			`${process.env.REACT_APP_API_SERVER}/chat/chat-room`,
			{
				method: "POST",
				headers: {
					Authorization: bearer,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					initChatInput,
					host_id: roomInfo[0].room_owner_id,
					space_name: roomInfo[0].space_name,
				}),
			}
		);
		let { message, chat_table_id } = await chatJSON.json();
		setInitChatInput("");
		setMessageSent(true);
		setResMessage(message);
		dispatch(push(`/chat-room/${chat_table_id}`))
	};
	const onSubmitRating = async (event: any) => {
		event.preventDefault();
		if (ratingState !== null) {
			let resJSON = await fetch(
				`${process.env.REACT_APP_API_SERVER}/view-room/rating/${idMessage}`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + localStorage.token,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ commentState, ratingState }),
				}
			);
			if (resJSON.status === 200) {
				let {
					userInfo,
					commentState,
					ratingState,
				} = await resJSON.json();
				setCanRate(false);
				setRatingAvg((e: any) => e.concat([{ rating: ratingState }]));
				setRatingAndCommentState((e: any) =>
					e.concat([
						{
							comment: commentState,
							rating: ratingState,
							created_at: `${new Date().getFullYear()}-${
								new Date().getMonth() + 1
								}-${new Date().getDate()}`,
							username: userInfo.username,
							profile_picture: userInfo.profile_picture,
						},
					])
				);
			}
		} else {
			setSubmitRatingAlert(true)
		}
	};
	const starRatingOnClick = (index: number) => {
		setRatingState(index);
	};

	const StarRender = ({ index }: any) => {
		let num = 1;
		if (ratingState === null) {
			num = 1;
		} else if (ratingState >= index) {
			num = 0;
		}
		return (
			<>
				{num === 1 ? (
					<StarBorderRoundedIcon
						style={{ marginRight: "2%", cursor: "pointer", color: "#ff385d" }}
					/>
				) : (
						<StarRoundedIcon
							style={{ marginRight: "2%", cursor: "pointer", color: "#ff385d" }}
						/>
					)}
			</>
		);
	};
	const pickDayFunction = (message: string) => {
		setPickDate(message);
	};
	const RenderAvgRating = ({ index }: any) => {
		let sumRating = 0

		for (let i = 0; i < ratingAvg.length; i++) {
			sumRating = sumRating + ratingAvg[i].rating;
		}
		let avgSum = Math.round(sumRating / ratingAvg.length);

		let num = 1
		if (avgSum >= index) {
			num = 0
		}
		return (
			<>
				{num === 1 ? (
					<StarBorderRoundedIcon style={{ marginRight: "2%", color: "#ff385d" }} />
				) : (
						<StarRoundedIcon style={{ marginRight: "2%", color: "#ff385d" }} />
					)}
			</>
		);
	};
	const onClickSubmit = () => {
		if (bookingVisitors) {
			dispatch(
				toSet(
					parseInt(bookingVisitors),
					setting.setting.priceRg,
					setting.setting.date
				)
			);
			setToSubmit(true);
		}
	};
	useEffect(() => { }, [pickDate]);
	return (
		<>
			{ifUserIsHost && (
				<Alert severity="warning">
					<strong>
						<div className="read-only-warning-span">
							This read-only page is for the space's host to know
							how is the space displayed to visitors.
						</div>
					</strong>
				</Alert>
			)}
			<br></br>
			{roomPicArr.length === 0 && (
				<Container className="room-detail-default-image-con">
					<FontAwesomeIcon
						icon={faLaptopHouse}
						className="default-image"
					/>
				</Container>
			)}
			{roomPicArr.length > 0 && (
				<Container>
					<Carousel
						indicators={false}
						prevIcon={
							<i className="fas direction-icon fa-chevron-circle-left"></i>
						}
						nextIcon={
							<i className="fas direction-icon fa-chevron-circle-right"></i>
						}
					>
						{roomPicArr.map((picture: any, index: number) => {
							return (
								<Carousel.Item className="carousel_img" key={index}>
									<img
										src={
											REACT_APP_API_SERVER +
											"/" +
											picture["picture_filename"]
										}
										alt="First slide pict"
									/>
								</Carousel.Item>
							);
						})}
					</Carousel>
				</Container>
			)}
			<Container>
				<div className="tab-container">
					<Tabs
						value={valueBox}
						onChange={handleChange}
						variant="fullWidth"
						indicatorColor="primary"
						textColor="primary"
						aria-label="icon tabs example"
					>
						<Tab
							icon={<InfoIcon />}
							aria-label="overview"
							label="Overview"
							onClick={handleOverviewClick}
						/>
						<Tab
							icon={<RateReviewIcon />}
							aria-label="review"
							label="Contact Host"
							onClick={handleReviewsClick}
						></Tab>
					</Tabs>
				</div>
			</Container>
			{valueBox === 0 && (
				<Container style={{ marginTop: "1%" }}>
					<Row style={{ margin: "3%" }}>
						<Col lg={7} xs={12} style={{ textAlign: "initial" }}>
							<div
								style={{
									display: "flex",
									justifyContent: "start",
								}}
							>
								{roomInfo.length > 0 && (
									<h2>
										<div style={{ fontWeight: "bolder" }}>{roomInfo[0].space_name}</div>
									</h2>
								)}
							</div>
							{valueBox === 0 && (
								<div>
									{starsArr.length > 0 &&
										starsArr.map((_, index) => {
											return (
												<RenderAvgRating
													index={index}
													key={index}
												/>
											);
										})}
									<div>
										{ratingAvg.length}{" "}
										{ratingAvg.length > 1
											? "visitors rate"
											: "visitor rates"}{" "}
										this space
									</div>
								</div>
							)}
							<hr></hr>
							<div>
								{roomInfo.length > 0 && (
									<h6 style={{ width: "100%" }}>
										{roomInfo[0].district}{" "}
									</h6>
								)}
								{roomInfo.length > 0 && (
									<h6 style={{ width: "100%" }}>
										{roomInfo[0].address}
									</h6>
								)}
							</div>
							<hr className="hr-style" />
							<div className="facility-head-container">
								<h6 style={{ width: "100%" }}>Facilities</h6>
							</div>
							<div className="facility-chips-container">
								{roomFacility.length &&
									roomFacility[0].wifi && (
										<Chip
											icon={
												<i
													className="fas fa-wifi"
													style={{ padding: "5px" }}
												></i>
											}
											className="chips"
											label="Wifi"
											color="primary"
										/>
									)}

								{roomFacility.length &&
									roomFacility[0].socket_plug && (
										<Chip
											icon={
												<i
													className="fas fa-plug"
													style={{ padding: "5px" }}
												></i>
											}
											className="chips"
											label="Socket Plug"
											color="primary"
										/>
									)}

								{roomFacility.length &&
									roomFacility[0].air_condition && (
										<Chip
											icon={
												<i
													className="fas fa-wind"
													style={{ padding: "5px" }}
												></i>
											}
											className="chips"
											label="Air Condition"
											color="primary"
										/>
									)}

								{roomFacility.length &&
									roomFacility[0].desk && (
										<Chip
											icon={
												<i
													className="fas fa-object-group"
													style={{ padding: "5px" }}
												></i>
											}
											className="chips"
											label="Desk"
											color="primary"
										/>
									)}
							</div>
							<hr className="hr-style" />
							<div>
								<h6 style={{ fontWeight: 600 }}>About the Zpace</h6>
								<span>
									{roomInfo.length > 0
										? roomInfo[0].description
										: "No room description is avaliable at the moment"}
								</span>
							</div>

							<hr className="hr-style" />
						</Col>
						<Col lg={5} xs={12}>
							{!ifUserIsHost ? (
								<Paper className={classes.sticky} elevation={3}>
									<form onSubmit={onSubmitBookingInfo}>
										<div>
											<h3>
												<span className={styles.price_number}>
													$
													{roomInfo.length > 0 &&
														roomInfo[0].hourly_price.replace(
															/0+$/,
															""
														)[
														roomInfo[0]?.hourly_price.replace(
															/0+$/,
															""
														).length - 1
														] === "."
														? roomInfo[0]?.hourly_price.replace(
															/.0+$/,
															""
														)
														: roomInfo[0]?.hourly_price.replace(
															/0+$/,
															""
														)}
												</span>
												<span className={styles.price_number_unit}>
													/hr
                                                    </span>

											</h3>
											<div >
												{localStorage.token && (
													<div>
														<Button
															className={
																classes.pickDateBtn
															}
															onClick={() =>
																setPickedDate(
																	false
																)
															}
														>
															Today
														</Button>
														<Button
															className={
																classes.pickDateBtn
															}
															onClick={() =>
																setPickedDate(
																	true
																)
															}
														>
															This Week
														</Button>
													</div>
												)}
											</div>
										</div>
										<TextField
											name="capacity"
											InputProps={{
												inputProps: { min: 0 },
											}}
											id="outlined-number"
											required={true}
											label={"Number of Visitors"}
											type="number"
											margin="normal"
											className="edit-columns"
											value={bookingVisitors}
											onChange={(e: any) => {
												setBookingVisitors(
													e.target.value
												);
											}}
											variant="outlined"
										/>
										<Button
											variant="contained"
											color="primary"
											className={classes.button}
											type="submit"
											value="book"
											onClick={onClickSubmit}
										>
											Book Now
										</Button>
										{pickDate !== "" && (
											<Alert severity="error">
												{pickDate}
											</Alert>
										)}
									</form>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										{!ifUserIsHost && localStorage.token && (
											<div
												className={
													classes.likeBtnContainer
												}
											>
												{isLiked ? (
													<div
														className={
															classes.likeBtn
														}
														onClick={onClickLike}
													>
														<FavoriteIcon
															style={{
																color: "red",
															}}
														/>
														<span>
															liked
														</span>{" "}
													</div>
												) : (
														<div
															className={
																classes.likeBtn
															}
															onClick={onClickLike}
														>
															<FavoriteBorderIcon />
														like
														</div>
													)}
											</div>
										)}
									</div>
									<div className="likecount">
										<span>
											{likeCount} people like this
										</span>
									</div>
								</Paper>
							) : (
									<Paper className={classes.sticky} elevation={3}>
										<form onSubmit={onSubmitBookingInfo}>
											<div>
												<h3>
													<strong>
														$
													{roomInfo.length > 0 &&
															roomInfo[0].hourly_price.replace(
																/0+$/,
																""
															)[
															roomInfo[0]?.hourly_price.replace(
																/0+$/,
																""
															).length - 1
															] === "."
															? roomInfo[0]?.hourly_price.replace(
																/.0+$/,
																""
															)
															: roomInfo[0]?.hourly_price.replace(
																/0+$/,
																""
															)}
													/hr
												</strong>
												</h3>
												<div>
													{localStorage.token && (
														<div>
															<Button
																className={
																	classes.pickDateBtn
																}
																onClick={() =>
																	setPickedDate(
																		false
																	)
																}
															>
																Select Date
														</Button>
															<Button
																className={
																	classes.pickDateBtn
																}
																onClick={() =>
																	setPickedDate(
																		true
																	)
																}
															>
																Select Week
														</Button>
														</div>
													)}
												</div>
											</div>
											<TextField
												name="capacity"
												InputProps={{
													inputProps: { min: 0 },
												}}
												id="outlined-number"
												disabled
												label={"Number of Visitors"}
												type="number"
												margin="normal"
												className="edit-columns"
												value={bookingVisitors}
												onChange={(e: any) => {
													setBookingVisitors(
														e.target.value
													);
												}}
												variant="outlined"
											/>
											<Button
												variant="contained"
												color="primary"
												disabled
												className={classes.button}
												type="submit"
												value="submit"
												onClick={onClickSubmit}
											>
												Book Now
											</Button>
										</form>
										<div>
											{!ifUserIsHost && localStorage.token && (
												<div
													className={
														classes.likeBtnContainer
													}
												>
													{isLiked ? (
														<div
															className={
																classes.likeBtn
															}
															onClick={onClickLike}
														>
															<span>Liked</span>
															<FavoriteIcon
																style={{
																	color: "red",
																}}
															/>{" "}
														</div>
													) : (
															<div
																className={
																	classes.likeBtn
																}
																onClick={onClickLike}
															>
																<span>Like</span>
																<FavoriteBorderIcon />
															</div>
														)}
												</div>
											)}
											<div>
												<span>
													{likeCount} people like this{" "}
												</span>
											</div>
										</div>
									</Paper>
								)}
						</Col>
						<Col xs="12">
							{roomInfo.length > 0 && (
								<DateBookingSection
									pickDayFunction={pickDayFunction}
									pickDate={pickDate}
									setToSubmit={setToSubmit}
									toSubmit={toSubmit}
									pickedDate={pickedDate}
									bookedTimeSlots={bookedTimeSlots}
									oneTimeSchedule={oneTimeSchedule}
									individualBookingTimeSlot={
										individualBookingTimeSlot
									}
									weeklyTimeSchedule={weeklyTimeSchedule}
									roomInfo={roomInfo}
								/>
							)}
						</Col>
					</Row>
				</Container>
			)}
			<Container>
				<Row style={{ margin: "3%" }}>
				</Row>

				<Row style={{ margin: "3%" }}>
					<Col
						lg={12} xs={12}
						style={{
							display: "flex",
							flexDirection: "column",
							textAlign: "initial",
						}}
					>
						{valueBox === 0 && (
							<div className="hostName-zero">
								<div className="hostDetail-big-info-container">
									<div className="hostImg">
										<img
											src={
												hostDetail.profile_picture &&
													hostDetail.profile_picture.slice(
														0,
														5
														// eslint-disable-next-line eqeqeq
													) == "https"
													? hostDetail.profile_picture
													: REACT_APP_API_SERVER +
													"/" +
													hostDetail.profile_picture
											}
											alt="profile-pic"
										/>
									</div>
									<div className="hostDetail-info-box">
										{
											<h2>
												Hosted by {hostDetail.username}
											</h2>
										}
										<span
											style={{
												fontSize: "1rem",
												color: "#9e9e9e",
											}}
										>
											Joined in{" "}
											{hostDetail.created_at?.slice(0, 10)}
										</span>
									</div>
								</div>
								<div className="hostDetail-description-box">
									<h5 style={{ margin: "10px", fontWeight: 600 }}>
										{hostDetail.description}
									</h5>
								</div>
							</div>
						)}
						{valueBox === 1 && (
							<>
								<div>
									{roomInfo.length > 0 && (
										<h2>
											<div style={{ fontWeight: "bolder" }}>{roomInfo[0].space_name}</div>
										</h2>
									)}
									{starsArr.length > 0 &&
										starsArr.map((_, index) => {
											return (
												<RenderAvgRating key={index} index={index} />
											);
										})}
									<div>
										{ratingAvg.length}{" "}
										{ratingAvg.length > 1
											? "visitors rate"
											: "visitor rates"}{" "}
									</div>
								</div>
							</>
						)}
					</Col>
					<Col lg={12} xs={12}>
						<div>
							{valueBox === 1 && (
								<div className="hostName">
									<div className="host-name-container">
										{
											<h3>
												Enquire {hostDetail.username} now!
											</h3>
										}
									</div>
									<div className="host-joined-in">
										<span
											style={{
												fontSize: "1rem",
												color: "#9e9e9e",
											}}
										>
											Joined in{" "}
											{hostDetail.created_at?.slice(
												0,
												10
											)}
										</span>
									</div>
									{messageSent && <div>{resMessage}</div>}
								</div>
							)}
							{valueBox === 1 && localStorage.token && (
								<form onSubmit={onSubmitChat}>
									<TextField
										className="contact-host-textbox-one submit_messages"
										required
										name="chat"
										variant="outlined"
										label="Send Host a Message"
										margin="normal"
										disabled={!ifUserIsHost ? false : true}
										type="textarea"
										value={initChatInput}
										onChange={(e: any) =>
											setInitChatInput(e.target.value)
										}
									/>
									<div className="send-msg-to-host-button">
										<Button
											variant="contained"
											color="primary"
											className={classes.button}
											type="submit"
											disabled={
												!ifUserIsHost ? false : true
											}
											value="send"
										>
											Send
										</Button>
									</div>
								</form>
							)}
						</div>
					</Col>
					<div>
						{submitRatingAlert && roomInfo[0].space_name && <Alert variant="filled" severity="warning">
							Please rate your experience
                            </Alert>}
						{canRate && (
							<Container>
								<Row>
									<div className="container" style={{ textAlign: "initial" }}>
										<h2 className="rating-comment-titlebox">Rate your experience at {roomInfo[0] ? roomInfo[0].space_name : "here"}!</h2>
									</div>
								</Row>
								<>
									<form onSubmit={(e: any) => {
										onSubmitRating(e)
									}}>
										<div style={{ display: "flex" }}>
											{starsArr.map((_, index) => {
												return (
													<div
														key={index}
														onClick={() =>
															starRatingOnClick(index)
														}
													>
														<StarRender
															key={index}
															index={index}
														/>
													</div>
												);
											})}
										</div>
										<div className="submit_div">
											<TextField
												className="contact-host-textbox-one text_field_submit"
												required
												name="chat"
												variant="outlined"
												label="leave a comment"
												margin="normal"
												type="text"
												value={commentState}
												onChange={(e: any) =>
													setCommentState(e.target.value)
												}
											/>
											<Button
												style={{
													fontWeight: 600,
													width: "80px"
												}}
												variant="contained"
												color="secondary"
												className={classes.button_submit}
												type="submit"
												value="send"
												onSubmit={(e) => { e.preventDefault() }}
											>
												Send
										</Button>
										</div>
									</form>
								</>
							</Container>
						)}
					</div>
				</Row>
				<Row>
					<Col xs={12}>
						{valueBox === 0 &&
							ratingAndCommentState.length > 0 &&
							<h3 style={{ fontSize: "2rem", fontWeight: 600 }}>Visitors' Ratings and Reviews</h3>}
						<Row>
							{valueBox === 0 &&
								ratingAndCommentState.length > 0 &&
								ratingAndCommentState.map(
									(e: any, index: number) => {
										return (
											<CommentGrid
												element={e}
												starsArray={starsArr}
												key={index}
											/>
										);
									}
								)}
						</Row>
						<br />
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default RoomDetailPage;
