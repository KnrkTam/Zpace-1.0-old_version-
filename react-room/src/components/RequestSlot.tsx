import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import styles from "../css/RequestSlot.module.css"
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
const RequestSlot = ({ element }: any) => {
    const bearer: string = 'Bearer ' + localStorage.token;
    const { REACT_APP_API_SERVER } = process.env
    const [username, setUsername] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    useEffect(() => {
        const fetchRequestPreview = async () => {
            const chatPreviewJSON = await fetch(`${REACT_APP_API_SERVER}/chat/request-preview`, {
                method: "POST",
                headers: {
                    Authorization: bearer,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ customer_id: element.customer_id, rooms_id: element.rooms_id })
            })
            if (chatPreviewJSON.status === 200) {
                let chatPreview = await chatPreviewJSON.json()
                if (chatPreview.fetchPreview.customerPreview[0].profile_picture.slice(0, 5) === "https") {
                    setImageUrl(chatPreview.fetchPreview.customerPreview[0].profile_picture)
                } else {
                    setImageUrl(REACT_APP_API_SERVER + "/" + chatPreview.fetchPreview.customerPreview[0].profile_picture)
                }

                setUsername(chatPreview.fetchPreview.customerPreview[0].username)
            }
        }
        fetchRequestPreview()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <NavLink to={`/room-request/${element.id}`} className={styles.link}>
            <div className={styles.big_flex_div}>
                <div className={styles.flex_div}><div className={styles.img_div}><img src={imageUrl} alt="profile-pic" /></div><div className={`${styles.username}`}>{username}</div></div>
                <EmojiPeopleIcon className={styles.icons_waving} />
            </div></NavLink>
    )
}

export default RequestSlot
