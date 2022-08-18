import React, { useState, useEffect } from "react";
import MapComponent from "../components/Map";
import "../css/SearchResultPage.css";
import { useSelector, useDispatch } from "react-redux";
import { ISettingState, IToPlaceState } from "../redux/location/states";
import {
	makeStyles,
	createStyles,
	Button,
	Theme,
	Typography,
	Slider,
	TextField,
} from "@material-ui/core";
import { toStoreRoom } from "../redux/roomInfo/actions";
import { IRoomState } from "../redux/roomInfo/states";
import RoomPreviewGrid from "../components/RoomPreviewGrid";
import { InView } from "react-intersection-observer";
import Loading from "../components/Loading";
import {
	toStoreMarkerIP,
	toStoreRoomInfo,
	toSet,
} from "../redux/location/actions";
import { Modal } from "react-bootstrap";

const drawerWidth = 430;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		setting: {
			width: 322,
			marginLeft: "auto",
			marginRight: "auto",
			marginTop: "13px",
		},
		menuButton: {},
		hide: {
			display: "none",
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
		},
		drawerPaper: {
			width: drawerWidth,
		},
		drawerHeader: {
			display: "flex",
			alignItems: "center",
			padding: theme.spacing(0, 1),
			// necessary for content to be below app bar
			...theme.mixins.toolbar,
			justifyContent: "flex-end",
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(1),
			transition: theme.transitions.create("margin", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			marginLeft: -drawerWidth,
		},
		contentShift: {
			transition: theme.transitions.create("margin", {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: 20,
		},
	})
);
const valuetext = (value: number) => {
	return `$${value}`;
};
const d2 = (x: number) => {
	return x < 10 ? "0" + x : "" + x;
};
const SearchResultPage = () => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const [isLoading, setIsLoading] = useState(false);
	const room: any = useSelector<IRoomState>(
		(state: IRoomState) => state.room
	);
	const place: any = useSelector<IToPlaceState>(
		(state: IToPlaceState) => state.place
	);
	const [markerState, setMarkerState] = useState([]);
	const setting: any = useSelector<ISettingState>((state: ISettingState) => {
		return state.setting;
	});
	const [showCalendor, setShowCalendor] = useState(false);
	const [loadPage, setLoadPage] = useState(3);
	const [inView, setInView] = React.useState(false);
	const starsArr = ["star", "star", "star", "star", "star"];
	const onClickNow = () => {
		setShowCalendor(false);
		dispatch(
			toSet(
				setting.setting.ppl,
				setting.setting.priceRg,
				`${new Date().getFullYear()}-${
					new Date().getMonth() + 1
				}-${new Date().getDate()}`
			)
		);
	};
	const handleChange = (event: any, newValue: any) => {
		dispatch(toSet(setting.setting.ppl, newValue, setting.setting.date));
	};
	const onChangeText = (e: any) => {
		dispatch(
			toSet(e.target.value, setting.setting.priceRg, setting.setting.date)
		);
	};
	const onClickSearch = (e: any) => {
		e.preventDefault();
		const ob = {
			setting: {
				ppl: setting.setting.ppl,
				priceRg: setting.setting.priceRg,
				date: setting.setting.date,
			},
		};
		const fetchRoomDataThunk = async (setting: any) => {
			let roomDataJSON = await fetch(
				`${process.env.REACT_APP_API_SERVER}/booking/fetch-room`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(setting),
				}
			);
			let roomData = await roomDataJSON.json();
			let roomInfos = new Map();
			for (let items of roomData.roomsInfoMap.roomInfos) {
				const room_picture = {
					picture_filename: items.picture_filename,
				};
				if (roomInfos.has(items.rooms_id)) {
					roomInfos
						.get(items.rooms_id)
						.room_pictures.push(room_picture);
				} else {
					const bookingRecord = {
						rooms_id: items.rooms_id,
						start_time: items.start_time,
						end_time: items.end_time,
						space_name: items.space_name,
						room_owner_id: items.room_owner_id,
						hourly_price: items.hourly_price,
						capacity: items.capacity,
						longitude: items.longitude,
						latitude: items.latitude,
						district: items.district,
						room_pictures: [room_picture],
					};
					roomInfos.set(items.rooms_id, bookingRecord);
				}
			}
			let roomInfosOneOff = new Map();
			for (let item of roomData.roomsInfoMap.roomInfosOneOff) {
				const room_picture = {
					picture_filename: item.picture_filename,
				};
				if (roomInfosOneOff.has(item.rooms_id)) {
					roomInfosOneOff
						.get(item.rooms_id)
						.room_pictures.push(room_picture);
				} else {
					const bookingRecord = {
						rooms_id: item.rooms_id,
						start_time: item.start_time,
						end_time: item.end_time,
						longitude: item.longitude,
						latitude: item.latitude,
						room_owner_id: item.room_owner_id,
						space_name: item.space_name,
						hourly_price: item.hourly_price,
						capacity: item.capacity,
						district: item.district,
						room_pictures: [room_picture],
					};
					roomInfosOneOff.set(item.rooms_id, bookingRecord);
				}
			}

			let combinedRoomsOb = {
				...strMapToObj(roomInfos),
				...strMapToObj(roomInfosOneOff),
			};
			let combinedRoomsArr = Object.values(combinedRoomsOb);
			let startPriceRg = parseInt(setting.setting.priceRg[0]);
			let endPriceRg = parseInt(setting.setting.priceRg[1]);
			let capacity = setting.setting.ppl;
			combinedRoomsArr = combinedRoomsArr.filter((e: any) => {
				return checkPriceRg(e, startPriceRg, endPriceRg) === true;
			});
			combinedRoomsArr = sortByAttribute(combinedRoomsArr, "district");
			let chosenDistrict;
			if (place.place.length > 1) {
				chosenDistrict = combinedRoomsArr.filter((e: any) => {
					let ifMatch = false;
					for (let i = 0; i < place.place.length; i++) {
						let splitedAddress = place.place[
							i
						].formatted_address.split(",");
						for (let k = 0; k < splitedAddress.length; k++) {
							if (splitedAddress[k].includes(e.district)) {
								ifMatch = true;
								break;
							}
						}
						if (ifMatch === true) {
							break;
						}
					}
					return ifMatch;
				});
				let theRestDistrict = combinedRoomsArr.filter((e: any) => {
					let ifMatch = true;
					for (let i = 0; i < place.place.length; i++) {
						let splitedAddress = place.place[
							i
						].formatted_address.split(",");
						for (let k = 0; k < splitedAddress.length; k++) {
							if (splitedAddress[k].includes(e.district)) {
								ifMatch = false;
								break;
							}
						}
						if (ifMatch === false) {
							break;
						}
					}
					return ifMatch;
				});
				chosenDistrict.sort((a: any, b: any) => {
					return a.capacity - b.capacity;
				});
				theRestDistrict.sort((a: any, b: any) => {
					return a.capacity - b.capacity;
				});
				let findIndex = chosenDistrict.findIndex((e: any) => {
					return e.capacity === capacity;
				});
				let firstPart = chosenDistrict.splice(0, findIndex);
				chosenDistrict = chosenDistrict.concat(firstPart);

				let findIndexTheRestPart = theRestDistrict.findIndex(
					(e: any) => {
						return e.capacity === capacity;
					}
				);
				let firstPartTheRestPart = theRestDistrict.splice(
					0,
					findIndexTheRestPart
				);
				theRestDistrict = theRestDistrict.concat(firstPartTheRestPart);
				chosenDistrict = chosenDistrict.concat(theRestDistrict);
			} else {
				let district = place.place[0];
				chosenDistrict = combinedRoomsArr.filter((e: any) => {
					return district === e.district;
				});
				let theRestDistrict = combinedRoomsArr.filter((e: any) => {
					return district !== e.district;
				});
				chosenDistrict.sort((a: any, b: any) => {
					return a.capacity - b.capacity;
				});
				theRestDistrict.sort((a: any, b: any) => {
					return a.capacity - b.capacity;
				});
				let findIndex = chosenDistrict.findIndex((e: any) => {
					return e.capacity === capacity;
				});
				let firstPart = chosenDistrict.splice(0, findIndex);
				chosenDistrict = chosenDistrict.concat(firstPart);

				let findIndexTheRestPart = theRestDistrict.findIndex(
					(e: any) => {
						return e.capacity === capacity;
					}
				);
				let firstPartTheRestPart = theRestDistrict.splice(
					0,
					findIndexTheRestPart
				);
				theRestDistrict = theRestDistrict.concat(firstPartTheRestPart);
				chosenDistrict = chosenDistrict.concat(theRestDistrict);
			}
			dispatch(toStoreRoom(chosenDistrict));
		};

		function strMapToObj(strMap: any) {
			let obj = Object.create(null);
			for (let [k, v] of strMap) {
				obj[k] = v;
			}
			return obj;
		}
		const checkPriceRg = (ob: any, startPriceRg: any, endPriceRg: any) => {
			return (
				startPriceRg <= parseInt(ob.hourly_price) &&
				parseInt(ob.hourly_price) <= endPriceRg
			);
		};
		function sortByAttribute(array: any, ...attrs: any) {
			// generate an array of predicate-objects contains
			// property getter, and descending indicator
			let predicates = attrs.map((pred: any) => {
				let descending = pred.charAt(0) === "-" ? -1 : 1;
				pred = pred.replace(/^-/, "");
				return {
					getter: (o: any) => o[pred],
					descend: descending,
				};
			});
			// schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
			return array
				.map((item: any) => {
					return {
						src: item,
						compareValues: predicates.map((predicate: any) =>
							predicate.getter(item)
						),
					};
				})
				.sort((o1: any, o2: any) => {
					let i = -1,
						result = 0;
					while (++i < predicates.length) {
						if (o1.compareValues[i] < o2.compareValues[i])
							result = -1;
						if (o1.compareValues[i] > o2.compareValues[i])
							result = 1;
						if ((result *= predicates[i].descend)) break;
					}
					return result;
				})
				.map((item: any) => item.src);
		}
		fetchRoomDataThunk(ob);
		handleClose()
	};
	useEffect(() => {
		setMarkerState((e: any) => room);
	}, [room]);

	useEffect(() => {
		if (inView && loadPage <= markerState.length) {
			setIsLoading(true);
			setTimeout(() => {
				setLoadPage((e) => e + 3);
				setIsLoading(false);
			}, 600);
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inView]);
	const showChosenGrid = (element: any) => {
		dispatch(toStoreRoomInfo({ room: element } as any));
		dispatch(toStoreMarkerIP(element.latitude, element.longitude));
	};


	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	return (
		<div className="search-page">
			<div className="left-container">
			<div className="filter">
				<div className="search-buttons-group-container">
					<Button
						className="groupBtn search-buttons-group"
						onClick={() => onClickNow()}
					>
						TODAY
					</Button>
					<Button
						className="groupBtn search-buttons-group"
						onClick={() => setShowCalendor(!showCalendor)}
					>
						SELECT DATE
					</Button>
					{showCalendor && (
						<>
							<br />
							<input
								type="date"
								min={`${new Date().getFullYear()}-${d2(
									new Date().getMonth() + 1
								)}-${d2(new Date().getDate())}`}
								onChange={(e) => {
									dispatch(
										toSet(
											setting.setting.ppl,
											setting.setting.priceRg,
											e.target.value
										)
									);
								}}
							/>
						</>
					)}
				</div>
				<Typography
					id="range-slider"
					gutterBottom
					className="price-tag"
				>
					{`$${setting.setting.priceRg[0]} HKD to $${setting.setting.priceRg[1]} HKD`}{" "}
					/ hour
				</Typography>

				<div className="search-result-slider-container">
					<Slider
						min={10}
						max={2000}
						value={setting.setting.priceRg}
						step={20}
						onChange={handleChange}
						valueLabelDisplay="auto"
						aria-labelledby="range-slider"
						getAriaValueText={valuetext}
						className="search-result-slider"
					/>
				</div>

				<form className={classes.setting} noValidate autoComplete="off">
					<TextField
						InputProps={{ inputProps: { min: 0 } }}
						type="number"
						id="filled-basic"
						className="text-field"
						label="Number of people"
						variant="outlined"
						onChange={onChangeText}
						value={setting.setting.ppl}
					/>
				</form>

				<div className="search-again-container">
					<Button className="groupBtn" onClick={onClickSearch}>
						SEARCH AGAIN
					</Button>
				</div>
			</div>
				<>	
					<div className="filter_modal"><Button className="groupBtn search-buttons-group" onClick={handleShow}>Filters</Button><br/></div>
					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Filter</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div style={{ textAlign: "center"}} className="search-buttons-group-container">
								<Button
									className="groupBtn search-buttons-group"
									onClick={() => onClickNow()}
								>
									TODAY
								</Button>
								<Button
									className="groupBtn search-buttons-group"
									onClick={() =>
										setShowCalendor(!showCalendor)
									}
								>
									SELECT DATE
								</Button>
								{showCalendor && (
									<>
										<br />
										<input
											type="date"
											min={`${new Date().getFullYear()}-${d2(
												new Date().getMonth() + 1
											)}-${d2(new Date().getDate())}`}
											onChange={(e) => {
												dispatch(
													toSet(
														setting.setting.ppl,
														setting.setting.priceRg,
														e.target.value
													)
												);
											}}
										/>
									</>
								)}
							</div>
							<Typography
								style={{ textAlign: "center"}}
								id="range-slider"
								gutterBottom
								className="price-tag"
							>
								{`$${setting.setting.priceRg[0]} HKD to $${setting.setting.priceRg[1]} HKD`}{" "}
								/ hour
							</Typography>

							<div className="search-result-slider-container">
								<Slider
									min={10}
									max={2000}
									value={setting.setting.priceRg}
									step={20}
									onChange={handleChange}
									valueLabelDisplay="auto"
									aria-labelledby="range-slider"
									getAriaValueText={valuetext}
									className="search-result-slider"
								/>
							</div>

							<form
								className={classes.setting}
								noValidate
								autoComplete="off"
							>
								<TextField
									InputProps={{ inputProps: { min: 0 } }}
									type="number"
									id="filled-basic"
									className="text-field"
									label="Number of people"
									variant="outlined"
									onChange={onChangeText}
									value={setting.setting.ppl}
								/>
							</form>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={handleClose}>Close</Button>
							<Button onClick={onClickSearch}>Search Again</Button>
						</Modal.Footer>
					</Modal>
				</>

				<span className="search-result-report">
					No. of Space available: {room.length}
				</span>
				<InView onChange={setInView}>
					{({ ref, inView }) => (
						<div className="grid-preview-section">
							{markerState.length > 0 &&
								markerState
								// .slice(0, loadPage)
								.map((e: any, index) => {
										return (
											<div
												className="each-grid-holder"
												key={index}
											>
												<RoomPreviewGrid
													element={e}
													starsArr={starsArr}
													showChosenGrid={
														showChosenGrid
													}
												/>
												<div
													style={{
														marginRight: "5%",
														marginLeft: "5%",
													}}
												>
													<hr />
												</div>
												
											</div>
										);
									})}
							<div className="inview_div" ref={ref}>
								{isLoading &&
									loadPage < markerState.length - 1 && (
									<Loading />
									)}
							</div>
						</div>
					)}
				</InView>
			</div>
			<MapComponent />
		</div>
	);
};

export default SearchResultPage;
