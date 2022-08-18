import React from 'react';
import styles from "../css/RenderOneTime.module.css";
import OneTimeEditorStart from './OneTimeEditorStart';
import { TextField } from '@material-ui/core';
import OneTimeEditorEnd from './OneTimeEditorEnd';

export type oneTimeState = {
    halfOneDay1: string,
    halfOneDay2: string,
    oneOffStarthr: string,
    oneOffStartmin: string,
    oneOffEndhr: string,
    oneOffendmin: string,
    oneoffdate: string
}


const EditRenderOneTime = ({ timeslot, setTimeslot }: any) => {
    
    const d2 = (x: number) => {
        return x < 10 ? '0' + x : '' + x;
    }

    if(timeslot.start_time > timeslot.end_time){
        let switchTime = timeslot.start_time 
        timeslot.start_time = timeslot.end_time
        timeslot.end_time = switchTime
        setTimeslot(timeslot)
    }

    return (
        <div className={styles.renderWholeOneOffContainer}>
            <div >

                <span >Decide available time slot(on a particular day):</span>
                <br></br>
                {timeslot.date && <div >
                    <TextField
                        id="date"
                        onChange={e => {
                            let value = e.target.value
                            timeslot.date = value
                            setTimeslot(timeslot)
                        }}
                        name="date"
                        label="Date Available"
                        type="date"
                        defaultValue={`${new Date(timeslot.date).getFullYear()}-${d2(new Date(timeslot.date).getMonth() + 1)}-${d2(new Date(timeslot.date).getDate())}`}
                        inputProps={{min: `${new Date().getFullYear()}-${d2(new Date().getMonth() + 1)}-${d2(new Date().getDate())}`}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>}
                <br></br>

                <div >
                    <OneTimeEditorStart time={timeslot.start_time} title={"Start at"} setTime={(time: any) => {
                        timeslot.start_time = time
                        setTimeslot(timeslot)
                    }} />
                </div>

                <div >
                    <OneTimeEditorEnd time={timeslot.end_time} title={"End at"} setTime={(time: any) => {
                        timeslot.end_time = time
                        setTimeslot(timeslot)
                    }} />
                </div>
            </div>
        </div>
    );
}

export default EditRenderOneTime;