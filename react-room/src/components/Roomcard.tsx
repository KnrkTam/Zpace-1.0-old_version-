import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { push } from "connected-react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLaptopHouse } from '@fortawesome/free-solid-svg-icons'
import "../css/RoomOwnerMain.css";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useDispatch, useSelector } from 'react-redux';
import "../css/Roomcard.css";
import { IRootState } from '../redux/store';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';
import { MenuItem, TextField } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MButton from "@material-ui/core/Button";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// yarn add moment

interface IRoomInfoProps {
    room: {
        id: number,
        space_name: string | null,
        hourly_price: any,
        capacity: string | number | null,
        district: string | null,
        pictures: string[],
        description: string | null,
        address: string | null,
        weeklyTimeSlot: any,
        oneOffTimeSlot: any,
        facilityItems: any,
    },
    starsArr: any
}

const perspectives = [
    {
        value: 'visitorPerspective',
        label: 'View as Renters/Other Visitors',
    },
    {
        value: 'ownerPerspective',
        label: 'View as Self',
    }
];

const useStylesImage = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            flexWrap: 'nowrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        gridListMobile: {
            flexWrap: 'wrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        title: {
            color: "#e0e8ff",
        },
        titleBar: {
            background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
    }),
);

const useStylesModal = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

const Roomcard: React.FC<IRoomInfoProps> = ({ room, starsArr }: any) => {
    const classImage = useStylesImage();
    const bearer: string = 'Bearer ' + localStorage.token;
    const classesModal = useStylesModal();
    const { REACT_APP_API_SERVER } = process.env;
    const room_owner_id = useSelector((state: IRootState) => state.auth.payload.id)
    const [open, setOpen] = React.useState(false);
    let [perspective, setPerspective] = React.useState('ownerPerspective');
    const dispatch = useDispatch();
    const matches = useMediaQuery('(max-width:600px)');

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteRoom = () => {
        setOpen(true);
    }

    const onSubmit = async (event: any) => {
        event.preventDefault();
        let deleteResult = await fetch(`${REACT_APP_API_SERVER}/room-owner/${room_owner_id}`, {
            method: "DELETE",
            headers: {
                'Authorization': bearer,
                'Content-type': "application/json"
            },
            body: JSON.stringify({ "room-id": room.id })
        })
        // const deleteResultJson = 
        await deleteResult.json()

        if (deleteResult.status === 200) {
            window.location.reload();
        } else {
            throw new Error("cannot delete successfully")
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPerspective(perspective = event.target.value);
        if (perspective === 'visitorPerspective') {
            dispatch(push(`/room-detail/${room.id}`))
        }
    };

    // render rating

    const RenderAvgRating = ({ index }: any) => {
        let sumRating = 0
        for (let i = 0; i < room.rating.length; i++) {
            sumRating = sumRating + room.rating[i].rating
        }
        let avgSum = Math.round(sumRating / room.rating.length)


        let num = 1
        if (avgSum >= index) {
            num = 0
        }
        return (
            <>
                {num === 1 ? <StarBorderIcon style={{ marginRight: "2%", color: "#ff385d" }} /> : <StarIcon style={{ marginRight: "2%", color: "#ff385d" }} />}
            </>
        )
    }

    return (

        <React.Fragment>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classesModal.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <form onSubmit={onSubmit}>
                    <div className={classesModal.paper}>
                        <input hidden name="room-id" value={room.id} readOnly />
                        <h4 id="transition-modal-title">Delete this space from your management system?</h4>
                        <br></br>
                        <p id="transition-modal-description">Please be reminded that this action is <strong>irreversible. </strong>
                         On your confirmation, this space will be deleted from Zpace. <br></br>You would have to submit a new form again to
                        re-include it in the system in the future.
                        </p>
                        <div className="confirm-delete-room-buttons-container">
                            <MButton className="confirm-delete-room-buttons" onClick={handleClose} variant="contained"
                                color="primary">
                                Close
                        </MButton>
                            <MButton className="confirm-delete-room-buttons" type="submit" variant="contained"
                                color="primary" value="Confirm">Confirm</MButton>
                        </div>
                    </div>
                </form>
            </Modal>
            <Paper className="card-piece" elevation={3}>
                <div className="room-card-rating-summary"><span className="room-card-rating-summary-span"> Average Rating from {room.rating.length} {room.rating.length > 1 ? "visitors" : "visitor"}: </span></div>
                <div className="room-card-rating-stars-container">
                    {starsArr.map((_: number, index: number) => {
                        return <div key={index}><RenderAvgRating index={index} /></div>
                    })}
                </div>
                <div className="outlined-select-currency-container">
                    <TextField
                        id="outlined-select-currency"
                        select
                        label={<VisibilityIcon />}
                        value={perspective}
                        onChange={handleChange}
                        variant="outlined"
                        SelectProps={{
                            MenuProps: {
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "left"
                                },
                                getContentAnchorEl: null
                            }
                        }}
                    >
                        {perspectives.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <br></br>
                {!room.pictures.length && <div className="default-image-class">
                    <FontAwesomeIcon icon={faLaptopHouse} className="default-image" />
                </div>}
                <div className="card-flex-container">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} container>
                            <div className="gridList-container">
                                {!matches && <GridList className={classImage.gridList} cols={2}>
                                    {room.pictures.length && room.pictures.map((img: any, index: number) => (
                                        <GridListTile key={index}>
                                            <img src={REACT_APP_API_SERVER + "/" + room.pictures[index]} alt="room-pictures" />
                                            <GridListTileBar
                                                title={`photo ${index + 1}`}
                                                classes={{
                                                    root: classImage.titleBar,
                                                    title: classImage.title,
                                                }}
                                            />
                                        </GridListTile>
                                    ))}
                                </GridList>}

                                {matches && <GridList className={classImage.gridListMobile} cols={2}>
                                    {room.pictures.length && room.pictures.map((img: any, index: number) => (
                                        <GridListTile key={index}>
                                            <img src={REACT_APP_API_SERVER + "/" + room.pictures[index]} alt="room-pictures" />
                                            <GridListTileBar
                                                title={`photo ${index + 1}`}
                                                classes={{
                                                    root: classImage.titleBar,
                                                    title: classImage.title,
                                                }}
                                            />
                                        </GridListTile>
                                    ))}
                                </GridList>}
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                        <strong>{room.space_name}</strong>
                                    </Typography>
                                    <hr></hr>
                                    <Typography variant="body2" gutterBottom>
                                        Address: {room.address}
                                    </Typography>
                                    <Typography variant="subtitle1">Hourly Rental:${room.hourly_price.replace(/0+$/, '')[room.hourly_price.replace(/0+$/, '').length - 1] === "." ? room.hourly_price.replace(/.0+$/, '') : room.hourly_price.replace(/0+$/, '')}/hr</Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Capacity: {room.capacity} {room.capacity! > 1 ? "persons" : "person"}
                                    </Typography>
                                    <hr></hr>
                                    {room.facilityItems[0].wifi && <Chip
                                        className="chips"
                                        label="Wifi"
                                        color="primary"
                                    />}
                                    {room.facilityItems[0]["socket_plug"] && <Chip
                                        className="chips"
                                        label="Socket Plug"
                                        color="primary"
                                    />}
                                    {room.facilityItems[0]["air_condition"] && <Chip
                                        className="chips"
                                        label="Air Condition"
                                        color="primary"
                                    />}
                                    {room.facilityItems[0]["desk"] && <Chip
                                        className="chips"
                                        label="Desk"
                                        color="primary"
                                    />}

                                    {!room.facilityItems[0]["wifi"] && !room.facilityItems[0]["socket_plug"] && !room.facilityItems[0]["air_condition"] && !room.facilityItems[0]["desk"] &&
                                        <span>No room facility is specified at the moment.</span>
                                    }

                                    <hr></hr>
                                    {room.weeklyTimeSlot.map((time: any, index: number) => {
                                        return <div key={index}>{time.map((slot: any, sindex: number) => {
                                            let weekdayLabel = slot.weekday.substring(0, 1).toUpperCase() + slot.weekday.substring(1) + ":"
                                            if (slot.timeslots.length === 0) {
                                                return <div key={sindex} className="sslot">{weekdayLabel + " / "}</div>
                                            } else {
                                                return <div className="sslot" key={sindex}>
                                                    {weekdayLabel}
                                                    {slot.timeslots.map((t: any, tindex: number) => {
                                                        return <span className="tslot" key={tindex}>{moment(t.start, "HH:mm:ss").format('LT')} - {moment(t.end, "HH:mm:ss").format('LT')}</span>
                                                    })}
                                                </div>
                                            }
                                        }
                                        )}</div>
                                    })}

                                    {room.oneOffTimeSlot[0].length === 0 && <div>
                                        <br></br>
                                        Current one-off rental services available: 0
                                    </div>}
                                    {room.oneOffTimeSlot[0].length > 0 && <div>
                                        <br></br>
                                        Current one-off rental services available: {room.oneOffTimeSlot.map((time: any, index: number) => {
                                            return <div className="oneslot" key={index}>{time.map((slot: any, index: number) => {
                                                return <div key={index}><span className="oneoff-time-string">{moment(slot.date).format('MMMM Do YYYY')
                                                    + " , " + moment(slot.start_time, 'HH:mm:ss').format('LT') + " - " + moment(slot.end_time, 'HH:mm:ss').format('LT')}</span><br></br></div>
                                            })}</div>
                                        })}
                                    </div>}
                                    <hr></hr>
                                </Grid>
                                <Grid item className="buttons">
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                        <NavLink to={`/room-owner/edit-room?id=${room.id}`} className="link-to-edit"><span className="view-details-and-edit">View Details and Edit</span><FontAwesomeIcon icon={faEdit} className="edit-room-icon" /></NavLink>
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        <DeleteForeverIcon className="delete-room-icon" onClick={handleDeleteRoom}></DeleteForeverIcon>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        </React.Fragment>
    );
}

export default Roomcard;