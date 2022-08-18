import React, { useState } from 'react';
import styles from "../css/EditRoom.module.css"
import TextField from '@material-ui/core/TextField';
import { push } from "connected-react-router";
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../redux/store';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopHouse } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Container, Typography } from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import RenderPreview from '../components/RenderPreview';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MButton from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import moment from 'moment'
import EditRenderWeeklyTime from '../components/EditRenderWeekly';
import EditRenderOneTime from '../components/EditRenderOneTime';
import Alert from '@material-ui/lab/Alert';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export type State = {
    room: {
        "id": any, "hourly_price": any, "capacity": any, "space_name": any, "district": any, "created_at": any, "description": any, "address": any
    },
    room_pictures: Array<{
        "id": any, "picture_filename": any, "rooms_id": any
    }>,
    weekly_open_timeslot: Array<{
        "id": any, "monday": any, "tuesday": any, "wednesday": any, "thursday": any, "friday": any, "saturday": any, "sunday": any, "start_time": any, "end_time": any, "rooms_id": any
    }>,
    oneoff_open_timeslot: Array<{
        "date": any, "start_time": any, "end_time": any, "rooms_id": any
    }>
}

export let WeekDays: Array<keyof State['weekly_open_timeslot'][number]> = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
]


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            flexWrap: 'nowrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        title: {
            color: theme.palette.primary.light,
            fontSize: "36px"
        },
        titleBar: {
            background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
        typography: {
            padding: theme.spacing(2),
        },
        table: {
            width: "750px",
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        button: {
            marginRight: theme.spacing(1),
        },
    }),
);


