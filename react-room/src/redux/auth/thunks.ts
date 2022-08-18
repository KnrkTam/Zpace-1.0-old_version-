import { ThunkDispatch } from "../store"
import { loginFailed, login, logout, loginProcess, isHost } from './actions';
import { push } from "connected-react-router";
import { toUserInfo } from "./actions";


const {REACT_APP_API_SERVER} = process.env

export const loginThunk = (email:string, password:string)=>{
    return async (dispatch:ThunkDispatch) =>{
        dispatch(loginProcess())
        const res = await fetch(`${REACT_APP_API_SERVER}/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email,password})
		})
		const result = await res.json()
        if(res.status === 200){
            console.log("login-success")
            localStorage.setItem("token", result.token)
			localStorage.setItem("payload", result.payload)
            const userInfo = JSON.parse(result.payload)
            dispatch(toUserInfo(userInfo.created_at, userInfo.id, userInfo.profile_picture, userInfo.username, userInfo.description || "", userInfo.phone_number || null, userInfo.roomRatingArr, userInfo.customerRatingArr))
            if(userInfo.is_rooms_owner){
                dispatch(isHost())
            }
            dispatch(login())
            dispatch(push("/"))
        }else{
            dispatch(loginFailed("Incorrect email or password input"))
        }
    }
}

export const logoutThunk = () => {
    return async (dispatch: ThunkDispatch) => {
        localStorage.removeItem("token")
        localStorage.removeItem("payload")
        dispatch(logout())
    }
}

export const loginFacebookThunk = (accessToken:string)=>{
    return async (dispatch:ThunkDispatch) =>{
        dispatch(loginProcess())
        const res = await fetch(`${REACT_APP_API_SERVER}/login/facebook`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({accessToken})
        })
        const result = await res.json()
        if(res.status === 200){
            localStorage.setItem("token", result.token)
			localStorage.setItem("payload", result.payload)
			const userInfo = JSON.parse(result.payload)
            dispatch(toUserInfo(userInfo.created_at, userInfo.id, userInfo.profile_picture, userInfo.username, userInfo.description || "", userInfo.phone_number || null, userInfo.roomRatingArr, userInfo.customerRatingArr))
            if(userInfo.is_rooms_owner){
                dispatch(isHost())
            }
            dispatch(login())
            dispatch(push("/"))
        }else{
            dispatch(loginFailed("Please, enter correct email and password"))
        }
    }
}

export const loginGoogleThunk = (response:string)=>{
    return async (dispatch:ThunkDispatch) =>{
        dispatch(loginProcess())
        const res = await fetch(`${REACT_APP_API_SERVER}/login/google`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({response})
        })
        
        const result = await res.json()
        if(res.status === 200){
            localStorage.setItem("token", result.token)
			localStorage.setItem("payload", result.payload)
			const userInfo = JSON.parse(result.payload)
            dispatch(toUserInfo(userInfo.created_at, userInfo.id, userInfo.profile_picture, userInfo.username, userInfo.description || "", userInfo.phone_number || null, userInfo.roomRatingArr, userInfo.customerRatingArr))
            if(userInfo.is_rooms_owner){
                dispatch(isHost())
            }
            dispatch(login())
            dispatch(push("/"))
        }else{
            dispatch(loginFailed("Please, enter correct email and password"))
        }
    }
}