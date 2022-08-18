import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useParams, NavLink } from "react-router-dom";
import Loading from "../components/Loading";
import styles from "../css/Profile.module.css";
import { toUserInfo } from "../redux/auth/actions";
import { useForm } from "react-hook-form";
import Alert from "@material-ui/lab/Alert";
import { Paper, TextField, IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { PhotoCamera, AccountCircle } from "@material-ui/icons";
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import VerifiedUserSharpIcon from '@material-ui/icons/VerifiedUserSharp';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import MButton from "@material-ui/core/Button";
import { Container, Row, Col } from "react-bootstrap";
import CommentGrid from "../components/CommentGrid";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import EditRoundedIcon from '@material-ui/icons/EditRounded';
interface IUserInfos {
    id: null | number;
    email: null | string;
    description: string | null;
    created_at: string | null;
    phone_number: string | number | null;
    profile_picture: string | null;
    updated_at: string | null;
    username: string | null;
    canEdit: boolean;
}

interface IEditProps {
    username: string;
    description: string;
    phone_number: number;
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    button_submit: {
        width: "20%",
        marginTop: "16px",
        height: "55px"
    }
});

const Profile = () => {
    const classes = useStyles();
    const bearer: string = "Bearer " + localStorage.token;
    const { register, handleSubmit, errors } = useForm<IEditProps>({});
    const userInfoRedux: any = useSelector<any>((state: any) => {
        return state.userInfo.payload;
    });
    const starsArr = ["star", "star", "star", "star", "star"]
    const initialInfo = {
        id: null,
        email: null,
        description: null,
        created_at: null,
        phone_number: null,
        profile_picture: null,
        updated_at: null,
        username: null,
        canEdit: false,
    };

    // useState
    const [userInfo, setUserInfo] = useState<IUserInfos>(initialInfo);
    const [loading, setLoading] = useState(true);
    const [uploadPhoto, setUploadPhoto] = useState([]);
    const [ratingState, setRatingState] = useState<any>(null)
    let [ratingAvg, setRatingAvg] = useState<any>([])
    const [ratingAndCommentState, setRatingAndCommentState] = useState([])
    const [commentState, setCommentState] = useState("")
    const [roomId, setRoomId] = useState(null)
    const [canRate, setCanRate] = useState(false)
    let [valueBox, setValueBox] = useState(0);
    const [roomLikeRecordArr, setRoomLikeRecordArr] = useState([])
    const [submitRatingAlert, setSubmitRatingAlert] = useState(false)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValueBox(newValue);
    };

    const handleProfileEditClick = () => {
        setValueBox(0)
    }

    const handleFavSpaceClick = async () => {
        setValueBox(1)
        const res = await fetch(`${process.env.REACT_APP_API_SERVER}/profile/like/`, {
            method: "GET",
            headers: {
                Authorization: bearer,
            },
        });
        const getLikeResults = await res.json()
        setRoomLikeRecordArr(getLikeResults)
    }

    // Redux
    const desTyping = userInfoRedux.description;
    const nameTyping = userInfoRedux.username;
    const phone = userInfoRedux.phone_number;
    const proPic = userInfoRedux.profile_picture;
    const roomRatingArr = userInfoRedux.roomRatingArr;
    const customerRatingArr = userInfoRedux.customerRatingArr
    // let createBy = userInfo.created_at.slice(0,10)


    // Backend connect
    const { REACT_APP_API_SERVER } = process.env;
    const dispatch = useDispatch();

    // Params
    let params = useParams();
    const idMessage = (params as any).id;

    React.useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetch(`${REACT_APP_API_SERVER}/profile/detail/${idMessage}`, {
                method: "GET",
                headers: {
                    Authorization: bearer,
                },
            });
            const { checkProfile, userRateAndComment, userRatingAvg } = await res.json();
            setLoading(false);
            if (!checkProfile || checkProfile === undefined) {
                dispatch(push(`/`));
            } else {
                if (checkProfile.profile_picture.slice(0, 5) !== "https") {
                    checkProfile.profile_picture =
                        REACT_APP_API_SERVER + "/" + checkProfile.profile_picture;
                }
                setRatingAvg(userRatingAvg)
                setRatingAndCommentState(userRateAndComment)
                setUserInfo(checkProfile);
                setRoomId(checkProfile.canRate.length > 0 ? checkProfile.canRate[0].id : null)
                setCanRate(checkProfile.canRate.length > 0)
            }
        };

        if (idMessage) {
            fetchUserData();
        } else {
            dispatch(push(`/profile/${userInfo.id}`));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idMessage]);

    const onSubmitEdit = async (event: any) => {
        setLoading(true);
        const formData = new FormData();
        if (nameTyping) {
            formData.append("username", nameTyping);
        } else {
            formData.append("username", event.username);
        }
        if (desTyping) {
            formData.append("description", desTyping);
        } else {
            formData.append("description", event.description || "");
        }
        if (phone) {
            formData.append("phone_number", phone || "");
        } else {
            formData.append("phone_number", event.phone_number);
        }
        const response = await fetch(
            `${REACT_APP_API_SERVER}/profile/edit-description`,
            {
                method: "POST",
                headers: {
                    Authorization: bearer,
                },
                body: formData,
            }
        );

        if (response.status === 200) {
            dispatch(
                toUserInfo(
                    userInfo.created_at,
                    null,
                    null,
                    nameTyping,
                    desTyping,
                    phone,
                    roomRatingArr,
                    customerRatingArr
                )
            );

            userInfo.username = nameTyping;
            userInfo.description = desTyping;
            userInfo.phone_number = phone;
        }
        setLoading(false);
    };
    React.useEffect(() => {
        if (uploadPhoto.length > 0) {
            const changePhoto = async () => {
                const formData = new FormData();
                formData.append("profile_picture", uploadPhoto[0]);
                const res = await fetch(
                    `${REACT_APP_API_SERVER}/profile/edit-profile-picture`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: bearer,
                        },
                        body: formData,
                    }
                );
                if (res.status === 200) {
                    let { profilePic } = await res.json();

                    if (profilePic.slice(0, 5) !== "https") {
                        profilePic = REACT_APP_API_SERVER + "/" + profilePic;
                    }
                    setUserInfo((e: any) => {
                        return { ...e, profile_picture: profilePic };
                    });
                    dispatch(
                        toUserInfo(null, null, profilePic, nameTyping, desTyping, phone, [], [])
                    );
                }
            };
            changePhoto();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadPhoto]);

    const onChangeFile = (file: any) => {
        setUploadPhoto(file.target.files);
    };

    const onSubmitRating = async (event: any) => {
        event.preventDefault()
        if (ratingState !== null) {
            let resJSON = await fetch(`${process.env.REACT_APP_API_SERVER}/profile/rating/${idMessage}`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentState, ratingState, room_id: roomId })
            })
            if (resJSON.status === 200) {
                let { userInfo, commentState, ratingState } = await resJSON.json()
                setCanRate(false)
                setRatingAvg((e: any) => e.concat([{ rating: ratingState }]))
                setRatingAndCommentState((e: any) => e.concat([{ comment: commentState, rating: ratingState, created_at: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, username: userInfo.username, profile_picture: userInfo.profile_picture }]))
            }
        } else {
            setSubmitRatingAlert(true)
        }
    }

    const starRatingOnClick = (index: number) => {
        setRatingState(index)
    }

    const StarRender = ({ index }: any) => {
        let num = 0
        if (ratingState === null) {
            num = 0
        } else if (ratingState >= index) {
            num = 1
        }

        return (
            <>
                {num === 0 ? <StarBorderRoundedIcon style={{ marginRight: "2%", color: "#ff385d" }} /> : <StarRoundedIcon style={{ marginRight: "2%", color: "#ff385d" }} />}
            </>
        )
    }
    const RenderAvgRating = ({ index }: any) => {

        let sumRating = 0
        for (let i = 0; i < ratingAvg.length; i++) {
            sumRating = sumRating + ratingAvg[i].rating
        }
        let avgSum = Math.round(sumRating / ratingAvg.length)


        let num = 0
        if (avgSum >= index) {
            num = 1
        }

        return (
            <>
                {num === 0 ? <StarBorderRoundedIcon style={{ color: "#ff385d", marginRight: "2%" }} /> : <StarRoundedIcon style={{ color: "#ff385d", marginRight: "2%" }} />}
            </>
        )
    }
    return (
        <div>
            {loading && <Loading />}
            {/* Viewing other's profile */}
            <Container>
                <Row className={styles.row}>
                    {!loading && !userInfo.canEdit && (
                        <>
                            <Col className={styles.col} sm={5} xs={12}>
                                <Paper>
                                    <div className={styles.proPicCol}>
                                        <div className={styles.proPicContainer}>
                                            <img src={`${userInfo.profile_picture}`} alt="profile-pic" />
                                        </div>
                                    </div>

                                    <hr className={styles.proPicLine} style={{ width: "90%" }} />
                                    <div className={styles.reviewContainer} style={{ paddingBottom: "20px" }}>
                                        <h6 style={{ display: "flex", flexDirection: "column" }}>
                                            <div>{starsArr.map((_, index) => {
                                                return <RenderAvgRating key={index} index={index} />
                                            })}
                                            </div>
                                            <div style={{ padding: "2px" }} className={styles.rate_text}>Rated by {ratingAvg.length} {ratingAvg.length > 1 ? "users" : "user"}</div>
                                        </h6>
                                        <h6 style={{ display: "flex", alignItems: "center" }}><VerifiedUserSharpIcon style={{ marginRight: "2%" }} />
                                        Verified Account
                                    </h6>
                                    </div>
                                </Paper>
                            </Col>
                            <Col className={styles.col} lg={7} sm={7} xs={12}>
                                <div className={styles.infoContainer}>
                                    <h2>Hi, I'm {userInfo.username}</h2>
                                    <p style={{ color: "#8B8B8B", fontSize: "smaller" }}>Joined Zpace in {userInfo.created_at?.slice(0, 10)}</p>
                                    <h2>About</h2>
                                    <h4>{userInfo.description}</h4>
                                    <p style={{ color: "#8B8B8B", fontSize: "smaller" }}>{userInfo.email}</p></div>
                            </Col>
                        </>

                    )}


                    {/* Check self profile */}
                    {!loading && userInfo.canEdit && (
                        <Col className={styles.col} lg={5} sm={5} xs={12}>
                            <Paper className={styles.proPicPaper}>
                                <Row>
                                    <Col className={styles.proPicCol} sm={12} xs={5}>
                                        <div className={styles.proPicContainer}>
                                            <img src={`${userInfo.profile_picture}`} alt="profile-pic" />
                                        </div>
                                        <label htmlFor="file-button">
                                            <IconButton
                                                color="primary"
                                                aria-label="upload picture"
                                                component="span"
                                            >
                                                <PhotoCamera />
                                            </IconButton>
                                            <MButton className={styles.proPicText} color="primary" component="span">
                                                Update Photo
                                            </MButton>
                                        </label>
                                        <input
                                            className={styles.uploadBtn}
                                            id="file-button"
                                            type="file"
                                            name="profile_picture"
                                            onChange={onChangeFile}
                                        />
                                    </Col>
                                    <Col sm={12} xs={7}>
                                        <hr className={styles.proPicLine} style={{ width: "90%" }} />
                                        <div className={styles.reviewContainer}>
                                            <h6 style={{ display: "flex", flexDirection: "column", }}>
                                                <div>{starsArr.map((_, index) => {
                                                    return <RenderAvgRating key={index} index={index} />
                                                })}
                                                </div>
                                                <div style={{ padding: "2px" }} className={styles.rate_text}>Rated by {ratingAvg.length} {ratingAvg.length > 1 ? "users" : "user"}</div>
                                            </h6>
                                            <h6 style={{ display: "flex", alignItems: "center" }}><VerifiedUserSharpIcon style={{ marginRight: "2%" }} />
                                                Verified Account
                                            </h6>
                                            <h6 style={{ display: "flex", alignItems: "center" }}><HomeWorkIcon style={{ marginRight: "2%" }} />
                                                <NavLink style={{ color: "black" }} to={`/room-owner/user-booking-history/${userInfoRedux.id}`}>
                                                    Booking History
                                                </NavLink>
                                            </h6>
                                        </div>
                                    </Col>
                                </Row>
                            </Paper>
                        </Col>

                    )}
                    {
                        !loading && userInfo.canEdit && valueBox === 0 && (

                            <Col className={styles.col} lg={7} sm={7} xs={12}>
                                <div className={styles.formContainer}>
                                    <Paper square className={classes.root} elevation={3}>
                                        <Tabs
                                            value={valueBox}
                                            onChange={handleChange}
                                            variant="fullWidth"
                                            indicatorColor="primary"
                                            textColor="primary"
                                            aria-label="icon tabs example"
                                        >
                                            <Tab icon={<EditRoundedIcon />} aria-label="phone" label="Edit Profile" onClick={handleProfileEditClick} />
                                            <Tab icon={<FavoriteBorderRoundedIcon />} aria-label="favorite" label="My Favorite Spaces" onClick={handleFavSpaceClick} >
                                            </Tab>
                                        </Tabs>
                                        <div className={styles.paperContainer} >
                                            <form onSubmit={handleSubmit(onSubmitEdit)}>
                                                <div className={styles.textContainer}>
                                                    <TextField
                                                        id="outlined-full-width"
                                                        name="username"
                                                        label="Username"
                                                        inputRef={register({
                                                            required: "username cannot be empty",
                                                            maxLength: {
                                                                value: 20,
                                                                message: "username input exceed 8 index",
                                                            },
                                                        })}
                                                        placeholder={nameTyping}
                                                        fullWidth
                                                        margin="normal"
                                                        value={nameTyping}
                                                        onChange={(e) => {
                                                            dispatch(
                                                                toUserInfo(
                                                                    null,
                                                                    null,
                                                                    proPic,
                                                                    e.target.value,
                                                                    desTyping,
                                                                    phone,
                                                                    roomRatingArr,
                                                                    customerRatingArr
                                                                )
                                                            );
                                                        }}
                                                        error={Boolean(errors?.username)}
                                                        helperText={
                                                            errors.username ? errors.username.message : ""
                                                        }
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AccountCircle />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                                <div className={styles.textContainer}>
                                                    <TextField
                                                        id="outlined-full-width"
                                                        name="description"
                                                        label="Description (Optional)"
                                                        placeholder={desTyping}
                                                        fullWidth
                                                        margin="normal"
                                                        value={desTyping}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onChange={(e) => {
                                                            dispatch(
                                                                toUserInfo(
                                                                    null,
                                                                    null,
                                                                    proPic,
                                                                    nameTyping,
                                                                    e.target.value,
                                                                    phone,
                                                                    roomRatingArr,
                                                                    customerRatingArr
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div className={styles.pwContainer}>
                                                    <span className={styles.pwLabel}>Password</span>
                                                    <NavLink to="/profile/edit">Change Password</NavLink>
                                                </div>
                                                <div className={styles.textContainer}>
                                                    <TextField
                                                        id="outlined-full-width"
                                                        name="phone_number"
                                                        label="Contact number"
                                                        // placeholder={phone === "undefined" ? "input your phone number" : phone}
                                                        fullWidth
                                                        margin="normal"
                                                        inputRef={register({
                                                            pattern: {
                                                                value: /^[0-9]*$/,
                                                                message: "Phone number has to be numbers",
                                                            },
                                                            minLength: {
                                                                value: 8,
                                                                message:
                                                                    "Phone number has to be an at least 8-digit input",
                                                            },
                                                        })}
                                                        value={phone as number}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onChange={(e: any) => {
                                                            dispatch(
                                                                toUserInfo(
                                                                    null,
                                                                    null,
                                                                    proPic,
                                                                    nameTyping,
                                                                    desTyping,
                                                                    e.target.value
                                                                    , roomRatingArr
                                                                    , customerRatingArr
                                                                )
                                                            );
                                                        }}
                                                        error={Boolean(errors?.phone_number)}
                                                        helperText={
                                                            errors.phone_number ? errors.phone_number.message : ""
                                                        }
                                                    />
                                                </div>
                                                <div className={styles.textContainer}>
                                                    <TextField
                                                        disabled
                                                        id="outlined-full-width"
                                                        label="Email Address"
                                                        fullWidth
                                                        margin="normal"
                                                        value={userInfo.email}
                                                    />
                                                </div>
                                                <div className={styles.textContainer}>
                                                    <TextField
                                                        disabled
                                                        id="outlined-full-width"
                                                        label="Joined Zpace on"
                                                        fullWidth
                                                        margin="normal"
                                                        value={userInfo.created_at?.slice(0, 10)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </div>
                                                <div className={styles.formButtonContainer}>
                                                    <MButton variant="contained" color="primary" type="submit">
                                                        Confirm
                                            </MButton>
                                                </div>
                                            </form>
                                        </div>
                                    </Paper>
                                </div>
                            </Col>
                        )}

                    {!loading && userInfo.canEdit && valueBox === 1 && (
                        <Col className={styles.col} lg={7} sm={7} xs={12}>
                            <div className={styles.formContainer}>
                                <Paper square className={classes.root} elevation={3}>
                                    <Tabs
                                        value={valueBox}
                                        onChange={handleChange}
                                        variant="fullWidth"
                                        indicatorColor="primary"
                                        textColor="primary"
                                        aria-label="icon tabs example"
                                    >
                                        <Tab icon={<EditRoundedIcon />} aria-label="phone" label="Edit Profile" onClick={handleProfileEditClick} />
                                        <Tab icon={<FavoriteBorderRoundedIcon />} aria-label="favorite" label="My Favorite Spaces" onClick={handleFavSpaceClick} />
                                    </Tabs>
                                    <Row>
                                        <Col>
                                            <div className={styles.headerContainer}>
                                                {
                                                    !roomLikeRecordArr.length && <><br /><div className={styles.nothing_record}>No favorite spaces in Zpace.</div><br /></>
                                                }
                                                {
                                                    roomLikeRecordArr.length > 0 &&
                                                    <div className={styles.favour_rooms}>
                                                        {roomLikeRecordArr.map((roomLikeRecord: any) => {

                                                            return (
                                                                <NavLink className={styles.box_href} to={`/room-detail/${roomLikeRecord.room_id}`}>
                                                                    <Paper className={styles.card_piece} elevation={3}>
                                                                        <div className={styles.sub_box}>
                                                                            <h4 className={styles.card_title_name}>{roomLikeRecord.space_name} </h4>
                                                                            <span className={styles.district_text}>At {roomLikeRecord.district}</span>
                                                                            <h5>Hosted by {roomLikeRecord.username}</h5>
                                                                            <span className={styles.price_number}>${roomLikeRecord.hourly_price.replace(/.0+$/, '')}</span>
                                                                            <span className={styles.price_number_unit}>/hr</span>
                                                                        </div>
                                                                        <div className={styles.img_box}>
                                                                            {roomLikeRecord.pictures.length > 0 && <img className={styles.img_room} src={REACT_APP_API_SERVER + "/" + `${roomLikeRecord.pictures[0]}`} alt="room-pic" />}
                                                                        </div>
                                                                    </Paper>
                                                                </NavLink>
                                                            )
                                                        })}
                                                    </div>
                                                }

                                            </div>
                                        </Col>
                                    </Row>
                                </Paper>
                            </div>
                        </Col>
                    )
                    }
                </Row>
            </Container>

            {!loading && !userInfo.canEdit && canRate && <div className={styles.comment_submit}>
                <Container>
                    <Row>
                        <div className="container" style={{ textAlign: "initial" }}>
                            <h4 className="rating-comment-titlebox">How would you rate {userInfo.username}'s stay at your place?</h4>
                        </div>
                    </Row>
                    <Row>
                        <div className="container">
                            <form onSubmit={(e: any) => onSubmitRating(e)} >
                                <div style={{ display: "flex" }}>
                                    {starsArr.map((_, index) => {
                                        return <div key={index} onClick={() => starRatingOnClick(index)} ><StarRender index={index} /></div>
                                    })}
                                </div>
                                <div className={styles.submit_div}>
                                    {submitRatingAlert && <Alert variant="filled" severity="warning" style={{ width: "320px", margin: "10px auto" }}>
                                        Please rate the customer
                                </Alert>}
                                    <TextField
                                        className="contact-host-textbox-one text_field_submit"
                                        required
                                        name="chat"
                                        variant="outlined"
                                        label="Leave a comment"
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
                                        type="submit"
                                        value="send"
                                        onSubmit={(e) => { e.preventDefault() }}
                                    >
                                        Rate
                                </Button>
                                    {/* </div> */}
                                </div>
                            </form>
                        </div>
                    </Row>
                </Container>
            </div>}

            {!loading && <Container className={styles.container}>
                <Row >
                    <div className={"container"}>
                        <h2 style={{ fontWeight: 600, margin: "20px" }}>Reviews from other hosts</h2>
                    </div>
                </Row>
                <div className={styles.comments_grid_container}>
                    {ratingAndCommentState.length > 0 ? ratingAndCommentState.map((e, index) => {
                        return <CommentGrid key={index} element={e} starsArray={starsArr} />
                    }) : <h5 style={{ color: "gray", margin: "" }}>No Review for this user at the moment </h5>}
                </div>
            </Container>
            }
        </div>
    );
};

export default Profile;
