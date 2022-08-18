import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Checkbox from '@material-ui/core/Checkbox';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../redux/store';
import { isHost } from '../redux/auth/actions';
import { push } from 'connected-react-router';
import MButton from "@material-ui/core/Button";
import styles from "../css/BecomeHost.module.css"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

const BecomeHostBox = () => {
  const classes = useStyles();
  const bearer: string = 'Bearer ' + localStorage.token;
  const { REACT_APP_API_SERVER } = process.env;
  const dispatch = useDispatch();
  const becomeHost = useSelector((state: IRootState) => state.auth.is_rooms_owner)
  const [open, setOpen] = React.useState(false);
  let [checked, setChecked] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();

    const fetchAgreement = await fetch(`${REACT_APP_API_SERVER}/host`, {
      method: "POST",
      headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agreement: checked })
    })

    if (fetchAgreement.status === 200) {
      dispatch(isHost())
      localStorage.is_rooms_owner = true
      if (becomeHost === true) {
        dispatch(push("/room-owner/manage-room"))
      }
      return null
    } else {
      throw new Error("error")
    }
  }

  return (
    <div>
      <NavLink to="/host" className="link button" onClick={handleClickOpen}>
        Become a Host
      </NavLink>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <form onSubmit={onSubmit}>
          <div className={classes.paper}>
            <h4 id="transition-modal-title">Become a host on Zpace</h4>
            <br></br>
            <p id="transition-modal-description">By becoming a Host to on Zpace, you will be able to rent out your space,
            implying that you agree with Zpace's terms and conditions.</p>
            <div className={styles.becomeHostCheckBoxContainer}>
              <Checkbox
                name="agreement"
                className={styles.agreeBox}
                onChange={handleChange}
                checked={checked}
                required
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              /> <label>I agree to Zpace's Terms and Conditions.</label>
            </div>
            <div className={styles.becomeHostButtonsContainer}>
              <MButton onClick={handleClose} className={styles.roomButtons} variant="contained" color="primary">
                Close
            </MButton>
              <MButton type="submit" className={styles.roomButtons} variant="contained" color="primary" value="Confirm">Confirm</MButton>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default BecomeHostBox;