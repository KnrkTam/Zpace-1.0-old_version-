
import 'date-fns';
import React, { useState, useEffect } from 'react';
import styles from "../css/DayTimeSlot.module.css"
import { toStoreTimeSlot } from '../redux/bookTimeSlot/actions';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ISettingState } from '../redux/location/states';
import { combinedTimeSlot } from './DateBookingSection';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import CheckIcon from '@material-ui/icons/Check';
import { TimezoneDate } from 'timezone-date.ts'

// Material UI classes
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slotBox: {
      display: "flex",
      height: "400px",
      overflow: "scroll",
      overflowX: "hidden",
    },
    scrollBox: {
      width: "100%",
      height: "400px",
      overflow: "scroll",
      overflowX: "hidden",
      border: 'solid 7px #d9d9d9',
      borderRadius: "3%",
    },
    checkBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#80e050",
      fontSize: "50%",
      fontWeight: 900,
      width: "100%",
      height: "100%",
      color: "white",
    },
  }))

const d2 = (x: number) => {
  return x < 10 ? '0' + x : '' + x;
}
const time_slotFun = () => {
  const time_slot: any = []
  for (let i = 0; i < 24; i++) {
    let hour
    if (i < 10) {
      hour = `0${i}`
    } else {
      hour = `${i}`
    }

    for (let k = 0; k < 2; k++) {
      let minute
      if (k === 0) {
        minute = `00`
        time_slot.push(`${hour}:${minute}`)
      } else {
        minute = `30`
        time_slot.push(`${hour}:${minute}`)
      }
    }
  }
  return time_slot
}
let timeSlotArr = time_slotFun()

const months: number[] = []
for (let i = 1; i <= 12; i++) {
  months.push(i)
}


type ChosenTime = {
  date: Date;
  hour: number;
  minute: number;
};

type State = {
  combinedTimeSlots: combinedTimeSlot[];
  chosen: ChosenTime[];
};


