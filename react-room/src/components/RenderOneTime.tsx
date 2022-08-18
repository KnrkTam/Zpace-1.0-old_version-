import { MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import styles from "../css/RenderOneTime.module.css";

export type oneTimeState = {
    halfOneDay1: string,
    halfOneDay2: string,
    oneOffStarthr: string,
    oneOffStartmin: string,
    oneOffEndhr: string,
    oneOffendmin: string,
    oneoffdate: string
}
const RenderOneTime = (props: {
    oneTimeAvailability: oneTimeState,
    setOneTimeAvailability: (state: oneTimeState) => void
}) => {


    const startHour = [
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

    const startMinute = [
        { value: "00", label: "00" },
        { value: "30", label: "30" },
    ];

    const halfdays = [
        { value: "A.M.", label: "A.M." },
        { value: "P.M.", label: "P.M." },
    ];

    const handleValue = (name: string) => {
        return {
            name: name,
            value: (props.oneTimeAvailability as any)[name],
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                let value = event.target.value
                props.setOneTimeAvailability({
                    ...props.oneTimeAvailability,
                    [name]: value
                });
            }
        }
    };

    const d2 = (x: number) => {
        return x < 10 ? '0' + x : '' + x;
    };

    return (
        <div className={styles.renderWholeOneOffContainer}>
            <div >

                <span >Decide available time slot(on a particular day):</span>
                <br></br>
                <div>
                    <TextField
                        id="date"
                        {...handleValue("oneoffdate")}
                        label="Date Available"
                        type="date"
                        inputProps={{min: `${new Date().getFullYear()}-${d2(new Date().getMonth() + 1)}-${d2(new Date().getDate())}`}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <br></br>

                <div >
                    <span >Start at:</span>
                </div>

                <TextField
                    id="select-weekstart-hr"
                    select
                    label="Select"
                    {...handleValue("oneOffStarthr")}
                    helperText="Select start time of each time slot (hour)"
                    variant="outlined"
                >
                    {startHour.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    id="select-weekstart-min"
                    select
                    label="Select"
                    {...handleValue("oneOffStartmin")}
                    helperText="Select start time of each time slot (minutes)"
                    variant="outlined"
                >
                    {startMinute.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    id="select-halfday-oneoff"
                    select
                    label="Select"  
                    {...handleValue("halfOneDay1")}
                    helperText="Select A.M./P.M."
                    variant="outlined"
                >
                    {halfdays.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <div >
                    <span >End at:</span>
                </div>

                <div >
                    <TextField
                        id="select-oneoff-endhr"
                        select 
                        label="Select"
                        {...handleValue("oneOffEndhr")}
                        helperText="Select end time of each time slot (hour)"
                        variant="outlined"
                    >
                        {startHour.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="select-oneoff-endmin"
                        select
                        label="Select"       
                        {...handleValue("oneOffendmin")}
                        helperText="Select end time of each time slot (minutes)"
                        variant="outlined"
                    >
                        {startMinute.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="select-weekend-id"
                        select
                        label="Select"
                        {...handleValue("halfOneDay2")}
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

export default RenderOneTime;