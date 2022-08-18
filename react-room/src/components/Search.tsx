import React from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from "@reach/combobox";
import { useDispatch, useSelector } from "react-redux";
import { ILocationState } from "../redux/location/states";
import { toStoreIP, toStorePlace } from "../redux/location/actions";



const Search = ()=>{
    const dispatch = useDispatch()
    const iP: any = useSelector<ILocationState>((state: ILocationState) => {
      return state.iP;
  });
    const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlacesAutocomplete({
      requestOptions:{
        location: { lat: ()=>iP.iP.lat,
                    lng: ()=>iP.iP.lng
                  } as any,
        radius: 200 * 1000,
      }
    })
    return (<div className="search"><Combobox onSelect={async(address:any) => {
      setValue(address, false)
      clearSuggestions()
      try{
        const latAndLngJSON = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}-Hong-Kong&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const latAndLng = await latAndLngJSON.json()
        if(latAndLng.results[0]){
        let lat = latAndLng.results[0].geometry.location.lat || null
        let lng = latAndLng.results[0].geometry.location.lng || null
        const addressJSON = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const addresses = await addressJSON.json()
        dispatch(toStorePlace(addresses.results))
        dispatch(toStoreIP(lat, lng, 15))
        }
      }catch(e){
      }
    }}>
      <ComboboxInput value={value} style={{ width: "100%"}}onChange={(e:any)=>{setValue(e.target.value)}} disabled={!ready} placeholder="Enter an address"/>
      <ComboboxPopover style={{backgroundColor: "white"}}>
      <ComboboxList style={{listStyleType: "none"}}>
        {status === "OK" && data.map(({id, description})=><ComboboxOption style={{cursor: "pointer"}} key={`${id}_${description}`} value={description}/>)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox></div>)
}


export default Search;
