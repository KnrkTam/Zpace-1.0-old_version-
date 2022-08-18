import React, { useState, useEffect } from "react";
import "../css/MainPage.css";
import { useDispatch, useSelector } from "react-redux";
import { toStoreIP, toSet, toStorePlace } from "../redux/location/actions";
import { push } from "connected-react-router";
import Button from "@material-ui/core/Button";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { TextField, makeStyles, Theme, createStyles } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "../components/Loading";
import { loadingOFF, loadingON } from "../redux/loading/action";
import Places from "../components/Places";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
// import { useSpring, animated } from 'react-spring';

// React-spring
// const calc = (x: any, y: any) => [x - window.innerWidth / 2, y - window.innerHeight / 2]
// const trans1: any = (x: any, y: any) => `translate3d(${x / 10}px,${y / 10}px,0)`
// const trans2: any = (x: any, y: any) => `translate3d(${x / 8 + 35}px,${y / 8 - 230}px,0)`
// const trans3: any = (x: any, y: any) => `translate3d(${x / 6 - 250}px,${y / 6 - 200}px,0)`
// const trans4: any = (x: any, y: any) => `translate3d(${x / 3.5}px,${y / 3.5}px,0)`

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				width: "322px",
				backgroundColor: "white",
				fontFamily: "Poppins, sans-serif !important",
			},
		},
		button: {
			margin: theme.spacing(1),
			width: "322px",
			fontSize: "1.1rem",
			marginTop: "13px",
			fontFamily: "Poppins, sans-serif !important",

		},
		groupBtn: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			"& > *": {
				margin: theme.spacing(1),
			},
		},
		setting: {
			width: 322,
			marginLeft: "auto",
			marginRight: "auto",
			marginTop: "13px",
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},

		searchBtn: {
			marginTop: "5%",
			backgroundColor: "#5455a9",
			color: "white",

			"&:hover": {
				backgroundColor: "#FF385D",
				color: "white",
			},
		},

		advBtn: {
			"&:hover": {
				cursor: "pointer",
			},
		},
	})
);

