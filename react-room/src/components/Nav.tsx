import React,{useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Nav.css';
import { IRootState } from '../redux/store';
import Logo from './Logo';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../redux/auth/thunks';
import BecomeHostBox from './BecomeHostBox';
import { toUserInfo, isHost } from '../redux/auth/actions';
import ManageYourRooms from './ManageYourRooms';
import ChatLog from './ChatLog';
import NotificationToRate from './NotificationToRate';
import { push } from 'connected-react-router';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const Nav = () => {
    const { REACT_APP_API_SERVER } = process.env;
    const isAuthenticated = useSelector((state: IRootState) => state.auth.isAuthenticated);
    const [imageUrl, setImageUrl] = useState("")
    const isHostRedux = useSelector((state: IRootState) => state.auth.is_rooms_owner);
    const [id, setId] = useState(null)
	const dispatch = useDispatch();
	const currentImageRedux = useSelector((state: IRootState)=>state.userInfo.payload.profile_picture)
    const userInfo: any = useSelector<any>((state: any) => {
        return state.userInfo.payload;
    });
    const clickLogout = () => {
        dispatch(logoutThunk());
    }
    useEffect(() => {
        if (!localStorage.payload) {
            return
        }
        let userInfoLocalStorage = JSON.parse(localStorage.payload)
        const bearer: string = 'Bearer ' + localStorage.token;
        const fetchUserData = async () => {
            const res = await fetch(`${REACT_APP_API_SERVER}/profile/${userInfoLocalStorage.id}`, {
                method: "GET",
                headers: {
                    'Authorization': bearer,
                }
            })
            const { checkProfile, roomRatingArr , customerRatingArr } = await res.json()
            dispatch(toUserInfo(checkProfile.created_at, checkProfile.id, checkProfile.profile_picture, checkProfile.username, checkProfile.description, checkProfile.phone_number, roomRatingArr, customerRatingArr))
            let imgUrl
            if (isAuthenticated) {
                setId(userInfoLocalStorage.id)
                if (checkProfile.is_rooms_owner) {
                    dispatch(isHost())
				}
                if (checkProfile.profile_picture.slice(0, 5) === "https") {
                    setImageUrl(checkProfile.profile_picture)
                } else {
                    imgUrl = REACT_APP_API_SERVER + "/" + checkProfile.profile_picture
                    setImageUrl(imgUrl)
                }
            }
        }
        if(userInfoLocalStorage.id !== null){
            fetchUserData();
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentImageRedux])
    useEffect(() => {
        let imgUrl
        if (isAuthenticated) {
            let user_info = JSON.parse(localStorage.payload)
            setId(user_info.id)
            if (user_info.profile_picture.slice(0, 5) === "https") {
                setImageUrl(userInfo.profile_picture)
            } else {
                imgUrl = REACT_APP_API_SERVER + "/" + userInfo.profile_picture
                setImageUrl(imgUrl)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])
    const logoOnClick = () => {
        dispatch(push("/"))
    }
    return (
        <nav className="nav-bar nav-room">
            <div className="nav-login">
                <div onClick={logoOnClick} className="link logo"><Logo /></div>
                <><NavLink to="/" className="link home_btn button">Home</NavLink>  <hr className="vhr"/></>
                {!isAuthenticated && <><NavLink to="/login" className="link button login-btn">Login</NavLink>  <hr className="vhr"/></>}
                {!isAuthenticated && <><NavLink to="/register" className="link button">Register</NavLink></>}
                {isAuthenticated && <><NavLink to={`/profile/${id}`} className="link"><div className="profileInfo"><div className="profileImg"><img src={imageUrl} alt="profile-pic" /></div><div className="username_text">{userInfo.username}</div></div></NavLink><hr className="vhr"/></>}
                {isAuthenticated && <span className="logout_text_btn button" onClick={clickLogout}>Logout</span>}
				{isAuthenticated && <span className="logout_btn"><ExitToAppIcon onClick={clickLogout}></ExitToAppIcon></span>}
            </div>
            <div className="nav-items">
                
                {isAuthenticated && <ChatLog />}
                {isAuthenticated && !isHostRedux && <BecomeHostBox />}
                {isAuthenticated && isHostRedux && <ManageYourRooms/>}
            </div>
            {userInfo.roomRatingArr.length > 0 && userInfo.roomRatingArr.map((e:any,index:number)=>{
                return  <NotificationToRate key={index} element={e}/>
            })}
            {userInfo.customerRatingArr.length > 0 && userInfo.customerRatingArr.map((e:any, index:number)=>{
                return  <NotificationToRate key={index} element={e}/>
            })}
        </nav>
    )
}

export default Nav