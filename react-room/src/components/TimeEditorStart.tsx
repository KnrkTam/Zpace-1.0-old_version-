import React from 'react'
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';

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

function TimeEditorStart(props: {
    title: string
    time: string
    setTime: (time: string) => void
}) {
    // hour: 00 .. 23
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [hour, minute, second] = props.time.split(':')
    let hourText = hour
    let M = 'A.M.'
    if (hour === '00') {
        hourText = '12'
        M = 'A.M.'
    } else if (hour === '12') {
        hourText = '12'
        M = 'P.M.'
    } else if (+hour > 12) {
        hourText = d2(+hour - 12)
        M = 'P.M.'
    }


    return <div className='time'>
        <div>
            {props.title}:
        </div>
        <div>
            <TextField
                select
                variant="outlined"
                error={false}
                helperText="Select start time of each time slot (hour)"
                value={hourText} onChange={e => {
                    let value = e.target.value
                    if (value === '12' && M === 'A.M.') {
                        hour = '00'
                    } else if (value === '12' && M === 'P.M.') {
                        hour = '12'
                    } else if (M === 'P.M.') {
                        hour = '' + (+value + 12)
                    } else {
                        hour = value
                    }
                    props.setTime(hour + ':' + minute)
                }}>
                {weeklyStartHour.map((option: any) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </TextField>
            <TextField
                select
                variant="outlined"
                error={false}
                helperText="Select start time of each time slot (minutes)"
                value={minute} onChange={e => {
                    let value = e.target.value
                    minute = value
                    props.setTime(hour + ':' + minute)
                }}>
                {weeklyStartMinute.map((option: any) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </TextField>
            <TextField
                select
                variant="outlined"
                helperText="Select A.M./P.M."
                value={M} onChange={e => {
                    let value = e.target.value
                    M = value
                    if (M === 'P.M.') {
                        hour = '' + ((+hour % 12) + 12)
                    } else if (M === 'A.M.') {
                        hour = '' + (+hour % 12)
                    }
                    props.setTime(hour + ':' + minute)
                }}>
                {halfdays.map((option: any) => {
                    return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                })}
            </TextField>
        </div>
    </div>
}


function d2(d: number) {
    if (d < 10) {
        return '0' + d
    }
    return '' + d
}


export default TimeEditorStart
