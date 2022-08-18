import React, { useState } from 'react'
import styles from "../css/BookingRoomPreviewGrid.module.css"

function BookingRoomPreviewGrid({ element }: any) {
    const [photoSequence, setPhotoSequence] = useState(0)
    const { REACT_APP_API_SERVER } = process.env
    const slidePhotoRight = () => {
        if (element.room_pictures.length - 1 > photoSequence) {
            setPhotoSequence((e: number) => e + 1)
        } else {
            setPhotoSequence((e: number) => e = 0)
        }
    }
    const slidePhotoLeft = () => {
        if (0 < photoSequence) {
            setPhotoSequence((e: number) => e - 1)
        } else {
            setPhotoSequence((e: number) => e = element.room_pictures.length - 1)
        }
    }

    return (
        <div className={styles.room_grid}>
            <div className={styles.preview_pic}>{element.room_pictures[0] && <i onClick={slidePhotoLeft}
                className="fas fa-chevron-circle-left"></i>}
                <img src={element.room_pictures[photoSequence].slice(0, 5) !== "https" ? REACT_APP_API_SERVER + "/" + element.room_pictures[photoSequence] : element.room_pictures[photoSequence]} alt="preview-room-pic" />
                {element.room_pictures.length > 1 && <i onClick={slidePhotoRight} className="fas fa-chevron-circle-right"></i>}</div>
        </div>
    )
}

export default BookingRoomPreviewGrid
