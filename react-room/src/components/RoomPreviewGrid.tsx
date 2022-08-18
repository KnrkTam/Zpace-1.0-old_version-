import React, {useState, useEffect} from 'react'
import "../css/RoomPreviewGrid.css";
import { NavLink } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import SupervisorAccountRoundedIcon from '@material-ui/icons/SupervisorAccountRounded';
import PinDropIcon from '@material-ui/icons/PinDrop';
const RoomPreviewGrid = ({ starsArr ,element, showChosenGrid}:any)=>{
    const [photoSequence, setPhotoSequence] = useState(0)
    const [ifUserIsHost,seIfUserIsHost] = useState(false)
    const [isLiked, setIsLiked]= useState(false)
    const [ratingAvg, setRatingAvg] = useState<any>([])
    const {REACT_APP_API_SERVER } = process.env
    const slidePhotoRight = () =>{
        if(element.room_pictures.length - 1 > photoSequence){
            setPhotoSequence((e:number)=> e + 1)
        }else{
            setPhotoSequence((e:number)=> e = 0)
        }
    }
    const slidePhotoLeft = () =>{
        if(0 < photoSequence){
            setPhotoSequence((e:number)=> e - 1)
        }else{
            setPhotoSequence((e:number)=> e = element.room_pictures.length - 1)
        }
    }
    const onClickLike = async () =>{
        if(isLiked){
            let likesJSON = await fetch(`${process.env.REACT_APP_API_SERVER}/view-room/unlike/${element.rooms_id}`,{
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.token,
                },
            })
            if(likesJSON.status === 200){
                setIsLiked(false)
            }
        }else{
            let likesJSON = await fetch(`${process.env.REACT_APP_API_SERVER}/view-room/like/${element.rooms_id}`,{
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.token,
                },
            })
            if(likesJSON.status === 200){
                setIsLiked(true)
            }
        }

    }
    useEffect(()=>{
        if(localStorage.payload){
            let userInfo = JSON.parse(localStorage.payload)
            let userID = userInfo.id
            if(userID === element.room_owner_id){
                seIfUserIsHost(true)
            }
            const fetchLike = async () =>{
                let likesJSON = await fetch(`${process.env.REACT_APP_API_SERVER}/view-room/one/like/${element.rooms_id}`,{
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + localStorage.token,
                    },
                })
                if(likesJSON.status === 200){
                    let {likes, rating} = await likesJSON.json()
                    if(likes.length > 0){
                        setIsLiked(true)
                    }
                    setRatingAvg(rating)
                }
            }
            fetchLike()
        } else {
            const fetchRate = async () =>{
                let likesJSON = await fetch(`${process.env.REACT_APP_API_SERVER}/view-room/non-logged/like/${element.rooms_id}`,{
                    method: "GET"
                })
                if(likesJSON.status === 200){
                    let {rating} = await likesJSON.json()
                    setRatingAvg(rating)
                }
            }
            fetchRate()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const RenderAvgRating = ({index}:any) =>{
        let sumRating = 0
        for (let i = 0; i < ratingAvg.length; i++) {
            sumRating = sumRating + ratingAvg[i].rating
        }
        let avgSum = Math.round(sumRating / ratingAvg.length)


        let num = 1
        if (avgSum >= index) {
            num = 0
        }
        return (
            <>
            {num === 1 ? <StarBorderRoundedIcon
						style={{ marginRight: "2%",color: "#ff385d" }}
					/> :<StarRoundedIcon
                    style={{ marginRight: "2%", color: "#ff385d" }}
                />}
            </>
        )
    }
    return (
        <div className="room-grid">
            <div className="preview-pic">{element.room_pictures.length > 1 && <i onClick={slidePhotoLeft} className="fas fa-chevron-circle-left arrow-left"></i>}<img src={element.room_pictures[photoSequence].picture_filename.slice(0, 5) !== "https" ?  REACT_APP_API_SERVER + "/" + element.room_pictures[photoSequence].picture_filename : element.room_pictures[photoSequence].picture_filename} alt="preview-room-pic" />{element.room_pictures.length > 1 &&  <i onClick={slidePhotoRight} className="fas fa-chevron-circle-right"></i>}</div>
            <div className="previewInfo"> 
            <div className="name_star_holder container">
            <NavLink to={`/room-detail/${element.rooms_id}`} className="link button previewBtn">{element.space_name}</NavLink>
            <div className="star_holder">
            {starsArr.map((_:any, index:number)=>{
                return <RenderAvgRating key={index} index={index}/>
            })}
            </div>
            </div>
            <div className="container" style={{display: "flex", flexWrap: "wrap"}}>
                <div style={{display: "flex", justifyContent:"space-between", width:"100%"}}>
                    <div style={{textDecoration:"underline"}}> <PinDropIcon color="primary" onClick={()=>showChosenGrid(element)} className="location-point"/>{element.district}</div>
                    <div style={{textAlign: "right", display: "flex", alignItems: "flex-end"}}><span className="hourly-price-number" >${element.hourly_price.replace(/.0+$|0+$/, '')}</span> <span color="gray">/hour</span></div>
                </div>
                <div style={{display: "flex", justifyContent:"space-between", width:"100%"}}>
                    <div><SupervisorAccountRoundedIcon color="primary"/>Capacity: {element.capacity}</div>
                    <div>
                        {!ifUserIsHost && localStorage.token && (isLiked? <><FavoriteIcon onClick={onClickLike} style={{ color: "red", cursor: "pointer" }} />
                        <span>Liked</span></>
                        : <><FavoriteBorderIcon style={{cursor: "pointer"}} onClick={onClickLike} /><span>Like</span></>)}
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default RoomPreviewGrid
