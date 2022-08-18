import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/RoomOwnerCreateRoom.module.css"
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useDispatch, useSelector } from "react-redux";
import RenderPreview from "../components/RenderPreview"
import { push } from "connected-react-router";
import { IRootState } from '../redux/store';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import RenderWeeklyTime from '../components/RenderWeeklyTime';
import RenderOneTime from '../components/RenderOneTime';
import MButton from "@material-ui/core/Button";
import { Container, IconButton } from '@material-ui/core';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { weeklyTimeState } from '../components/RenderWeeklyTime';
import { oneTimeState } from '../components/RenderOneTime';
import "../css/CreateRoomLabel.css";
// add is processing part 

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
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

function getSteps() {
  return ['Basic Information of Your Space', 'Photos and Rental Services Availability'];
}

// input type time: pick time

const CreateRoom = () => {
  const room_owner_id = useSelector((state: IRootState) => state.auth.payload.id)
  const bearer = "Bearer " + localStorage.token;
  const { REACT_APP_API_SERVER } = process.env;
  const [district, setDistrict] = useState('');
  const [space_name, setSpaceName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [checkedWifi, setCheckedWifi] = useState(false);
  const [checkedAc, setCheckedAc] = useState(false);
  const [checkedDesk, setCheckedDesk] = useState(false);
  const [checkedSocket, setCheckedSocket] = useState(false);
  const [hourly_price, setHourlyPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);
  const [missingFields, setMissingFields] = useState(false);
  const [maxWeekArray, setMaxWeekArray] = useState(false);
  const [maxOneOffArray, setOneOffWeekArray] = useState(false);
  const [address, setAddress] = React.useState("");
  const [weeklyTimeAvailability, setWeeklyTimeAvailability] = useState<weeklyTimeState[]>([])
  const [oneTimeAvailability, setOneTimeAvailability] = useState<oneTimeState[]>([])
  const classes = useStyles();
  const dispatch = useDispatch();
  const districtOptions = [
    { value: "Tung Chung", label: "Tung Chung" },
    { value: "Kwai Tsing", label: "Kwai Tsing" },
    { value: "North District", label: "North District" },
    { value: "Sai Kung District", label: "Sai Kung" },
    { value: "Sha Tin District", label: "Sha Tin" },
    { value: "Tai Po District", label: "Tai Po" },
    { value: "Tsuen Wan", label: "Tsuen Wan" },
    { value: "Tuen Mun", label: "Tuen Mun" },
    { value: "Yuen Long", label: "Yuen Long" },
    { value: "Kowloon City District", label: "Kowloon City" },
    { value: "Kwun Tong District", label: "Kwun Tong" },
    { value: "Distrikt Sham Shui Po", label: "Sham Shui Po" },
    { value: "Wong Tai Sin District", label: "Wong Tai Sin" },
    { value: "Yau Tsim Mong", label: "Yau Tsim Mong" },
    { value: "Central and Western", label: "Central and Western" },
    { value: "Eastern District", label: "Eastern" },
    { value: "Southern District", label: "Southern" },
    { value: "Wan Chai District", label: "Wan Chai" },
    { value: "Tsing Yi", label: "Tsing Yi" },
    { value: "Tin Shui Wai", label: "Tin Shui Wai" },
    { value: "Tseung Kwan O", label: "Tseung Kwan O" }
  ];

  const handleChangeAc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedAc(event.target.checked);
  };

  const handleChangeWifi = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedWifi(event.target.checked);
  };

  const handleChangeDesk = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedDesk(event.target.checked);
  };

  const handleChangeSocket = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedSocket(event.target.checked);
  };

  const onSelectFile = (e: any) => {
    // image preview: preview all files
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile([])
      return
    }
    setSelectedFile(() => e.target.files)

  }

  const addWeeklyTime = () => {
    if (weeklyTimeAvailability.length < 5) {
      setWeeklyTimeAvailability(
        weeklyTimeAvailability.concat(
          {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            weekStarthr: "",
            weekStartmin: "",
            weekEndhr: "",
            weekEndmin: "",
            weekHalfday1: "",
            weekHalfday2: ""
          }
        )
      )
    } else {
      setMaxWeekArray(true);
    }
  }

  React.useEffect(() => {
    addWeeklyTime();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addOneOffTime = () => {
    if (oneTimeAvailability.length < 5) {
      setOneTimeAvailability(
        oneTimeAvailability.concat({
          halfOneDay1: "",
          halfOneDay2: "",
          oneOffStarthr: "",
          oneOffStartmin: "",
          oneOffEndhr: "",
          oneOffendmin: "",
          oneoffdate: ""
        })
      )
    } else {
      setMaxWeekArray(true);
    }
  }

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();

  const isStepOptional = (step: number) => {
    return step !== 0 && step !== 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (space_name === "" || district === "" || capacity === "" || hourly_price === "") {
      setMissingFields(true)
    } else {

      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const reset = () => {
    handleReset();
    setHourlyPrice("");
    setSpaceName("");
    setDistrict("");
    setCapacity("");
    setAddress("")
    setDescription("");
    setCheckedWifi(false);
    setCheckedSocket(false);
    setCheckedDesk(false);
    setCheckedAc(false);
    setOneTimeAvailability([])
    setWeeklyTimeAvailability([])
    setSelectedFile([]);
    setMissingFields(false);
    setMaxWeekArray(false);
    setOneOffWeekArray(false);
  }

  const checkTimeWeek = (arr: any) => {
    if (arr.weekHalfday1 === "A.M." && arr.weekHalfday2 === "P.M.") {
      return true
    } else if (arr.weekHalfday1 === "P.M." && arr.weekHalfday2 === "A.M.") {
      return false
    } else if (Number(arr.weekStarthr) < Number(arr.weekEndhr)) {
      return true
    } else if (Number(arr.weekStarthr) === 12) {
      return true
    } else if (arr.weekStarthr === arr.weekEndhr && Number(arr.weekEndmin) > Number(arr.weekStartmin)) {
      return true
    }

    return false
  }


  const checkOneOffTime = (arr: any) => {
    if (arr.halfOneDay1 === "A.M." && arr.halfOneDay2 === "P.M.") {
      return true
    } else if (arr.halfOneDay1 === "P.M." && arr.halfOneDay2 === "A.M.") {
      return false
    } else if (Number(arr.oneOffStarthr) < Number(arr.oneOffEndhr)) {
      return true
    } else if (Number(arr.oneOffStarthr) === 12) {
      return true
    } else if (arr.oneOffStarthr === arr.oneOffEndhr && Number(arr.oneOffndmin) > Number(arr.oneOffStartmin)) {
      return true
    }
    return false
  }

  const onSubmit = async (event: any) => {
    event.preventDefault();
    // access values here
    // to server 
    let picturesArr = Array.from(selectedFile)
    if (!oneTimeAvailability.some((e: any) => Object.values(e).indexOf('') >= 0) && picturesArr.length !== 0 && !weeklyTimeAvailability.some((e: any) => Object.values(e).indexOf('') >= 0) && oneTimeAvailability.length > 0 || weeklyTimeAvailability.length > 0) {
      let CheckWhichLonger = weeklyTimeAvailability.length <= oneTimeAvailability.length
      let checkTimeIfCorrect = []
      for (let i = 0; i < (CheckWhichLonger ? oneTimeAvailability.length : weeklyTimeAvailability.length); i++) {
        checkTimeIfCorrect.push((CheckWhichLonger ? checkOneOffTime(oneTimeAvailability[i]) : checkTimeWeek(weeklyTimeAvailability[i])))
        if (i < (CheckWhichLonger ? weeklyTimeAvailability.length : oneTimeAvailability.length)) {
          checkTimeIfCorrect.push((CheckWhichLonger ? checkTimeWeek(weeklyTimeAvailability[i]) : checkOneOffTime(oneTimeAvailability[i])))
        }
      }
      if (!checkTimeIfCorrect.some((e) => {
        return e === false
      })) {
        const latAndLngJSON = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${district}+hong+kong&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const latAndLng = await latAndLngJSON.json()
        let lat
        let lng
        if (latAndLng.results[0]) {
          lat = latAndLng.results[0].geometry.location.lat || null
          lng = latAndLng.results[0].geometry.location.lng || null
        } else {
          lat = null
          lng = null
        }
        const formData = new FormData()
        formData.append("longitude", lng)
        formData.append("latitude", lat)
        formData.append("space_name", space_name)
        formData.append("address", address)
        formData.append("district", district)
        formData.append("capacity", capacity)
        formData.append("hourly_price", hourly_price)
        formData.append("air_condition", checkedAc.toString())
        formData.append("wifi", checkedWifi.toString())
        formData.append("desk", checkedDesk.toString())
        formData.append("socket_plug", checkedSocket.toString())
        formData.append("description", description)
        formData.append("weekly_time_slot", JSON.stringify(weeklyTimeAvailability))
        formData.append("oneoff_time_slot", JSON.stringify(oneTimeAvailability))


        for (let i = 0; i < picturesArr.length; i++) {
          formData.append("rooms_pictures", picturesArr[i])
        }
        if (space_name === undefined || district === undefined || capacity === undefined || hourly_price === undefined) {
          setMissingFields(true);
        }

        const submitResponse = await fetch(`${REACT_APP_API_SERVER}/room-owner/manage-room/create-room`, {
          method: "POST",
          headers: {
            Authorization: bearer,
          },
          body: formData
        })
        const fetchSubmitJson = await submitResponse.json();

        if (fetchSubmitJson.errors) {
          throw new Error("errors")
        } else if (fetchSubmitJson.success) {
          dispatch(push(`/room-owner/${room_owner_id}`))
        }
      } else {
        setMissingFields(true)
      }
    } else {
      setMissingFields(true)
    }
  };
  return (
    <div>
      <Container>
        <Stepper activeStep={activeStep}>
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
      </Container>

      <Container>
        <form className={classes.root} onSubmit={onSubmit}>
          <div className={styles.errorBox}>
            {missingFields && <Alert className={styles.error} severity="error">Error: Missing Necessary Fields
      <span>The following fields must be filled: <strong>Name/Short Description of Your Space, Address, District,
      Capacity Hourly Rental.</strong>  Also, You must input at least<strong> one weekly available timeslot correctly.</strong></span></Alert>
            }

            {maxWeekArray &&
              <Alert className={styles.error} severity="warning"><strong>You may only input 5 weekly timeslots at one time.</strong></Alert>
            }

            {maxOneOffArray &&
              <Alert className={styles.error} severity="warning"><strong>You may only input 5 particular timeslots at one time.</strong></Alert>
            }
          </div>
          <div className={styles.formTitle}><h3>Details about Your Space</h3></div>

          {activeStep === 0 && <div className={styles.inputInRow}>
            <TextField
              value={space_name}
              onChange={(e) => { setSpaceName(e.target.value) }}
              name="space_name"
              fullWidth={true}
              id="filled-full-width"
              label="Name of Space"
              margin="normal"
              required
              variant="outlined"
            />
          </div>}

          {activeStep === 0 && <div className={styles.inputInRow}>
            <TextField
              value={address}
              onChange={(e) => { setAddress(e.target.value) }}
              name="address"
              fullWidth={true}
              id="filled-full-width"
              label="Address"
              margin="normal"
              required
              variant="outlined"
            />
          </div>}

          {activeStep === 0 && <div className={styles.inputInRow}>
            <TextField
              id="select-district-id"
              select
              fullWidth={true}
              name="district"
              margin="normal"
              label="District"
              value={district}
              onChange={(e) => { setDistrict(e.target.value) }}
              required
              variant="outlined"
            >
              {districtOptions.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>}

          {activeStep === 0 && <div className={styles.inputInRow}>
            <TextField
              InputProps={{ inputProps: { min: 0 } }}
              name="capacity"
              id="capacity"
              fullWidth={true}
              margin="normal"
              label="Capacity(no. of visitors)"
              type="number"
              value={capacity}
              onChange={(e) => { setCapacity(e.target.value) }}
              required
              variant="outlined"
            />
          </div>}

          {activeStep === 0 && <div className={styles.inputInRow}>
            <TextField
              name="hourly_price"
              id="hourly_price"
              fullWidth={true}
              margin="normal"
              label="Input Hourly Rental ($/hour)"
              type="number"
              value={hourly_price}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0 }
              }}
              onChange={(e) => { setHourlyPrice(e.target.value) }}
              required
              variant="outlined"
            />
          </div>}

          {activeStep === 0 && <div className={styles.inputInRow}>
            <TextField
              fullWidth={true}
              name="description"
              margin="normal"
              label="Additional Descriptions of Your Space"
              id="description"
              type="text"
              value={description}
              onChange={(e) => { setDescription(e.target.value) }}
              variant="outlined"
            />
          </div>}

          {activeStep === 0 && <div className={styles.checkBoxContainer}>
            <label className={styles.formLabels}>Facilities Available:</label>
            <Checkbox
              className={styles.formLabels}
              name="air_condition"
              checked={checkedAc}
              color="primary"
              onChange={handleChangeAc}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <div className={styles.facilityLabels}><label>air-conditioner</label></div>

            <Checkbox
              className={styles.formLabels}
              name="wifi"
              checked={checkedWifi}
              color="primary"
              onChange={handleChangeWifi}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <div className={styles.facilityLabels}><label>wifi</label></div>

            <Checkbox
              className={styles.formLabels}
              name="desk"
              checked={checkedDesk}
              color="primary"
              onChange={handleChangeDesk}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <div className={styles.facilityLabels}><label>desk</label></div>

            <Checkbox
              className={styles.formLabels}
              name="socket_plug"
              checked={checkedSocket}
              color="primary"
              onChange={handleChangeSocket}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <div className={styles.facilityLabels}><label>socket plug</label></div>

          </div>}


          {activeStep === 1 && <div className={styles.inputInRow}>
            <label id="my-file-label" htmlFor="myFile">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera className={styles.photoIconUploadButton} />
              </IconButton>
              <MButton variant="contained" color="primary" component="span" id="myFileLabel">
                Upload Photos of Your Space
          </MButton>
            </label>
            <input type="file" name="rooms_pictures" multiple onChange={onSelectFile} id="myFile"></input>
          </div>}

          {activeStep === 1 && <div className={styles.RenderPreviewPicContainer}>
            {selectedFile.length > 0 && Array.from(selectedFile).map((e: any, inx: number) => {
              return <RenderPreview render={e} key={inx}
              />
            })}
          </div>}

          {activeStep === 1 && <div className={styles.inputInRow}>
            <MButton variant="contained" color="primary" id="add-weekly-button" aria-label="add" onClick={addWeeklyTime}>
              <AddIcon />
          Click to add weekly rent service time slot (e.g. Monday to Friday, 3p.m. to 5p.m.)
        </MButton>
          </div>}

          {weeklyTimeAvailability.length > 0 && activeStep === 1 && weeklyTimeAvailability.map((state, index: number) => {
            return <div key={index}><RenderWeeklyTime
              weeklyTimeAvailability={state}
              setWeeklyTimeAvailability={(state) => {
                let newWeeklyTimeAvailability = weeklyTimeAvailability.slice()
                newWeeklyTimeAvailability[index] = state
                setWeeklyTimeAvailability(newWeeklyTimeAvailability)
              }} /></div>
          })}


          <br></br>


          {activeStep === 1 && <div className={styles.inputInRow}>
            <MButton variant="contained" color="primary" id="special-date" aria-label="add" onClick={addOneOffTime}>
              <AddIcon />
          Click to add one-off service time slot (e.g. 24/11/2020, 3p.m. to 5p.m.)
        </MButton>
          </div>}

          {oneTimeAvailability.length > 0 && activeStep === 1 && oneTimeAvailability.map((state, index: number) => {
            return <div key={index}><RenderOneTime oneTimeAvailability={state} setOneTimeAvailability={(state) => {
              let newOneTimeAvailability = oneTimeAvailability.slice()
              newOneTimeAvailability[index] = state
              setOneTimeAvailability(newOneTimeAvailability)
            }} /></div>
          })}

          <div className={styles.roomButtonContainer}>
            <MButton className={classes.button} variant="contained" color="primary"
              onClick={() => {
                reset();
              }}>Reset Whole form</MButton>
            <Button
              variant="contained"
              color="primary"
              hidden={activeStep === 0}
              onClick={handleBack}
              className={classes.button}>
              Back
              </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
              hidden={activeStep === 1}
            >
              Next
                </Button>
            <MButton
              hidden={activeStep === 0}
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
              value="Submit">
              Submit
                </MButton>
          </div>
        </form>
      </Container>
    </div>
  )
}

export default CreateRoom;