const EditRoom = () => {
    let [pictureNo, setPictureNo] = useState<any>('');
    let [weeklyTimeSlotId, setWeeklyTimeSlotId] = useState<any>('');
    let [oneOffTimeSlotId, setOneOffTimeSlotId] = useState<any>('');
    let [deletePicArray, setDeletePicArray] = useState<any>([]);
    let [deleteWeeklyArray, setDeleteWeeklyArray] = useState<any>([]);
    let [deleteOneOffArray, setDeleteOneOffArray] = useState<any>([]);

    const { REACT_APP_API_SERVER } = process.env
    const bearer: string = 'Bearer ' + localStorage.token;
    const urlParams = new URLSearchParams(window.location.search);
    const room_id = urlParams.get("id");
    let room_owner_id = useSelector((state: IRootState) => state.auth.payload.id);
    let dispatch = useDispatch();

    let [selectedFile, setSelectedFile] = useState([]);

    let [renderWeekly, setRenderWeekly] = useState(false);
    let [renderOneOff, setRenderOneOff] = useState(false);
    let [maxWeekArray, setMaxWeekArray] = useState(false);
    let [maxOneOffArray, setOneOffWeekArray] = useState(false);
    let [newSpaceName, setNewSpaceName] = React.useState('');
    let [newCapacity, setNewCapacity] = React.useState('');
    let [newHourlyPrice, setNewHourlyPrice] = React.useState('');
    let [newDescription, setNewDescription] = React.useState('');

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const [state, setState] = React.useState<State>({
        room: {} as any,
        room_pictures: [],
        weekly_open_timeslot: [],
        oneoff_open_timeslot: []
    });
    if (pictureNo && weeklyTimeSlotId && oneOffTimeSlotId && renderWeekly && renderOneOff) { }
    const steps = getSteps();

    const {
        room,
        room_pictures,
        weekly_open_timeslot,

    } = state

    const matches = useMediaQuery('(min-width:600px)');

    WeekDays.map((weekday) => {
        return {
            weekday,
            timeslots: weekly_open_timeslot
                .filter((timeslot) => timeslot[weekday])
                .map((s) => ({ start: s.start_time, end: s.end_time }))
        }
    })

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [timeslotanchor, settimeslotanchor] = React.useState<HTMLButtonElement | null>(null);
    if (timeslotanchor && anchorEl) { }
    if (setAnchorEl && settimeslotanchor) { }
    // str format = hh:mm
    const strToTime = (str: string = "00:00") => {
        let parts = str.split(':')
        let hour = +parts[0]
        let minute = +parts[1]
        return hour * 60 + minute
    }
    const d2 = (x: number) => {
        return x < 10 ? '0' + x : '' + x;
    }
    // output format = hh:mm
    function timeToStr(time: number) {
        let minute = time % 60
        let hour = (time - minute) / 60
        return d2(hour) + ':' + d2(minute)
    }
    function mergeStartEnd(timeslots: any) {
        let availableTimes = []
        for (let i = strToTime('00:00'); i <= strToTime('23:59'); i++) {
            availableTimes[i] = false
        }
        for (let { start_time, end_time } of timeslots) {
            for (let i = strToTime(start_time); i <= strToTime(end_time); i++) {
                availableTimes[i] = true
            }
        }
        let res = []
        let mode = 'find start'
        let start_time: number
        let end_time: number
        for (let i = strToTime('00:00'); i <= strToTime('23:59'); i++) {
            if (mode === 'find start' && availableTimes[i]) {
                start_time = i
                mode = 'find end'
            }
            if (mode === 'find end' && !availableTimes[i]) {
                end_time = i
                mode = 'find start'
                res.push({
                    start_time: timeToStr(start_time!),
                    end_time: timeToStr(end_time - 1)
                })
            }
        }
        if (mode === 'find end') {
            res.push({
                start_time: timeToStr(start_time!),
                end_time: '23:59'
            })
        }
        // check for full-day special case
        if (res.some(timeslot =>
            timeslot.start_time === '00:00'
            && timeslot.end_time === '00:00'
        )) {
            return ["FullDay"]
        }
        return res
    }

    let FullDay = {
        start_time: '00:00', end_time: '00:00'
    }

    function getSteps() {
        return ['Edit Available Timeslots', 'Edit Other Information(Basic Info and Photos)'];
    }

    function reduceTimeslot(timeslots: any) {
        let res: any = {}
        for (let weekDay of WeekDays) {
            res[weekDay] = []
        }

        for (let i = 0; i < timeslots.length; i++) {

            for (let weekDay of WeekDays) {
                if (timeslots[i][weekDay]) {
                    res[weekDay].push({
                        start_time: timeslots[i].start_time,
                        end_time: timeslots[i].end_time
                    })
                }
            }
        }
        for (let weekDay of WeekDays) {
            res[weekDay] = mergeStartEnd(res[weekDay])
        }
        return res
    }

    const isStepOptional = (step: number) => {
        return step === 0 || step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };


    const handleDeleteClick = (picId: any, picNo: any) => {
        if (deletePicArray.findIndex((obj: any) => { return obj.id === picId }) === -1) {
            setDeletePicArray((event: any) => { return event.concat([{ id: picId, no: picNo }]) })
        }
    }

    const cancelDeleteClick = (picId: any, picNo: any) => {
        let cancelResultArray = deletePicArray.filter((obj: any) => { return obj.id !== picId })
        setDeletePicArray((event: any) => { return cancelResultArray })
    }

    const handleDeleteWeeklyClick = (timeslotId: any, index: number) => {
        setDeleteWeeklyArray((e: any) => {
            return e.concat([timeslotId])
        })
        state.weekly_open_timeslot = state.weekly_open_timeslot.filter((event: any) => event.id !== timeslotId)
        setState({ ...state })

    }

    const handleDeleteOneOffClick = (onetimeslotId: any, index: number) => {
        setDeleteOneOffArray((e: any) => {
            return e.concat([onetimeslotId])
        })
        state.oneoff_open_timeslot = state.oneoff_open_timeslot.filter((event: any) => event.id !== onetimeslotId)
        setState({ ...state })
    }

    const onSelectFile = (e: any) => {
        // image preview: preview all files
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile([])
            return
        }
        setSelectedFile(() => e.target.files)

    }

    const renderWeeklyTime = () => {
        if (state.weekly_open_timeslot.length < 5) {
            setRenderWeekly(true);
            state.weekly_open_timeslot.push({
                "id": undefined,
                "monday": false,
                "tuesday": false,
                "wednesday": false,
                "thursday": false,
                "friday": false,
                "saturday": false,
                "sunday": false,
                "start_time": "00:00:00",
                "end_time": "00:00:00",
                "rooms_id": room_id
            })
            setState({ ...state })

        } else {
            setMaxWeekArray(true);
        }
    }

    const renderOneOffTime = () => {
        if (state.oneoff_open_timeslot.length < 5) {
            setRenderOneOff(true);
            state.oneoff_open_timeslot.push({
                "date": new Date().toISOString(),
                "start_time": "00:00:00",
                "end_time": "00:00:00",
                "rooms_id": room_id
            })

        } else {
            setOneOffWeekArray(true);
        }
    }

    const loadOriginalInfo = async () => {
        let roomInfo = await fetch(`${REACT_APP_API_SERVER}/edit-room/${room_id}`, {
            method: "GET",
            headers: {
                'Authorization': bearer,
            }
        })

        const state = await roomInfo.json()
        setState(state)

        if (roomInfo.status === 200) {
            return { message: "ok" }
        } else {
            throw new Error("not ok")
        }
    }

    const onSubmitNewInfo = async (event: any) => {
        event.preventDefault();
        const formData = new FormData();
        if (newSpaceName) {
            formData.append("newSpaceName", newSpaceName);
        } else {
            formData.append("newSpaceName", room.space_name)
        }
        if (newHourlyPrice) {
            formData.append("newHourlyPrice", newHourlyPrice)
        } else {
            formData.append("newHourlyPrice", room.hourly_price)
        }
        if (newCapacity) {
            formData.append("newCapacity", newCapacity)
        } else {
            formData.append("newCapacity", room.capacity)
        }
        if (newDescription) {
            formData.append("newDescription", newDescription)
        } else {
            formData.append("newDescription", room.description)
        }

        if (deletePicArray.length > 0) {
            for (let i = 0; i < deletePicArray.length; i++) {
                formData.append("deletePicArray", deletePicArray[i].id)
            }
        }

        let newPicturesArr = Array.from(selectedFile)
        for (let i = 0; i < newPicturesArr.length; i++) {
            formData.append("newPictures", newPicturesArr[i])
        }

        // delete weekly 
        if (deleteWeeklyArray.length > 0) {
            for (let i = 0; i < deleteWeeklyArray.length; i++) {
                formData.append("deleteWeeklyArray", deleteWeeklyArray[i])
            }
        }

        // update weekly
        if (state.weekly_open_timeslot.length > 0) {
            for (let i = 0; i < state.weekly_open_timeslot.length; i++) {
                formData.append("weeklyUpdate", JSON.stringify(state.weekly_open_timeslot[i]))
            }
        }

        if (state.oneoff_open_timeslot.length > 0) {
            for (let i = 0; i < state.oneoff_open_timeslot.length; i++) {
                formData.append("oneOffTimeSlot", JSON.stringify(state.oneoff_open_timeslot[i]))
            }
        }
        if (deleteOneOffArray.length > 0) {
            for (let i = 0; i < deleteOneOffArray.length; i++) {
                formData.append("deleteOneOffArray", deleteOneOffArray[i])
            }

        }

        let editResult = await fetch(`${REACT_APP_API_SERVER}/edit-room/${room_id}`, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
            },
            body: formData
        })
        await editResult.json();
        if (editResult.status === 200) {
            dispatch(push(`/room-owner/${room_owner_id}`))
        } else {
            throw new Error("error");
        }
    }


    React.useEffect(() => {
        (async () => { await loadOriginalInfo(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let weeklySummary = reduceTimeslot(state.weekly_open_timeslot)
    return (
        <div>
            <Container>
                <form onSubmit={onSubmitNewInfo}>
                    <div className={styles.editHeaderContainer}>
                        <h3 className="information-header">Edit Information of Your Space</h3>
                    </div>

                    <Stepper className="edit-stepper" activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: { optional?: React.ReactNode } = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = <Typography variant="caption">Optional</Typography>;
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>

                    <hr></hr>

                    {activeStep === 0 && <React.Fragment>
                        {state.weekly_open_timeslot.length === 0 ? <div>
                            <h4>Current Weekly Availability</h4>
                            <br></br>
                            <h4>No weekly time slot is reserved for rental service at the moment.</h4>
                        </div> :
                            <div>
                                <h4>Current Weekly Availability</h4>
                                {matches && <TableContainer className={styles.oneOffTableContainer}>
                                    <Table className={classes.table} size="medium" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Days</TableCell>
                                                {WeekDays.map((weekday: any, index: number) => {
                                                    return <TableCell align="center" key={index}>{weekday.substring(0, 1).toUpperCase() + weekday.substring(1)}</TableCell>
                                                })}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    Opening Hours
                                                        </TableCell>
                                                {WeekDays.map((weekDay, index) => <TableCell key={index} className='weekday'>
                                                    {(() => {
                                                        let timeslots = weeklySummary[weekDay];
                                                        if (timeslots[0] === FullDay) {
                                                            return <div className='time'>
                                                                Full-day
                                                                    </div>
                                                        }
                                                        return timeslots.map((timeslot: any, index: number) => <div key={index} className='time'>
                                                            {timeslot.start_time} - {timeslot.end_time}
                                                        </div>)
                                                    })()}
                                                </TableCell>)}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>}
                            </div>
                        }

                        {state.weekly_open_timeslot.map((timeslot: any, index: any) => {
                            return (<div key={index} className='timeslot'>
                                <div key={index}>
                                    <EditRenderWeeklyTime index={index} timeslot={timeslot} WeekDays={WeekDays} setTimeslot={(timeslot: any) => {
                                        state.weekly_open_timeslot[index] = timeslot
                                        setState({ ...state })
                                    }} />
                                </div>
                                <div className={styles.deleteWeeklyTimeSlotButton}>
                                    <IconButton
                                        onClick={() => {
                                            setWeeklyTimeSlotId(timeslot.id)
                                            handleDeleteWeeklyClick(timeslot.id, index)
                                        }}>
                                        <DeleteIcon className={classes.title} />
                                    </IconButton>
                                </div>
                            </div>)
                        })}

                        {maxWeekArray &&
                            <Alert className={styles.error} severity="warning"><strong>You may only input 5 weekly timeslots at one time.</strong></Alert>
                        }

                        {/* weekly edit */}
                        <div className={styles.editAddContainer}>
                            <MButton variant="contained" color="primary" id="weekly-date-edit" aria-label="add" onClick={renderWeeklyTime}>
                                <AddIcon />
                     Click to add weekly rent service time slot (e.g. Monday to Friday, 3p.m. to 5p.m.)
                    </MButton>
                        </div>


                        <hr></hr>

                        {/* one-off edit */}
                        {state.oneoff_open_timeslot.length === 0 ? <div>
                            <h4>Current One-off Availability</h4>
                            <br></br>
                            <h4>No particular days is reserved for rental service at the moment.</h4>
                        </div>
                            : <div>
                                <h4>Current One-off Availability</h4>
                                {matches && <TableContainer className="one-off-table-container">

                                    <Table className={classes.table} size="medium" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">No. of Time Slots</TableCell>
                                                <TableCell align="center">Date</TableCell>
                                                <TableCell align="center">Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {state.oneoff_open_timeslot.map((time: any, index: number) => (
                                                <TableRow key={index}>
                                                    {/* <TableCell component="th" scope="row">{index + 1}</TableCell> */}
                                                    <TableCell align="center">{index + 1}</TableCell>
                                                    <TableCell align="center">{moment(time.date).format('MMMM Do YYYY')}</TableCell>
                                                    <TableCell align="center">{moment(time.start_time, "HH:mm:ss").format('LT')} to {moment(time.end_time, "HH:mm:ss").format('LT')}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>}
                            </div>}

                        {state.oneoff_open_timeslot.length > 0 && state.oneoff_open_timeslot.map((oneTimeSlot: any, index: number) => {
                            return <div key={index} className="timeslot">
                                <div key={index}>
                                    <EditRenderOneTime index={index} timeslot={oneTimeSlot} setTimeslot={(timeslot: any) => {
                                        state.oneoff_open_timeslot[index] = timeslot
                                        setState({ ...state })
                                    }} />
                                </div>
                                <div className="delete-weekly-timeslot-button">

                                    <IconButton onClick={() => {
                                        setOneOffTimeSlotId(oneTimeSlot.id)
                                        handleDeleteOneOffClick(oneTimeSlot.id, index)
                                    }}>
                                        <DeleteIcon className={classes.title} />
                                    </IconButton>
                                </div>
                            </div>
                        })}

                        {maxOneOffArray &&
                            <Alert className="error" severity="warning"><strong>You may only input 5 particular timeslots at one time.</strong></Alert>
                        }

                        <div className="edit-add-container">
                            <MButton variant="contained" color="primary" id="special-date-edit" aria-label="add" onClick={renderOneOffTime}>
                                <AddIcon />
                        Click to add one-off service time slot (e.g. 24/11/2020, 3p.m. to 5p.m.)
                        </MButton>
                        </div>

                        <hr></hr>

                    </React.Fragment>}

                    {activeStep === 1 && <div className={styles.currentPhoto}>
                        <span>Edit Current Photos</span>
                        <br></br>
                    </div>}

                    {activeStep === 1 && <div className="edit-room-container">

                        {room_pictures.length <= 0 ?
                            // no-photos-container
                            <div className={styles.defaultNoPhotosContainer}>
                                <FontAwesomeIcon icon={faLaptopHouse} className={styles.defaultImage} />
                                <br></br>
                                <br></br>
                                <span className={styles.noPhotosAtMoment}>This space has no photos at the moment.</span>
                            </div> :

                            // have-photos-container
                            <div className={classes.root}>
                                <GridList className={classes.gridList} cols={3}>
                                    {room_pictures?.map((picture: any, index: number) => (
                                        <GridListTile key={index}>
                                            <img src={REACT_APP_API_SERVER + "/" + picture["picture_filename"]} alt="room-pictures" />
                                            <GridListTileBar
                                                title={`photo ${index + 1}`}
                                                classes={{
                                                    root: classes.titleBar,
                                                    title: classes.title,
                                                }}
                                                actionIcon={
                                                    <IconButton onClick={() => {
                                                        setPictureNo(`photo ${index + 1}`)
                                                        handleDeleteClick(picture.id, `photo ${index + 1}`)
                                                    }}>
                                                        <DeleteIcon className={classes.title} />
                                                    </IconButton>
                                                }
                                            />
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </div>}

                        {deletePicArray.length ? <span>Photos to be deleted:</span> : <></>}
                        {deletePicArray.length ? deletePicArray.map((pic: any, index: number) => {
                            return <div key={index} className={styles.deletePicCardContainer}>
                                <Card className={styles.deletePicCard}>
                                    <div className={styles.picNoSpan}>{pic.no}</div>
                                    <div className={styles.cancelDeletePic}><MButton variant="contained"
                                        color="primary" onClick={() => { cancelDeleteClick(pic.id, pic.no) }}>Cancel</MButton></div>
                                </Card></div>
                        }) : <div></div>}

                        <div className={styles.addExtraPhotoButtonContainer}>
                            <label htmlFor="add-pictures" id="add-extra-photo-label">
                                <PhotoCameraIcon className={styles.addExtraPhotoButton} />
                                <span>Upload New Photos</span>
                            </label>
                            <div className={styles.addPhotosSmallDiv}>
                                <input type="file" id="add-pictures" name="addPictures" multiple onChange={onSelectFile}></input>
                                <br></br>
                            </div>
                        </div>
                        <div className={styles.renderPreviewPicContainer}>
                            {selectedFile.length > 0 && Array.from(selectedFile).map((e: any, inx: number) => {
                                return <RenderPreview render={e} key={inx} />
                            })}
                        </div>

                        {<div className={styles.currentPhoto}>
                            <span>Edit the Space's Basic Information</span>
                            <br></br>
                        </div>}
                        <div className={styles.informationHeaderContainer}>
                            <div className={styles.smallFlexContainer}>
                                <TextField
                                    value={newSpaceName}
                                    onChange={(e) => { setNewSpaceName(e.target.value) }}
                                    name="space_name"
                                    id="filled-full-width"
                                    className={styles.editColumns}
                                    label={"Current Name of Space:" + room?.space_name}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <div className={styles.smallFlexContainer}>
                                <TextField
                                    name="capacity"
                                    InputProps={{ inputProps: { min: 0 } }}
                                    id="outlined-number"
                                    label={"Current Capacity:" + room?.capacity}
                                    type="number"
                                    margin="normal"
                                    className={styles.editColumns}
                                    value={newCapacity}
                                    onChange={(e) => { setNewCapacity(e.target.value) }}
                                    variant="outlined"
                                />
                            </div>
                            <div className={styles.smallFlexContainer}>
                                <TextField
                                    InputProps={{ inputProps: { min: 0 } }}
                                    name="hourly_price"
                                    id="hourly_price"
                                    label={"Current hourly_price:" + room?.hourly_price.replace(/0+$/, '')[room?.hourly_price.replace(/0+$/, '').length - 1] === "." ? room?.hourly_price.replace(/.0+$/, '') : room?.hourly_price.replace(/0+$/, '') + "/hr"}
                                    type="number"
                                    margin="normal"
                                    className={styles.editColumns}
                                    value={newHourlyPrice}
                                    onChange={(e) => { setNewHourlyPrice(e.target.value) }}
                                    variant="outlined"
                                />
                            </div>
                            <div className={styles.smallFlexContainer}>
                                <span className={styles.currentInfo}></span>
                                <TextField
                                    name="description"
                                    label={"Input New Description"}
                                    id="description"
                                    type="text"
                                    margin="normal"
                                    className={styles.editColumns}
                                    value={newDescription}
                                    onChange={(e) => { setNewDescription(e.target.value) }}
                                    variant="outlined"
                                />
                            </div>
                        </div>

                    </div>}

                    <div className={styles.allTheStepperButtons}>
                        {
                            <div className={styles.editSettingButtons}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    hidden={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.button}>
                                    Back
                                </Button>
                                {isStepOptional(activeStep) && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSkip}
                                        className={classes.button}
                                        hidden={activeStep === 1}
                                    >
                                        Skip
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                    hidden={activeStep === 1}
                                >
                                    Next
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    type="submit"
                                    value="Submit"
                                    hidden={activeStep !== 1}
                                >
                                    Submit
                                </Button>
                            </div>
                        }
                    </div>
                </form>
            </Container>
        </div>
    );
}

export default EditRoom;
