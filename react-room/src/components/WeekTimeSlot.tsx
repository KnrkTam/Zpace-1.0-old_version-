import 'date-fns';
import React, { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { push } from 'connected-react-router';
import { toStoreTimeSlot } from '../redux/bookTimeSlot/actions';
import { combinedTimeSlot } from './DateBookingSection';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import CheckIcon from '@material-ui/icons/Check';
import {TimezoneDate} from 'timezone-date.ts'
import styles from "../css/Calender.module.css";


// Material UI classes
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slotBox: {
      display: "flex",
      height: "400px",
      overflow: "scroll",
    },
    scrollBox: {
      width: "100%",
      height: "400px",
      overflow: "scroll",
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
let SECOND = 1000;
let MINUTE = SECOND * 60;
let HOUR = MINUTE * 60;
let DAY = HOUR * 24;

const toLastSunday = (date: Date) => {
  date = new Date(date.getTime());
  while (date.getDay() !== 0) {
    date.setTime(date.getTime() - DAY);
  }

  return date;
}


const toNextWeekDay = (sunday: Date, weekDay: number) => {
  return new Date(sunday.getTime() + weekDay * DAY);
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


const WeekTimeSlot = ({ month, bookedTimeSlot, combinedTimeSlots, weekDays, roomInfo, toSubmit, setToSubmit }: any) => {
  let d = TimezoneDate.fromDate(new Date())
  d.timezone = +8
  const classes = useStyles();
  const dispatch = useDispatch()
  let initState: State = {
    combinedTimeSlots: combinedTimeSlots,
    chosen: [],
  };
  let [currentTime, setCurrentTime] = useState<any>(d);
  let [state, setState] = useState(initState);
  let sunday = toLastSunday(currentTime);

  // Material UI state
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(d),
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setCurrentTime(date);
    }

  };



  useEffect(() => {

    const slotRequsetSend = async () => {
      let timeSlotArray = state.chosen.map((e: any) => {
        return { ...e, date: `${e.date.getFullYear()}-${e.date.getMonth() + 1}-${e.date.getDate()}` }
      })

      dispatch(toStoreTimeSlot(timeSlotArray))
      dispatch(push(`/booking-confirmation/${roomInfo[0].id}`))
    }
    if (toSubmit && state.chosen.length !== 0) {
      slotRequsetSend()
    }
    return () => {
      setToSubmit(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toSubmit])


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

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            minDate={`${d.getFullYear()}-${d2(d.getMonth() + 1)}-${d2(d.getDate())}`}
            // format="#weekNumber"
            margin="normal"
            id="date-picker-inline"
            label="View week availability"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            autoOk={true}
          />
        </Grid>
      </MuiPickersUtilsProvider>


      {/* Calender header */}
        <div className={styles.timeSlotHeaderBox}>
          <div className={styles.timeSlotTimeHead}>
            <span className={styles.timeSlotHeaderTime}>Time</span>
          </div>
          <div className={styles.weekdaysHeader}>
          {new Array(7).fill(0).map((_, i) => {
            let day = toNextWeekDay(sunday, i)
            return <div className={styles.timeSlotHeader} key={`${Math.random()}_${i}`}>
              <div className={styles.eachTimeSlot}>{weekDays[i].slice(0, 3)}</div>
              <div className={styles.eachTimeSlot}>({day.getDate()}/{months[day.getMonth()]})</div>
            </div>
          })}
          </div>
        </div>
        {/* Calender Scroll body */}
        <div className={classes.scrollBox}>
          {new Array(48).fill(0).map((_, indx) => {
            let h = Math.floor(indx / 2);
            let m = (indx % 2) * 30;
            let time = d2(h) + ':' + d2(m);
            return (
              <div className={styles.timeSlotBox}>
                <div className={styles.timeSlot} key={`${Math.random()}_${indx}`}>{time}</div>
                <div className={styles.timeSlotBox}>
                  {new Array(7).fill(0).map((_, i) => {
                    let date = toNextWeekDay(sunday, i);
                    let available = state.combinedTimeSlots.some((dayTimeSlot) => {
                      let startTime = timeSlotArr.indexOf(dayTimeSlot.from)
                      let endTime = timeSlotArr.indexOf(dayTimeSlot.to) - 1

                      if (dayTimeSlot.specificDate) {
                        return startTime <= indx && indx <= endTime && `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` === `${new Date(dayTimeSlot.specificDate).getFullYear()}-${new Date(dayTimeSlot.specificDate).getMonth() + 1}-${new Date(dayTimeSlot.specificDate).getDate()}`
                      }
                      return startTime <= indx && indx <= endTime && date.getDay() === dayTimeSlot.weekDay
                    })
                    let availableBlock
                    let bookedTime = bookedTimeSlot.some((bookedTimeSlots: any) => {
                      let startTime = timeSlotArr.indexOf(bookedTimeSlots.from)
                      let endTime = timeSlotArr.indexOf(bookedTimeSlots.to)
                      return startTime <= indx && indx <= endTime && `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` === bookedTimeSlots.bookedDate
                    })
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
                      <div style={availableBlock} key={`${Math.random()}_${i}`} className={styles.timeSlot} onClick={() => clickCell(date, h, m, available, bookedTime)}>
                        {getCellState(date, h, m)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}

export default WeekTimeSlot;
