import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import socketClient from "socket.io-client"
import Messages from './Messages';
import ChatInput from './ChatInput';
import styles from "../css/ChatRoom.module.css"
import { useParams, NavLink } from 'react-router-dom';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
const SERVER: any = process.env.REACT_APP_API_SERVER

const Page = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
    align-items: center;
    // background-color: #b5ccfa;
    flex-direction: column;

    @media only screen and (max-width: 768px) {
        height:auto;
        width: 100%;

    }
`;
function ChatRoom() {
    const dispatch = useDispatch()
    let params = useParams();
    const idMessage = (params as any).id;
    const userInfo = JSON.parse(localStorage.payload)
    const user_id = userInfo.id
    const bearer: string = "Bearer " + localStorage.token;
    const { REACT_APP_API_SERVER } = process.env;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [chatDate, setChatData] = useState<any>({})
    const [hostName, setHostName] = useState<any>("");
    const [hostImg, setHostImg] = useState<any>("");
    const [customerName, setCustomerName] = useState<any>("");
    const [customerImg, setCustomerImg] = useState<any>("");
    let connectionOptions: any = {
        "transports": ["websocket", 'polling', 'flashsocket']
    };

    let socket = socketClient(SERVER, connectionOptions);
    const fetchChatDataJSON = async () => {
        const chatContentJSON = await fetch(`${REACT_APP_API_SERVER}/chat/chat-content`, {
            method: "POST",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chat_id: idMessage })
        })
        if (chatContentJSON.status === 200) {
            let chatContent = await chatContentJSON.json()
            setChatData(chatContent.chatTable)
            if (chatContent.HostPreview[0].profile_picture.slice(0, 5) === "https") {
                setHostImg(chatContent.HostPreview[0].profile_picture)
            } else {
                setHostImg(REACT_APP_API_SERVER + "/" + chatContent.HostPreview[0].profile_picture)
            }
            if (chatContent.customerPreview[0].profile_picture.slice(0, 5) === "https") {
                setCustomerImg(chatContent.customerPreview[0].profile_picture)
            } else {
                setCustomerImg(REACT_APP_API_SERVER + "/" + chatContent.customerPreview[0].profile_picture)
            }
            setHostName(chatContent.HostPreview[0].username)
            setCustomerName(chatContent.customerPreview[0].username)
            setMessages(chatContent.chatContent)
            socket.emit('join', { chatData: chatContent.chatTable }, (error: any) => {
                if (error) {
                    alert(error);
                }
            });

        } else {
            dispatch(push("/"))
        }
    }
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SERVER])

    useEffect(() => {
        fetchChatDataJSON()


        socket.on('message', () => {
        });

        socket.on("roomData", () => {
        });
        return () => {
            socket.emit("disconnection")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idMessage])

    const sendMessage = (event: any) => {
        event.preventDefault();
        if (message) {
            let messageLog = {
                content: message,
                sender_id: user_id,
                chat_table_id: chatDate.id,
                is_request: false,
                is_read: false
            }
            const uploadChat = async () => {
                await fetch(`${REACT_APP_API_SERVER}/chat/chat-update`, {
                    method: "POST",
                    headers: {
                        Authorization: bearer,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ messageLog })
                })
            }
            if (chatDate.customer_id === user_id || chatDate.host_id === user_id) {
                uploadChat()
                socket.emit('sendMessage', { chatDate, messageLog }, () => setMessage(''));
            }
            setMessage((e) => e = '')
        }
    }
    const messageIsRead = async (msg: any) => {
        await fetch(`${REACT_APP_API_SERVER}/chat/chat-read`, {
            method: "POST",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatDate, msg })
        })
    }
    socket.on("message", (msg: any) => {
        setMessages((e: any) => [...e, msg])
        messageIsRead(msg)
    })

    return (
        <div className={styles.chat_room_outer_container}>
            <Page>
                {chatDate.customer_id !== undefined && <NavLink className={styles.link} to={`/profile/${chatDate.customer_id === user_id ?
                    chatDate.host_id : chatDate.customer_id}`}><div className={styles.profile} >
                        <div className={styles.profile_img}>
                            <img src={chatDate.customer_id === user_id ? hostImg : customerImg} alt="profile-pic" />
                        </div>
                        <div className={styles.profile_name}>{chatDate.customer_id === user_id ? hostName : customerName}</div></div></NavLink>}
                <Messages messages={messages} userId={user_id} />
                <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </Page>
        </div>

    )
}

export default ChatRoom
