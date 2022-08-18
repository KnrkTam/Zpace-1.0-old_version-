import { Checkbox } from '@material-ui/core';
import React from 'react';
import styles from "../css/EditRenderWeekly.module.css"
import { WeekDays } from '../pages/EditRoom';
import TimeEditorStart from './TimeEditorStart';
import TimeEditorEnd from './TimeEditorEnd';

export type weeklyTimeState = {
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean,
    weekStarthr: string,
    weekStartmin: string,
    weekEndhr: string,
    weekEndmin: string,
    weekHalfday1: string,
    weekHalfday2: string
}




const EditRenderWeeklyTime = ({ timeslot, setTimeslot }: any) => {
    if(timeslot.start_time > timeslot.end_time){
        let switchTime = timeslot.start_time 
        timeslot.start_time = timeslot.end_time
        timeslot.end_time = switchTime
        setTimeslot(timeslot)
    }

    return (
        <div className={styles.renderWholeWeeklyContainer}>
            <div className={styles.timerPickerBox}>
                <span className={styles.formLabels}>Decide available time slot(repeated weekly):</span> 
                <br></br>
                <span className={styles.formLabels}>For this timeslot, the room is available on each: </span>

                <div className={styles.weekdayTimeCheckbox}>
                    {WeekDays.map((weekday: any, index: number) =>
                        <div key={index}>
                            <Checkbox color="primary" checked={timeslot[weekday]} onChange={e => {
                                let checked = (e.target as HTMLInputElement).checked
                                timeslot[weekday] = checked
                                setTimeslot(timeslot)
                            }} />
                            <label>{weekday.substring(0, 1).toUpperCase() + weekday.substring(1)}</label>
                        </div>
                    )}
                </div>
                <div className={styles.weekInputRow}>
                    <TimeEditorStart time={timeslot.start_time} title={'Start at'} setTime={(time: any) => {
                        timeslot.start_time = time
                        setTimeslot(timeslot)
                    }} />

                </div>
                <div className={styles.weekInputRow}>
                    <TimeEditorEnd time={timeslot.end_time} title={'End at'} setTime={time => {
                        timeslot.end_time = time
                        setTimeslot(timeslot)
                    }} />
                </div>
            </div>
        </div>
    );
}

export default EditRenderWeeklyTime;
