import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import styles from "../css/EachChatGrid.module.css"
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
const EachChatGrid = ({element}:any)=>{
    const bearer:string = 'Bearer ' + localStorage.token;
    const {REACT_APP_API_SERVER} = process.env
    const [username, setUsername] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    useEffect(()=>{
        const fetchRequestPreview = async ( ) =>{
            const chatPreviewJSON = await fetch(`${REACT_APP_API_SERVER}/chat/chat-preview`, {
                method: "POST",
                headers: {
                    Authorization: bearer,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({chat_id: element.id})
            })
            if(chatPreviewJSON.status === 200){
                let {chatPreview} = await chatPreviewJSON.json()
                if (chatPreview[0].profile_picture.slice(0, 5) === "https") {
                    setImageUrl(chatPreview[0].profile_picture)
                } else {
                    setImageUrl(REACT_APP_API_SERVER + "/" + chatPreview[0].profile_picture)
                }
                setUsername(chatPreview[0].username)
            }
        }
        fetchRequestPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <NavLink to={`/chat-room/${element.id}`} className={styles.link}><div>
            <div className={styles.flex_div}><div className={styles.img_div}><img src={imageUrl} alt="profile-pic" /></div><div className={`${styles.username}`}>{username}</div>{!element.is_read && <MessageOutlinedIcon className={`${styles.icon_message}`}  />}</div>
        </div></NavLink>
    )
}

export default EachChatGrid
