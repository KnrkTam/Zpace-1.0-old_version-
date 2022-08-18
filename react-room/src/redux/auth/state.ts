export interface IAuthState {
    isAuthenticated: boolean;
    errors:string;
    isLoginProcessing: boolean;
	is_rooms_owner: boolean;
	payload: {
		created_at: string | null
		id: number | null
		profile_picture: string | null
		username: string | null
		description: string | null
		phone_number: number | null
		customerRatingArr: any
		roomRatingArr:any
    }
}

