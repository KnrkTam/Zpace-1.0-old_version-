import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/store';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import HistoryIcon from '@material-ui/icons/History';
import BallotIcon from '@material-ui/icons/Ballot';
import "../css/ManageYourRooms.css";


const ManageYourRooms: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const room_owner_id = useSelector((state: IRootState) => state.auth.payload.id);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }
    return (
        <div className="management-container">
        <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className="management-system-button link"
            >
                <MenuBookIcon className="navbar_icons_manage menu-bar-item-icon"/><span className="manage_booking">Manage Booking</span>
        </Button>
            <Popper className="manage-your-room-paper" open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    <MenuItem onClick={handleClose}><NavLink className="menu-bar-item" to={`/room-owner/${room_owner_id}`}><BallotIcon className="menu-bar-item-icon" />View and Manage Your Space</NavLink></MenuItem>
                                    <MenuItem onClick={handleClose}><NavLink className="menu-bar-item" style={{width: "110%"}} to={`/room-owner/booking-history/${room_owner_id}`}><HistoryIcon className="menu-bar-item-icon"/> Booking Record</NavLink></MenuItem>
                                    <MenuItem onClick={handleClose}><NavLink className="menu-bar-item"  style={{width: "110%"}} to="/chart-log"><EqualizerIcon className="menu-bar-item-icon"/> Statistics</NavLink></MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

export default ManageYourRooms; 