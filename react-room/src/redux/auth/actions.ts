export const LOGIN = "@@AUTH/LOGIN"
export const LOGIN_FAILED = "@@AUTH/LOGIN_FAILED"
export const LOGOUT = "@@AUTH/LOGOUT"
export const LOGIN_PROCESS = "@@AUTH/LOGIN_PROCESS"
export const IS_HOST = "@@AUTH/IS_HOST"
export const USER_INFO = "@@AUTH/USER_INFO"
export const GET_USER_INFO = "@@AUTH/GET_USER_INFO"
export const login = () => {
    return {
        type: LOGIN as typeof LOGIN,
    }
}

export const loginFailed = (errors:string) => {
    return {
        type: LOGIN_FAILED as typeof LOGIN_FAILED,
        errors
    }
}

export const loginProcess = ()=>{
    return{
        type: LOGIN_PROCESS as typeof LOGIN_PROCESS,
    }
}

export const logout = () =>{
    return {
        type: LOGOUT as typeof LOGOUT
    }
}

export const isHost = () =>{
    return{
        type: IS_HOST as typeof IS_HOST
    }
}

export const toUserInfo = (
	created_at: string | null, 
	id: number | null,
	profile_picture: string | null,
	username: string | null,
	description: string | null,
	phone_number: number | null,
	roomRatingArr:any,
	customerRatingArr: any
	) => {
	return {
		type: USER_INFO as typeof USER_INFO,
		payload: {
			created_at, 
			id,
			profile_picture,
			username,
			description,
			phone_number,
			roomRatingArr,
			customerRatingArr
		}
	}
}





type actionCreators = typeof login | typeof loginFailed | typeof logout | typeof loginProcess | typeof isHost | typeof toUserInfo


export type IAuthActions = ReturnType<actionCreators>