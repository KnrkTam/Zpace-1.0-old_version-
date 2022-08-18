import React from "react"
import { Switch } from "react-router-dom"
import MainPage from "../pages/MainPage"
import { Route } from 'react-router-dom';
import Login from "../pages/Login";
import Register from "../pages/Register";
import RoomOwnerMain from '../pages/RoomOwnerMain';
import RoomOwnerBookingHist from '../pages/RoomOwnerBookingHist';
import RoomOwnerCreateRoom from '../pages/RoomOwnerCreateRoom';
import Profile from '../pages/Profile';
import { PrivateRoute } from "./PrivateRoute"
import { OpenRoute } from "./OpenRoute"
import ChangePassword from '../pages/ChangePassword';
import NotFound from "../components/NotFound";
import BookingConfirmation from '../pages/BookingConfirmation';
import EditRoom from "../pages/EditRoom";
import SearchResultPage from "../pages/SearchResultPage";
import RoomDetailPage from '../pages/RoomDetailPage';
import ChatRoom from '../components/ChatRoom';
import BookingAcceptPage from '../pages/BookingAcceptPage';
import ChartLog from "../pages/ChartLog";
import UserBookingHistoryList from '../pages/UserBookingHistoryList';
import UserBookingHistoryDetail from '../pages/UserBookingHistoryDetail';
import RoomOwnerBookingHistoryList from "../pages/BookingHistoryList";

const Routes = ()=>{
    return (
        <Switch>
            <Route path="/" exact={true} component={MainPage} />
            <OpenRoute path="/login"  component={Login} />
            <OpenRoute path="/register" component={Register} />
            <Route path="/search" component={SearchResultPage} />
            <Route path="/profile" exact={true} component={Profile} />
            <Route path="/room-owner" exact={true} component={RoomOwnerMain} /> 
            <Route path="/room-owner/edit-room" component={EditRoom}/>
            <PrivateRoute path="/host" component={MainPage} />
            <PrivateRoute path="/room-owner/manage-room/create-room" component={RoomOwnerCreateRoom} />
            <PrivateRoute path="/room-owner/booking-history/:id" component={RoomOwnerBookingHistoryList} />
			<PrivateRoute path="/room-owner/booking-history-detail/:id" component={RoomOwnerBookingHist} />
			<PrivateRoute path="/room-owner/user-booking-history/:id" component={UserBookingHistoryList} />
			<PrivateRoute path="/room-owner/user-booking-history-detail/:id" component={UserBookingHistoryDetail} />
            {/* <PrivateRoute path="/room-owner/contact" component={RoomOwnerContact} /> */}
            <PrivateRoute path="/room-owner/:id" component={RoomOwnerMain} /> 
            <PrivateRoute path="/profile/edit" exact={true} component={ChangePassword} />
            <PrivateRoute path="/profile/:id" component={Profile} />
            <PrivateRoute path="/chat-room/:id" component={ChatRoom} />
            <PrivateRoute path="/chart-log" component={ChartLog} />
            <Route path="/room-detail/:id" component={RoomDetailPage} />
			<PrivateRoute path="/booking-confirmation/:id" component={BookingConfirmation} />
            <PrivateRoute path="/room-request/:id" component={BookingAcceptPage} />
            <Route path="*" component={NotFound} />
        </Switch>
    )
}

export default Routes