const DayTimeSlot = ({ combinedTimeSlots, bookedTimeSlot, month, roomInfo, weekDays, toSubmit, setToSubmit, pickDayFunction }: any) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  let initState: State = {
    combinedTimeSlots: [],
    chosen: [],
  };
  let d = TimezoneDate.fromDate(new Date())
  d.timezone = +8
  const setting: any = useSelector<ISettingState>((state: ISettingState) => { return state.setting })
  let [currentTime, setCurrentTime] = useState(setting.setting.date);
  let [state, setState] = useState(initState);

  // Material UI state
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(setting.setting.date),
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setCurrentTime(`${date?.getFullYear()}-${date ? date.getMonth() + 1 : 1}-${date?.getDate()}`);
  };



  useEffect(() => {

    setState((e: any) => { return { ...e, combinedTimeSlots: combinedTimeSlots } })
  }, [currentTime, combinedTimeSlots])

  function getCellState(date: Date, hour: number, minute: number) {
    if (
      state.chosen.some((chosen) => {
        return (
          chosen.date.toDateString() === date.toDateString() &&
          chosen.hour === hour &&
          chosen.minute === minute
        );
      })
    ) {
      return <div className={classes.checkBox}><CheckIcon /></div>;
    }
    return ' ';
  }
  function clickCell(date: Date, hour: number, minute: number, available: boolean, bookedTime: boolean) {
    if (available && !bookedTime) {
      let chosenSlot = { date, hour, minute }
      if (state.chosen.some((e) => {
        return JSON.stringify(e) === JSON.stringify(chosenSlot)
      })) {
        let filteredSlot = state.chosen.filter((e) => {
          return JSON.stringify(e) !== JSON.stringify(chosenSlot)
        })
        setState({
          ...state,
          chosen: filteredSlot
        })
      } else {
        setState({
          ...state,
          chosen: [
            ...state.chosen,
            {
              date,
              hour,
              minute,
            },
          ],
        });
      }
    }

  }
  useEffect(() => {
    const slotRequsetSend = async () => {
      let timeSlotArray = state.chosen.map((e: any) => {
        return { ...e, date: `${e.date.getFullYear()}-${e.date.getMonth() + 1}-${e.date.getDate()}` }
      })
      dispatch(toStoreTimeSlot(timeSlotArray))
      dispatch(push(`/booking-confirmation/${roomInfo[0].id}`))
    }
    // eslint-disable-next-line eqeqeq
    if (toSubmit && state.chosen.length == 0) {
      pickDayFunction("Please pick an available timeslot below")
    } else if (toSubmit && state.chosen.length !== 0) {
      pickDayFunction("")
      slotRequsetSend()
    }


    return () => {
      setToSubmit(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toSubmit])

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Select a date"
            value={selectedDate}
            onChange={handleDateChange}
            minDate={`${d.getFullYear()}-${d2(d.getMonth() + 1)}-${d2(d.getDate())}`}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            autoOk={true}
          />
        </Grid>
      </MuiPickersUtilsProvider>

      <div>
        <div>
          {/* Calender header */}
          <div className={styles.dayTimeSlotHeaderBox}>
            <div className={styles.dayTimeSlotHeader}>
              Time
            </div>
            <div className={styles.dayTimeSlotHeader}>
              <div>{weekDays[new Date(currentTime).getDay()]}</div>
              <div>({new Date(currentTime).getDate()}/{months[new Date(currentTime).getMonth()]})</div>
            </div>
          </div>
          {/* Calender content body */}
          <div className={classes.scrollBox}>
            {new Array(48).fill(0).map((_, indx) => {
              let h = Math.floor(indx / 2);
              let m = (indx % 2) * 30;
              let time = d2(h) + ':' + d2(m);
              return (
                <div className={styles.dayTimeSlotBox} key={indx}>
                  <div className={styles.dayTimeSlot} key={`${Math.random()}_${indx}`}>{time}</div>
                  <div className={styles.dayTimeSlotBox}>
                    {new Array(1).fill(0).map((_, i) => {
                      let available = state.combinedTimeSlots.some((dayTimeSlot) => {
                        let startTime = timeSlotArr.indexOf(dayTimeSlot.from)
                        let endTime = timeSlotArr.indexOf(dayTimeSlot.to) - 1

                        if (dayTimeSlot.specificDate) {
                          return startTime <= indx && indx <= endTime && `${new Date(currentTime).getFullYear()}-${new Date(currentTime).getMonth() + 1}-${new Date(currentTime).getDate()}` === `${new Date(dayTimeSlot.specificDate).getFullYear()}-${new Date(dayTimeSlot.specificDate).getMonth() + 1}-${new Date(dayTimeSlot.specificDate).getDate()}`
                        }
                        return startTime <= indx && indx <= endTime && new Date(currentTime).getDay() === dayTimeSlot.weekDay
                      })
                      let bookedTime = bookedTimeSlot.some((bookedTimeSlot: any) => {
                        let startTime = timeSlotArr.indexOf(bookedTimeSlot.from)
                        let endTime = timeSlotArr.indexOf(bookedTimeSlot.to)
                        return startTime <= indx && indx <= endTime && `${new Date(currentTime).getFullYear()}-${new Date(currentTime).getMonth() + 1}-${new Date(currentTime).getDate()}` === bookedTimeSlot.bookedDate
                      })
                      let availableBlock
                      if (!available || bookedTime) {
                        availableBlock = {
                          backgroundColor: "grey"
                        }
                      } else {
                        availableBlock = {
                          backgroundColor: "white"
                        }
                      }
                      return (
                        <div style={availableBlock} key={`${Math.random()}_${i}`} className={styles.dayTimeSlot} onClick={() => clickCell(new Date(currentTime), h, m, available, bookedTime)}>
                          {getCellState(new Date(currentTime), h, m)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayTimeSlot;
