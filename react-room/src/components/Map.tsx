import React, {useEffect, useState} from "react";
import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
} from "react-google-maps";
import "../css/Map.css";
import { useSelector, useDispatch } from "react-redux";
import { ILocationState, ISettingState, IMarkerState, IToStoreRoomState, IToPlaceState } from "../redux/location/states";
import { toStoreRoom } from "../redux/roomInfo/actions";
import { IRoomState } from '../redux/roomInfo/states';
import Search from "./Search";
import Locate from "./Locate";
import { toStoreMarkerIP, toStoreRoomInfo } from "../redux/location/actions";
import { NavLink } from "react-router-dom";
const { REACT_APP_GOOGLE_MAPS_API_KEY, REACT_APP_API_SERVER} = process.env;



const Maps = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp?v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `500px` }} />,
        containerElement: <div style={{ height: `90vh`, width: "100%", position: "relative" }} />,
        mapElement: <div style={{ height: `100%` }} />,
        yesIWantToUseGoogleMapApiInternals: true,
    }),
    withScriptjs,
    withGoogleMap,
)(() => {
    const iP: any = useSelector<ILocationState>((state: ILocationState) => {
        return state.iP;
    });
    const [photoSequence, setPhotoSequence] = useState(0)
    const selected: any = useSelector<IMarkerState>((state:IMarkerState)=>{return state.selected})
    const setting: any = useSelector<ISettingState>((state:ISettingState)=>{return state.setting})
    const room:any = useSelector<IRoomState>((state:IRoomState)=>state.room)
    const place:any = useSelector<IToPlaceState>((state:IToPlaceState)=>state.place)
    const dispatch = useDispatch()
    const chosenRoom: any = useSelector<IToStoreRoomState>((state:IToStoreRoomState)=>{return state.chosenRoom})
    const [markerState, setMarkerState] = useState([])
    const slidePhotoRight = () =>{
        if(chosenRoom.chosenRoom.room.room_pictures.length - 1 > photoSequence){
            setPhotoSequence((e:number)=> e + 1)
        }else{
            setPhotoSequence((e:number)=> e = 0)
        }
    }
    const slidePhotoLeft = () =>{
        if(0 < photoSequence){
            setPhotoSequence((e:number)=> e - 1)
        }else{
            setPhotoSequence((e:number)=> e = chosenRoom.chosenRoom.room.room_pictures.length - 1)
        }
    }
    const exampleMapStyles = [
        {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
                {
                    color: "#eeeeee",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "labels.text",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#9e9e9e",
                },
            ],
        },
    ];
    
    
    useEffect(()=>{
        const fetchRoomDataThunk = async ()=>{
            let roomDataJSON = await fetch(`${REACT_APP_API_SERVER}/booking/fetch-room`,{
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(setting)
            })
			let roomData = await roomDataJSON.json()
            let roomInfos = new Map();
            for (let items of roomData.roomsInfoMap.roomInfos) {
                const room_picture = {
                    picture_filename: items.picture_filename,
                };
                if (roomInfos.has(items.rooms_id)) {
                    roomInfos
                        .get(items.rooms_id)
                        .room_pictures.push(room_picture);
                } else {
                    const bookingRecord = {
                        rooms_id: items.rooms_id,
                        start_time: items.start_time,
                        end_time: items.end_time,
                        room_owner_id: items.room_owner_id,
                        space_name: items.space_name,
                        hourly_price: items.hourly_price,
                        capacity: items.capacity,
                        longitude: items.longitude,
                        latitude: items.latitude,
                        district: items.district,
                        room_pictures: [room_picture],
                    };
                    roomInfos.set(items.rooms_id, bookingRecord);
                }
            }
            let roomInfosOneOff = new Map();
            for (let item of roomData.roomsInfoMap.roomInfosOneOff) {
                const room_picture = {
                    picture_filename: item.picture_filename,
                };
                if (roomInfosOneOff.has(item.rooms_id)) {
                    roomInfosOneOff
                        .get(item.rooms_id)
                        .room_pictures.push(room_picture);
                } else {
                    const bookingRecord = {
                        rooms_id: item.rooms_id,
                        start_time: item.start_time,
                        end_time: item.end_time,
                        room_owner_id: item.room_owner_id,
                        longitude: item.longitude,
                        latitude: item.latitude,
                        space_name: item.space_name,
                        hourly_price: item.hourly_price,
                        capacity: item.capacity,
                        district: item.district,
                        room_pictures: [room_picture],
                    };
                    roomInfosOneOff.set(item.rooms_id, bookingRecord);
                }
            }
            
            let combinedRoomsOb = {...strMapToObj(roomInfos), ...strMapToObj(roomInfosOneOff)}
            let combinedRoomsArr = Object.values(combinedRoomsOb)
            let startPriceRg = parseInt(setting.setting.priceRg[0])
            let endPriceRg = parseInt(setting.setting.priceRg[1])
            let capacity = setting.setting.ppl
            combinedRoomsArr = combinedRoomsArr.filter((e:any)=>{
                return checkPriceRg(e,startPriceRg,endPriceRg) === true
            })
            combinedRoomsArr = sortByAttribute(combinedRoomsArr, "district")
            let chosenDistrict
            if(place.place.length > 1){
            chosenDistrict = combinedRoomsArr.filter((e:any)=>{
                let ifMatch = false
                for(let i = 0 ; i < place.place.length; i ++){
                    let splitedAddress = place.place[i].formatted_address.split(",")
                    for(let k = 0; k < splitedAddress.length; k++){
                        if(splitedAddress[k].includes(e.district)){
                            ifMatch = true
                            break
                        }
                    }
                    if(ifMatch === true){
                        break
                    }
                }
                return ifMatch
            })
            let theRestDistrict = combinedRoomsArr.filter((e:any)=>{
                let ifMatch = true
                for(let i = 0 ; i < place.place.length; i ++){
                    let splitedAddress = place.place[i].formatted_address.split(",")
                    for(let k = 0; k < splitedAddress.length; k++){
                        if(splitedAddress[k].includes(e.district)){
                            ifMatch = false
                            break
                        }
                    }
                    if(ifMatch === false){
                        break
                    }
                }
                return ifMatch
            })
            chosenDistrict.sort((a:any,b:any)=>{
                return a.capacity - b.capacity
            })
            theRestDistrict.sort((a:any,b:any)=>{
                return a.capacity - b.capacity
            })
            let findIndex = chosenDistrict.findIndex((e:any)=>{
                return e.capacity >= capacity})
            let firstPart = chosenDistrict.splice(0, findIndex)
            chosenDistrict = chosenDistrict.concat(firstPart)

            let findIndexTheRestPart = theRestDistrict.findIndex((e:any)=>{
                return e.capacity >= capacity})
            let firstPartTheRestPart = theRestDistrict.splice(0, findIndexTheRestPart)
            theRestDistrict = theRestDistrict.concat(firstPartTheRestPart)

            chosenDistrict = chosenDistrict.concat(theRestDistrict)
            } else{
                let district = place.place[0]
                chosenDistrict = combinedRoomsArr.filter((e:any)=>{
                    return district === e.district
                })
                let theRestDistrict = combinedRoomsArr.filter((e:any)=>{
                    return district !== e.district
                })
                chosenDistrict.sort((a:any,b:any)=>{
                    return a.capacity - b.capacity
                })
                theRestDistrict.sort((a:any,b:any)=>{
                    return a.capacity - b.capacity
                })
                let findIndex = chosenDistrict.findIndex((e:any)=>{
                    return e.capacity === capacity})
                let firstPart = chosenDistrict.splice(0, findIndex)
                chosenDistrict = chosenDistrict.concat(firstPart)
    
                let findIndexTheRestPart = theRestDistrict.findIndex((e:any)=>{
                    return e.capacity === capacity})
                let firstPartTheRestPart = theRestDistrict.splice(0, findIndexTheRestPart)
                theRestDistrict = theRestDistrict.concat(firstPartTheRestPart)
                chosenDistrict = chosenDistrict.concat(theRestDistrict)
            }
            dispatch(toStoreRoom(chosenDistrict))
        }
        function strMapToObj(strMap:any) {
            let obj = Object.create(null);
            for (let [k,v] of strMap) {
            obj[k] = v;
            }
            return obj;
        }
        const checkPriceRg = (ob:any,startPriceRg:any, endPriceRg:any ) => {
            return startPriceRg <= parseInt(ob.hourly_price) &&  parseInt(ob.hourly_price) <= endPriceRg
        }
        
function sortByAttribute(array:any, ...attrs:any) {
    // generate an array of predicate-objects contains
    // property getter, and descending indicator
    let predicates = attrs.map((pred:any) => {
    let descending = pred.charAt(0) === '-' ? -1 : 1;
    pred = pred.replace(/^-/, '');
    return {
        getter: (o:any) => o[pred],
        descend: descending
    };
    });
    // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
    return array.map((item:any) => {
    return {
        src: item,
        compareValues: predicates.map((predicate:any) => predicate.getter(item))
    };
    })
    .sort((o1:any, o2:any) => {
    let i = -1, result = 0;
    while (++i < predicates.length) {
        if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
        if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
        // eslint-disable-next-line no-cond-assign
        if (result *= predicates[i].descend) break;
    }
    return result;
    })
    .map((item:any) => item.src);
    }
        fetchRoomDataThunk()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
        setMarkerState((e:any)=> room)
    },[room])
    
    return (
        <div className="google_map_box">
            <div className="search"> <Search /></div>
            <div className="locate"> <Locate /></div>
            <GoogleMap
                defaultZoom={11}
                options={{
                    styles: exampleMapStyles,
                }}
                center={{ lat: iP.iP.lat, lng: iP.iP.lng }}
                zoom={iP.iP.zoom}
            >
                {markerState.length > 0 && markerState.map((e:any,index:number)=>{
                return <div key={index}><Marker
                    onClick={() => {
                        dispatch(toStoreRoomInfo({room: e} as any))
                        dispatch(toStoreMarkerIP(e.latitude, e.longitude));
                    }}
                    position={{
                        lat: parseFloat(e.latitude),
                        lng: parseFloat(e.longitude),
                    }}
                /></div>})}
                {selected.selected.lat ? (
                    <InfoWindow
                        position={{ lat: parseFloat(selected.selected.lat), lng: parseFloat(selected.selected.lng) }}
                        onCloseClick={() => {
                            dispatch(toStoreMarkerIP(null, null));
                        }}
                    >
                        <div className="preview_room_marker">
                            <div className="img-box">{chosenRoom.chosenRoom.room.room_pictures.length > 1 && <i onClick={slidePhotoLeft} className="fas i-left fa-chevron-circle-left"></i>}<img src={chosenRoom.chosenRoom.room.room_pictures[photoSequence].picture_filename.slice(0, 5) !== "https" ?  REACT_APP_API_SERVER + "/" + chosenRoom.chosenRoom.room.room_pictures[photoSequence].picture_filename : chosenRoom.chosenRoom.room.room_pictures[photoSequence].picture_filename} alt="zpace-pic" />{chosenRoom.chosenRoom.room.room_pictures.length > 1 &&  <i onClick={slidePhotoRight} className="fas i-right fa-chevron-circle-right"></i>}</div>
                            <NavLink to={`/room-detail/${chosenRoom.chosenRoom.room.rooms_id}`} className="link button in_map_name">{chosenRoom.chosenRoom.room.space_name}</NavLink>
                            <p>Capacity: {chosenRoom.chosenRoom.room.capacity}</p>
                            <p>${chosenRoom.chosenRoom.room.hourly_price.replace(/.0+$|0+$/, '')}/hour</p>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
            </div>
    );
});



export default Maps;
