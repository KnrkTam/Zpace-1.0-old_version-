import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Select } from '@material-ui/core';
import "../css/MainPage.css";




const Places = ({handleChange}:any) => {
      
    
    return (
        <div>
        <FormControl variant="outlined" className="places-form">
          <InputLabel htmlFor="demo-simple-native-outlined-label">Search by District</InputLabel>
          <Select
            onChange={handleChange}
            label= "Search by District"
            name= 'district'
            id="outlined-district-native-label"
            >
            <MenuItem value={"Tung Chung"}>Tung Chung</MenuItem>
            <MenuItem value={"Kwai Tsing"}>Kwai Tsing</MenuItem>
            <MenuItem value={"North District"}>North District</MenuItem>
            <MenuItem value={"Sai Kung District"}>Sai Kung</MenuItem>
            <MenuItem value={"Sha Tin District"}>Sha Tin</MenuItem>
            <MenuItem value={"Tai Po District"}>Tai Po</MenuItem>
            <MenuItem value={"Tsing Yi"}>Tsing Yi</MenuItem>
            <MenuItem value={"Tsuen Wan"}>Tsuen Wan</MenuItem>
            <MenuItem value={"Tin Shui Wai"}>Tin Shui Wai</MenuItem>
            <MenuItem value={"Tuen Mun"}>Tuen Mun</MenuItem>
            <MenuItem value={"Yuen Long"}>Yuen Long</MenuItem>
            <MenuItem value={"Kowloon City District"}>Kowloon City</MenuItem>
            <MenuItem value={"Kwun Tong District"}>Kwun Tong</MenuItem>
            <MenuItem value={"Yau Tsim Mong"}>Yau Tsim Mong</MenuItem>
            <MenuItem value={"Distrikt Sham Shui Po"}>Sham Shui Po</MenuItem>
            <MenuItem value={"Wong Tai Sin District"}>Wong Tai Sin</MenuItem>
            <MenuItem value={"Tseung Kwan O"}>Tseung Kwan O</MenuItem>
            <MenuItem value={"Central and Western"}>Central and Western</MenuItem>
            <MenuItem value={"Eastern District"}>Eastern</MenuItem>
            <MenuItem value={"Southern District"}>Southern</MenuItem>
            <MenuItem value={"Wan Chai District"}>Wan Chai</MenuItem>
          </Select>
      </FormControl>
    </div>
  )
}


export default Places