const valuetext = (value: number) => {
	return `$${value}`;
};
const MainPage = () => {
	const d2 = (x: number) => {
		return x < 10 ? '0' + x : '' + x;
	}

	const loading: any = useSelector<any>((state) => {
		return state.isLoading;
	});
	const classes = useStyles();
	const dispatch = useDispatch();
	const [content, setContent] = useState("");
	const [value, setValue] = useState<number[]>([20, 500]);
	const [numPpl, setNumPpl] = useState(4);
	const [pickedDate, setPickedDate] = useState<any>(
		`${new Date().getFullYear()}-${new Date().getMonth() + 1
		}-${new Date().getDate()}`
	);
	const [showCalendor, setShowCalendor] = useState(false);
	let [advanceSearch, showAdvanceSearch] = useState(false);


	useEffect(() => {
		const onChangeSubmit = async () => {
			dispatch(toSet(numPpl, value, pickedDate));
			const latAndLngJSON = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${content}+Hong+Kong&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
			);
			const latAndLng = await latAndLngJSON.json();
			if (latAndLng.results[0]) {
				let lat = latAndLng.results[0].geometry.location.lat || null;
				let lng = latAndLng.results[0].geometry.location.lng || null;
				const addressJSON = await fetch(
					`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
				);
				const address = await addressJSON.json();
				dispatch(toStorePlace(address.results));
				dispatch(toStoreIP(lat, lng, 15));
			}
		};
		let intervalID: any;
		if (content !== "") {
			intervalID = setInterval(() => {
				onChangeSubmit();
			}, 500);
		}
		return () => clearInterval(intervalID);
	}, [content, dispatch, numPpl, pickedDate, value]);

	const handleChange = (event: any, newValue: any) => {
		setValue(newValue as number[]);
	};
	const onSubmit = (e: any) => {
		e.preventDefault();
		dispatch(loadingON());
		dispatch(push("/search"));
		dispatch(loadingOFF());
	};
	const onClickCurrentLocation = () => {
		dispatch(loadingON());
		dispatch(toSet(numPpl, value, pickedDate));
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				let lat = position.coords.latitude;
				let lng = position.coords.longitude;
				const addressJSON = await fetch(
					`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
				);
				const address = await addressJSON.json();
				dispatch(toStorePlace(address.results));
				dispatch(toStoreIP(lat, lng, 15));
				dispatch(loadingOFF());
				dispatch(push("/search"));
			},
			() => null
		);
	};
	const onChangeText = (e: any) => {
		setNumPpl(e.target.value);
	};

	const handleOnChange = async (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		dispatch(loadingON());
		event.preventDefault();
		const district = event.target.value;
		const latAndLngJSON = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${district}-Hong-Kong&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
		);
		const latAndLng = await latAndLngJSON.json();
		let lat = latAndLng.results[0].geometry.location.lat || null;
		let lng = latAndLng.results[0].geometry.location.lng || null;
		dispatch(toStorePlace([district]));
		dispatch(toSet(numPpl, value, pickedDate));
		dispatch(toStoreIP(lat, lng, 15));
		dispatch(loadingOFF());
		dispatch(push("/search"));
	};

	const toSearchClick = () => {
		dispatch(loadingON());
		dispatch(push("/search"));
		dispatch(loadingOFF());
	};


	// const [props, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }))

	return (
		<>
			<div className="main_page_outter_div">
				<section>
					<div className="main-container">
						<Paper className="search-page-frame" elevation={10}>
							{loading.isLoading && <Loading />}
							{!loading.isLoading && (
								<div>
									<h5 className="userCardTitle">
										Search for a Working Space Instantly
							</h5>
									<hr></hr>
								</div>
							)}

							{!loading.isLoading && (
								<div className="instant-search-div">
									<Button
										variant="outlined"
										onClick={onClickCurrentLocation}
										className="search-buttons"
										startIcon={
											<LocationOnIcon
												style={{
													fontSize: "20",
													color: "#FF385D",
												}}
											/>
										}
									>
										Search By Current Location
							</Button>
									{!loading.isLoading && (
										<>
											<br></br>
											<div className="or">
												<h6>Or</h6>
											</div>
										</>
									)}

									{!loading.isLoading && (
										<div>
											<Places handleChange={handleOnChange} />
										</div>
									)}
									<hr></hr>
								</div>
							)}
							{!loading.isLoading && (
								<h5
									className={classes.advBtn}
									onClick={() => {
										if (advanceSearch === true) {
											showAdvanceSearch((advanceSearch = false));
										} else {
											showAdvanceSearch((advanceSearch = true));
										}
									}}
								>
									<SearchIcon />
							Advanced Search
									{advanceSearch ? (
										<ExpandLessRoundedIcon />
									) : (
											<ExpandMoreRoundedIcon />
										)}{" "}
								</h5>
							)}

							{!loading.isLoading && advanceSearch && (
								<div className={classes.groupBtn}>
									<ButtonGroup
										variant="contained"
										color="default"
										aria-label="contained primary button group"
									>
										<Button
											className="day-buttons"
											onClick={() =>
												setShowCalendor(!showCalendor)
											}
										>
											SELECT DAY
								</Button>
										{showCalendor && (
											<input
												min={`${new Date().getFullYear()}-${d2(new Date().getMonth() + 1)}-${d2(new Date().getDate())}`}
												type="date"
												onChange={(e) =>
													setPickedDate(e.target.value)
												}
											/>
										)}
									</ButtonGroup>
								</div>
							)}
							{!loading.isLoading && advanceSearch && (
								<form
									onSubmit={(e) => onSubmit(e)}
									className={classes.root}
									noValidate
									autoComplete="off"
								>
									<TextField
										id="filled-full-width"
										label="Location/Address"
										variant="outlined"
										type="text"
										name="place"
										value={content}
										onChange={(e) => setContent(e.target.value)}
									/>
								</form>
							)}
							{!loading.isLoading && advanceSearch && (
								<div className={classes.setting}>
									<Typography
										id="range-slider"
										gutterBottom
										className="price-tag"
									>
										{`$${value[0]} HKD to $${value[1]} HKD`} / hour
							</Typography>
									<Slider
										min={10}
										max={2000}
										value={value}
										step={20}
										onChange={handleChange}
										valueLabelDisplay="auto"
										aria-labelledby="range-slider"
										getAriaValueText={valuetext}
									/>

									<form
										className={classes.setting}
										noValidate
										autoComplete="off"
									>
										<TextField
											id="filled-full-width"
											className="text-field"
											label="Number of visitors"
											variant="outlined"
											onChange={onChangeText}
											value={numPpl}
										/>
										{!loading.isLoading && advanceSearch && (
											<Button
												className={classes.searchBtn}
												onClick={toSearchClick}
											>
												Search Room
											</Button>
										)}
									</form>
								</div>
							)}
						</Paper>
					</div>
				</section>


				{/* <section>
					<div className={styles.spring_card_container1} onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
						<animated.div className={styles.spring_card1} style={{ transform: props.xy.interpolate(trans1) }} />
					</div>

					<div className={styles.spring_card_container2} onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
						<animated.div className={styles.spring_card2} style={{ transform: props.xy.interpolate(trans1) }} />
					</div>
				</section> */}
			</div>
		</>
	);
};

export default MainPage;
