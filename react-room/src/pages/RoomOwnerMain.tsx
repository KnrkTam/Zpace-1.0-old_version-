import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/RoomOwnerMain.css";
import LoadRoomInfo from '../components/LoadRoomInfo';


const RoomOwnerMain = () => {


    return (
        <div>
            
                <div className="headers-container">
                    <h3 className="all-rooms-title">Room Management System</h3>

                </div>
                <LoadRoomInfo />
                <div className="add-room-button-container">
                    <NavLink className="btn add-room-button" to="/room-owner/manage-room/create-room">
                        Rent Out a Space
                </NavLink>
                </div>
            
        </div>

    );
}
export default RoomOwnerMain;