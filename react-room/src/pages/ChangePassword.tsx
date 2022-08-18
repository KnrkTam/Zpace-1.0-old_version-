import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import styles from "../css/Profile.module.css";
import MButton from '@material-ui/core/Button';
import { TextField, Card } from '@material-ui/core';


const useStyles = makeStyles({
  root: {
      width: 400,
      padding: "4%",
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
});


interface IChangePasswordProps {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC<IChangePasswordProps> = () => {
  const classes = useStyles();
  const bearer = "Bearer " + localStorage.token;
  const { REACT_APP_API_SERVER } = process.env;
  const [serverErrors, setServerErrors] = useState<Array<string>>([]);
  const dispatch = useDispatch();  

  const { register, handleSubmit, errors, watch } = useForm<IChangePasswordProps>({
  
  });

const onEditSubmit = async (data: IChangePasswordProps) => {
  setServerErrors([]);
  
      const formData = new FormData();
    
      if (data.password){
      formData.append("password", data.password);
      formData.append("newPassword", data.newPassword);
      }
    
      const response = await fetch(
      `${REACT_APP_API_SERVER}/profile-edit/edit`,
      {
          method: "POST",
          headers: {
          Authorization: bearer,
          },
          body: formData,
      }
      );
      const fetchData = await response.json();
      if (fetchData.errors) {
      setServerErrors((e)=>e.concat([fetchData.errors]));
      } else if (fetchData.success) {
        let localstore = JSON.parse(localStorage.payload)
        if(fetchData.user.username){
          localstore.username = fetchData.user.username
        }
    
        localStorage.removeItem("payload")
        localStorage.setItem("payload", JSON.stringify(localstore))
      dispatch(push("/profile"));
      }
};


  return (
    <>
    <div className={styles.editpwContainer}>
      <Card className={classes.root}>
      <div> 
      <h5>Change Password </h5>
      </div>
          <form onSubmit={handleSubmit(onEditSubmit)}>
            <div>
            <TextField
                required
                fullWidth={true}            
                id="password-input"
                inputRef={register}
                label="Current Password"
                type="password"
                name="password"
                margin="normal"
                autoComplete="off"
                variant="outlined"
                error={Boolean(errors?.password)} 
              />
            </div >
            { watch ("password") && <>
            <div>
            <TextField 
                id="password-input"
                inputRef={register({
                  required: 'new password input is required',
                  minLength: {
                    value: 6,
                    message: "Password has to be an at least 6-digit input"
                  },
                  validate: (value) => value !== watch('password') || "New password has to be different from old password"
                })}
                label="New Password"
                type="password"
                fullWidth={true}
                name="newPassword"
                margin="normal"
                autoComplete="off"
                variant="outlined"
                error={Boolean(errors?.newPassword)}
                helperText={errors.newPassword ? errors.newPassword.message: ""}             
              />
            </div>
            <div>
              <TextField
                id="password-input"
                inputRef={register({
                  required:true,
                  validate: (value) => value === watch('newPassword') || "Confirm password has to be identical to your new password"
                  })
                }
                label="Confirm Password"
                type="password"
                fullWidth={true}
                name="confirmPassword"
                margin="normal"
                autoComplete="off"
                variant="outlined"
                error={Boolean(errors?.confirmPassword)}
                helperText={errors.confirmPassword ? errors.confirmPassword.message: ""}

                
              />
              {serverErrors && serverErrors.map((error, index) => {
                  return <div className={styles.errmsg} key={`${index}`}>{error}</div>;
                })}
            </div>
            </>}
            <MButton
              type="submit"
              variant="contained"
              color="primary"
              style={{marginTop: "5%"}}
            >
              Confirm
            </MButton>
          </form>
          <MButton
            color="primary"
            style={{marginTop: "5%"}}>
            <NavLink
                to="/profile"
              >
                Back
              </NavLink>
          </MButton>
          
      </Card>
      </div>
    </>
  );
};

export default ChangePassword;