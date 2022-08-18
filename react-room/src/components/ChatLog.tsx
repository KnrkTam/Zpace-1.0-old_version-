import React, { useEffect, useState } from 'react'
import EachChatGrid from './EachChatGrid';
import RequestSlot from './RequestSlot';
import { Button, MenuList, MenuItem } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import SmsRoundedIcon from '@material-ui/icons/SmsRounded';
import styles from "../css/ChatLog.module.css"
const ChatLog = () => {
    const [roomRequest, setRoomRequest] = useState([])
    const [chatLog, setChatLog] = useState([])
    const [newsAlert, setNewsAlert] = useState(false)
    const bearer: string = 'Bearer ' + localStorage.token;
    const userInfo = JSON.parse(localStorage.payload)
    const user_id = userInfo.id
    const [open, setOpen] = useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const { REACT_APP_API_SERVER } = process.env
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
    useEffect(() => {
        let isMounted = true;
        const fetchChatLogData = async () => {
            const userInfo = JSON.parse(localStorage.payload)
            const userID = userInfo.id
            const chatLogDataJSON = await fetch(`${REACT_APP_API_SERVER}/chat`, {
                method: "GET",
                headers: {
                    Authorization: bearer,
                }
            })
            if (chatLogDataJSON.status === 200) {
                let { requestSLot, chatLog } = await chatLogDataJSON.json()
                chatLog = chatLog.filter((e: any) => { return e.customer_id !== userID || e.host_id !== userID })
                chatLog.sort((x: any, y: any) => {
                    return (x.is_read === y.is_read) ? 0 : x.is_read ? 1 : -1;
                });
                chatLog = chatLog.map((e: any) => {
                    if (e.sender_id === user_id) {
                        e.is_read = true
                    }
                    return e
                })
                let obj: any = {};

                for (let i = 0, len = chatLog.length; i < len; i++) {
                    obj[chatLog[i]['id']] = chatLog[i];
                }
                chatLog = [];


                for (let key in obj) {
                    chatLog.push(obj[key]);
                }


                let newsChat = chatLog.filter((e: any) => {
                    return e.is_read === false
                })
                chatLog = chatLog.filter((e: any) => {
                    return !newsChat.some((event: any) => {
                        return event.sender_id === e.sender_id
                    })
                })

                chatLog = newsChat.concat(chatLog)
                setNewsAlert(newsChat.length > 0 || requestSLot.length > 0)
                setChatLog(chatLog)
                setRoomRequest(requestSLot)
            } else {

            }
        }
        if (isMounted) {
            fetchChatLogData()
        }
        return () => { isMounted = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])
    return (
        <div className="chat-log-container">
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className="management-system-button link"
            >
                {newsAlert ? newsAlert && <><NotificationImportantIcon className="menu-bar-item-icon" style={{ color: "rgb(255, 56, 93)" }} /><span className="message_log">Message</span></> : <><SmsRoundedIcon className="navbar_icons_chat menu-bar-item-icon" /><span className="message_log">Message</span></>}
            </Button>
            <Popper className={`${styles.chat_log_paper}`} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ width: "250px", height: "auto", zIndex: -1 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >

                        <Paper style={{ width: "auto" }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown} >
                                    {roomRequest.length > 0 && <div>Room renting request</div>}
                                    {roomRequest.length > 0 && roomRequest.map((e: any) => <MenuItem onClick={handleClose}><RequestSlot element={e} /></MenuItem>)}
                                    {roomRequest.length > 0 && <Divider />}
                                    {chatLog.length <= 0 && <div style={{ color: "lightgray" }}> Message box is empty</div>}
                                    {chatLog.length > 0 && chatLog.map((e: any) => <MenuItem onClick={handleClose}><EachChatGrid element={e} /></MenuItem>)}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>

        </div>
    )
}

export default ChatLog
