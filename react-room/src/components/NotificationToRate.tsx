import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { NavLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);
 const NotificationToRate = ({element}:any)=>{
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const bearer: string = 'Bearer ' + localStorage.token;


    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const SkipRate = async (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
      handleClose(event, reason)
      if(element.space_name){
        await fetch(`${process.env.REACT_APP_API_SERVER}/profile/skip-rate/room`,{
          method: "POST",
          headers: {
            'Authorization': bearer,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: element.timeSlotID})
        })
      }else{
        await fetch(`${process.env.REACT_APP_API_SERVER}/profile/skip-rate/customer`,{
          method: "POST",
          headers: {
            'Authorization': bearer,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({id:element.timeSlot})
        })
      }
    }
    return (
        <div style={{position: "absolute"}} className={classes.root}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={120000}
                onClose={handleClose}
                message={``}
                action={
                    <React.Fragment>
                      {console.log(element.space_name)}
                        {element.space_name && <NavLink to={`/room-detail/${element.id}`} >
                        <Alert severity="success" onClick={handleClose}><div >How was the stay at {element.space_name}? Click here to leave a comment.</div></Alert>
                        </NavLink>}
                        {element.username && <NavLink to={`/profile/${element.id}`}>
                        <Alert severity="success" onClick={handleClose}><div>Haven't rate {element.username} for his/her stay? Click here.</div></Alert>
                        </NavLink>}
                            <Button style={{color: "white"}} size="medium" onClick={handleClose}>Rate Later</Button>
                            <Button style={{color: "white"}} size="medium" onClick={SkipRate}>Skip</Button>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}
export default NotificationToRate