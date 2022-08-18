import React from "react"
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { toStoreIP, toStorePlace } from "../redux/location/actions";
import { loadingOFF, loadingON } from '../redux/loading/action';
import Loading from "./Loading";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
  }
  }),
);

function Locate(){
  const loading:any = useSelector<any>((state)=>{return state.isLoading})
    const dispatch = useDispatch()
    const classes = useStyles();
    return (<div>
      {loading.isLoading && <Loading />}
      {!loading.isLoading && <Button
    variant="contained"
    color="default"
    onClick={()=>{
      dispatch(loadingON())
      navigator.geolocation.getCurrentPosition(async (position)=>{
        const addressJSON = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const address = await addressJSON.json()
        dispatch(toStorePlace(address.results))
        dispatch(toStoreIP(position.coords.latitude, position.coords.longitude, 15))
        dispatch(loadingOFF())
      }, ()=>null)
    }}
    className={classes.button}
    startIcon={<LocationOnIcon style={{ fontSize: 20 }}/>}
  >
    Current Location
  </Button>}
  </div>)
  }
export default Locate  

