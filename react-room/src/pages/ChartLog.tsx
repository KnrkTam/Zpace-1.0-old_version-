import React, {useEffect, useState} from 'react'
import SummaryChart from '../components/SummaryChart'
import styles from "../css/ChartLog.module.css"
const ChartLog = ()=>{
    const bearer: string = "Bearer " + localStorage.token;
    const { REACT_APP_API_SERVER } = process.env;
    let [roomInfo, setRoomInfo] = useState([])
useEffect(()=>{
    const fetchData = async () =>{
      let dataJSON = await fetch(`${REACT_APP_API_SERVER}/room-owner/chart-data`, {
            method: "GET",
            headers: {
                Authorization: bearer,
            }
        })
        if(dataJSON.status === 200){
            let data = await dataJSON.json()
            setRoomInfo(data.data)
        }
    }
    fetchData()
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])
    
    return (
        <div className={styles.chart_table}>
            <SummaryChart roomInfo={roomInfo}/>
        </div>
    )
}

export default ChartLog
