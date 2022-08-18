import { Checkbox, MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import styles from "../css/RenderWeeklyTime.module.css";

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

const RenderWeeklyTime = (props: {
    weeklyTimeAvailability: weeklyTimeState,
    setWeeklyTimeAvailability: (state: weeklyTimeState) => void,
}) => {
    
    let { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = props.weeklyTimeAvailability

    const handleChecked = (name: string) => {
        return {
            name: name,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                props.setWeeklyTimeAvailability({
                    ...props.weeklyTimeAvailability,
                    [name]: event.target.checked
                });
            }
        }

    };

    const handleValue = (name: string) => {
        return {
            name: name,
            value: (props.weeklyTimeAvailability as any)[name],
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                let value = event.target.value
                props.setWeeklyTimeAvailability({
                    ...props.weeklyTimeAvailability,
                    [name]: value
                });
            }
        }
    };

    const weeklyStartHour = [
        { value: "01", label: "01" },
        { value: "02", label: "02" },
        { value: "03", label: "03" },
        { value: "04", label: "04" },
        { value: "05", label: "05" },
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },

    ];

    const weeklyStartMinute = [
        { value: "00", label: "00" },
        { value: "30", label: "30" },
    ];

    const halfdays = [
        { value: "A.M.", label: "A.M." },
        { value: "P.M.", label: "P.M." },
    ];
    return (
        <div className={styles.renderWholeWeeklyContainer}>
            <div >
                <span >Decide available time slot(repeated weekly):</span>
                <br></br>
                <span >For this timeslot, the room is available on each: </span>
                <Checkbox
                    checked={monday}
                    color="primary"
                    {...handleChecked("monday")}
                />
                <label>Monday</label>


                <Checkbox
                    checked={tuesday}
                    color="primary"
                    {...handleChecked("tuesday")}
                />
                <label>Tuesday</label>


                <Checkbox
                    checked={wednesday}
                    color="primary"
                    {...handleChecked("wednesday")}
                />
                <label>Wednesday</label>


                <Checkbox
                    checked={thursday}
                    color="primary"
                    {...handleChecked("thursday")}
                />
                <label>Thursday</label>


                <Checkbox
                    
                    checked={friday}
                    color="primary"
                    {...handleChecked("friday")}
                />
                <label>Friday</label>


                <Checkbox
                    checked={saturday}
                    color="primary"
                    {...handleChecked("saturday")}
                />
                <label>Saturday</label>


                <Checkbox
                    checked={sunday}
                    color="primary"
                    {...handleChecked("sunday")}
                />
                <label>Sunday</label>

                <div >
                    <span >Start at:</span>
                </div>
                <div >
                    <TextField
                        id="select-weekstart-hr"
                        select
                        label="Select"
                        {...handleValue("weekStarthr")}
                        helperText="Select start time of each time slot (hour)"
                        variant="outlined"
                    >
                        {weeklyStartHour.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="select-weekstart-min"
                        select
                        label="Select"
                        {...handleValue("weekStartmin")}
                        helperText="Select start time of each time slot (minutes)"
                        variant="outlined"
                    >
                        {weeklyStartMinute.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="select-weekend-id"
                        select
                        label="Select"
                        {...handleValue("weekHalfday1")}
                        helperText="Select A.M./P.M."
                        variant="outlined"
                    >
                        {halfdays.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div >
                    <span >End at:</span>
                </div>

                <div >
                    <TextField
                        id="select-weekstart-id"
                        select
                        label="Select"
                        {...handleValue("weekEndhr")}
                        helperText="Select end time of each time slot (hour)"
                        variant="outlined"
                    >
                        {weeklyStartHour.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="select-weekend-id"
                        select
                        label="Select"
                        {...handleValue("weekEndmin")}
                        helperText="Select end time of each time slot (minutes)"
                        variant="outlined"
                    >
                        {weeklyStartMinute.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="select-weekend-id"
                        select
                        label="Select"
                        {...handleValue("weekHalfday2")}
                        helperText="Select A.M./P.M."
                        variant="outlined"
                    >
                        {halfdays.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
            </div>
        </div>
    );
}

export default RenderWeeklyTime;
