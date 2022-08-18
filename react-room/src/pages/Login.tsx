import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../redux/store';
import { loginThunk, loginFacebookThunk, loginGoogleThunk } from '../redux/auth/thunks';
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login"
import GoogleLogin from 'react-google-login';
import "../css/Login.css";
import { TextField,makeStyles, Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


interface ILoginForm {
    email: string,
    password: string
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        width: "400px",
        borderRadius: "3%", 
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    label: {
        fontWeight: 700,
        backgroundColor: "#5455a9",

    }
});

const { REACT_APP_FACEBOOK_APP_ID, REACT_APP_GOOGLE_ID } = process.env
const Login = () => {
    const classes = useStyles();
    const { register, handleSubmit } = useForm<ILoginForm>();
    const errors = useSelector((state: IRootState) => state.auth.errors);
    const isLoginProcessing = useSelector((state: IRootState) => state.auth.isLoginProcessing);
    let [showPassword, setShowPassword] = React.useState(false)
    const dispatch = useDispatch();

    const onSubmit = async (data: ILoginForm) => {
        if (data.email && data.password && !isLoginProcessing) {
            const { email, password } = data;
            await dispatch(loginThunk(email, password))
        }
    }
    const fBCallback = (userInfo: ReactFacebookLoginInfo & { accessToken: string }) => {
        if (userInfo.accessToken && !isLoginProcessing) {
            dispatch(loginFacebookThunk(userInfo.accessToken));
        }
        return null;
    }
    const responseGoogle = (response: any) => {
        if (response.accessToken && !isLoginProcessing) {
            dispatch(loginGoogleThunk(response));
        }
        return null;
    }
    return (
        <div className="login-container">
            <Card elevation={10} className={classes.root}>
                <CardContent>
                    <h3 className="userCardTitle">
                        Log In
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            {/* <label htmlFor="email"></label> */}
                            <TextField
                                type="email"
                                name="email"
                                fullWidth={true}
                                id="filled-full-width"
                                label="login email"
                                margin="normal"
                                required
                                variant="outlined"
                                inputRef={register}
                            />
                        </div>
                        <div>
                            <TextField
                                type={showPassword ? "text" : "password"}
                                name="password"
                                fullWidth={true}
                                id="filled-full-width"
                                label="password"
                                margin="normal"
                                required
                                variant="outlined"
                                inputRef={register}
                            />
                        </div>
                        
                        {errors && <p style={{color:"red"}}>{errors}</p>}
                        <div className="show-hide-password">
                            {!showPassword && <span className="password-icons" onClick={()=>{
                                setShowPassword(showPassword = true)
                            }}><VisibilityIcon/></span>}
                            {showPassword && <span className="password-icons" onClick={()=>{
                                setShowPassword(showPassword = false)
                            }}><VisibilityOffIcon/></span>}
                        {!showPassword && <span>Show Password</span>} 
                        {showPassword && <span>Hide Password</span>}
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{marginTop: "5%"}}
                            className={classes.label}>
                                LOGIN
                        </Button>
                        <hr></hr>
                    </form>
                    <div className="oauthBtn">
                        <FacebookLogin
                            appId={REACT_APP_FACEBOOK_APP_ID || ''}
                            autoLoad={false}
                            fields="name,email,picture"
                            onClick={() => null}
                            callback={fBCallback}
                            cssClass="my-facebook-button-class"
                            icon="fa-facebook" 
                        />
                    </div>
                    <div className="g-login">
                    <GoogleLogin
                        className="g-login-button"
                        clientId={`${REACT_APP_GOOGLE_ID}`}
                        buttonText="LOGIN WITH GOOGLE"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;
