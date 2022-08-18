import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/RoomOwnerMain.css";
import { useParams } from 'react-router-dom';
import Roomcard from './Roomcard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopHouse } from '@fortawesome/free-solid-svg-icons';

const LoadRoomInfo = () => {
    const bearer: string = 'Bearer ' + localStorage.token;
    const { REACT_APP_API_SERVER } = process.env;
    let params = useParams();
    const room_owner_id = (params as any).id
    const starsArr = ["star", "star", "star", "star", "star"]

    let [roomArrayInfo, setRoomArrayInfo] = useState([])

    React.useEffect(() => {
        loadAllRoomsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadAllRoomsInfo = async () => {
        let roomInfo = await fetch(`${REACT_APP_API_SERVER}/room-owner/${room_owner_id}`, {
            method: "GET",
            headers: {
                'Authorization': bearer,
            }
        })
        const roomInfoJson = await roomInfo.json()
        if (roomInfo.status === 200) {
            let info = (roomInfoJson["newRoomInfo"])
            setRoomArrayInfo(roomArrayInfo = info)
        }
    }

    return (
        <div>
            {roomArrayInfo.length > 0 && <div className="num-of-space-container">
                <span className="num-of-space">You currently have {roomArrayInfo.length} space in the management system.</span>
            </div>}
            <div className="room-card-container">
                {roomArrayInfo.length === 0 && <div>
                    <FontAwesomeIcon icon={faLaptopHouse} className="default-image" />
                    <br></br>
                    <br></br>
                    <span className="no-photos-at-moment">No space is recorded in the system currently.</span>
                </div>}
                {roomArrayInfo.length > 0 && roomArrayInfo.map((room: any, index: number) => {
                    return <Roomcard room={room} key={index} starsArr={starsArr}/>
                })}
            </div>
        </div>

    );
}
export default LoadRoomInfo;