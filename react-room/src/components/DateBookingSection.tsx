import React from 'react';
import Calendar from './WeekTimeSlot'
import DayTimeSlot from './DayTimeSlot';

const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export type combinedTimeSlot = {
  from: string // hh:mm
  to: string // hh:mm
  weekDay?: number  // 0..7
  specificDate?: string
  bookedDate?: string
}


// Functional features

function expandWeeklyTimeSlots(ob: any[]):combinedTimeSlot[] {
  const weekArray = [];
  for (let i = 0; i < ob.length; i++) {
    for (const [key, value] of Object.entries(ob[i])) {
      if (value === true) {
        let weekDay = weekDays.indexOf(key);
        weekArray.push({
          weekDay,
          from: ob[i].start_time.slice(0, 5),
          to: ob[i].end_time.slice(0, 5),
        });
      }
    }
  }
  return weekArray;
}
function expandOneOffTimeSlots(ob: any[]):combinedTimeSlot[]  {
  const oneTimeArray = [];
  for (let i = 0; i < ob.length; i++) {
    oneTimeArray.push({
      specificDate: ob[i].date,
      from: ob[i].start_time.slice(0, 5),
      to: ob[i].end_time.slice(0, 5),
    });
  }
  return oneTimeArray;
}
function expandBookedTimeSlots(ob: any[]):combinedTimeSlot[]  {
 
  const bookedScheduleArr = [];
  for (let i = 0; i < ob.length; i++) {
    bookedScheduleArr.push({
      bookedDate: `${new Date(ob[i].date).getFullYear()}-${new Date(ob[i].date).getMonth() + 1}-${new Date(ob[i].date).getDate()}`,
      from: ob[i].start_time.slice(0, 5),
      to: ob[i].end_time.slice(0, 5),
    });
  }
  return bookedScheduleArr;
}
const DateBookingSection = ({
  oneTimeSchedule,
  roomInfo,
  weeklyTimeSchedule,
  individualBookingTimeSlot,
  pickedDate,
  toSubmit,
  setToSubmit,
  pickDayFunction,
}: any) => {

  let weeklyAvailable: any = expandWeeklyTimeSlots(weeklyTimeSchedule);
  let oneTimeOffAvailable = expandOneOffTimeSlots(oneTimeSchedule);
  let bookedTimeSlot = expandBookedTimeSlots(individualBookingTimeSlot);
  let combinedTimeSlots = weeklyAvailable.concat(oneTimeOffAvailable);



  
 
  return (
    <div>
      {!pickedDate && <DayTimeSlot pickDayFunction={pickDayFunction}  toSubmit={toSubmit} setToSubmit={setToSubmit} bookedTimeSlot={bookedTimeSlot}
      combinedTimeSlots={combinedTimeSlots} roomInfo={roomInfo} weekDays={weekDays} month={month} pickedDate={pickedDate}/>}
      {pickedDate && <Calendar pickDayFunction={pickDayFunction}  toSubmit={toSubmit} setToSubmit={setToSubmit} bookedTimeSlot={bookedTimeSlot}
      combinedTimeSlots={combinedTimeSlots} roomInfo={roomInfo} weekDays={weekDays} month={month} />}
      </div>)
}

export default DateBookingSection;
