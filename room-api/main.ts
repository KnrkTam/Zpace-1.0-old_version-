import express from "express"
import bodyParser from 'body-parser';
import knexConfigs = require('./knexfile');
import multer from 'multer';
import Knex from 'knex';
import cors from "cors"
import http from 'http';
// import socketIO from "socket.io";
const socketIO = require('socket.io')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
const server = new http.Server(app);
export const io = socketIO(server);
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  }
app.use(cors(corsOptions));
app.use(express.json())
let mode = process.env.NODE_ENV || "test";

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, `./public/uploads`);
    },
    filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
    }
})
export const upload = multer({ storage: storage })
let knexConfig = knexConfigs[mode]
export const knex = Knex(knexConfig)

app.use(express.static("public/uploads"));
// Register route
import { RegisterRoute } from './routes/register.routes';
import RegisterService from './services/register.service';
import RegisterController from './controller/register.controller';


let registerService = new RegisterService(knex)
let registerController = new RegisterController(registerService)
let registerRoute = RegisterRoute(registerController)
app.use('/register', registerRoute)

// Login route
import { LoginRoute } from './routes/login.routes';
import LoginService from './services/login.service';
import LoginController from './controller/login.controller';


export let loginService = new LoginService(knex);
let loginController = new LoginController(loginService);
let loginRoute = LoginRoute(loginController);
app.use('/login', loginRoute)


// Profile route
import { ProfileRoute } from './routes/profile.routes';
import ProfileService  from './services/profile.service';
import ProfileController from "./controller/profile.controller";

export let profileService = new ProfileService(knex);
let profileController = new ProfileController(profileService);
let profileRoute = ProfileRoute(profileController);
app.use('/profile', profileRoute)

// Profile-EDIT route
import { ProfileEditRoute } from './routes/profile-edit.routes';
import ProfileEditService  from './services/profile-edit.service';
import ProfileEditController from "./controller/profile-edit.controller";

export let profileEditService = new ProfileEditService(knex);
let profileEditController = new ProfileEditController(profileEditService);
let profileEditRoute = ProfileEditRoute(profileEditController);
app.use('/profile-edit', profileEditRoute)

// viewAllRooms route
import { ViewAllRoomsRoute } from './routes/viewAllRooms.routes';
import ViewAllRoomsService from './services/viewAllRooms.service';
import ViewAllRoomsController from './controller/viewAllRooms.controller';

export let viewAllRoomsService = new ViewAllRoomsService(knex);
let viewAllRoomsController = new ViewAllRoomsController(viewAllRoomsService);
let viewAllRoomsRoute = ViewAllRoomsRoute(viewAllRoomsController);
app.use("/room-owner", viewAllRoomsRoute)


// createRoom route 
import { CreateRoomRoute } from './routes/createRoom.routes';
import CreateRoomService from './services/createRoom.service';
import CreateRoomController from './controller/createRoom.controller';


export let createRoomService = new CreateRoomService(knex);
let createRoomController = new CreateRoomController(createRoomService);
let createRoomRoute = CreateRoomRoute(createRoomController);
app.use("/room-owner/manage-room", createRoomRoute);

// editRoom route
import { EditRoomsRoute } from './routes/editRoom.routes';
import EditRoomsService from './services/editRooms.service';
import EditRoomsController from './controller/editRooms.controller';

export let editRoomsService = new EditRoomsService(knex);
let editRoomsController = new EditRoomsController(editRoomsService);
let editRoomRoute = EditRoomsRoute(editRoomsController);
app.use("/edit-room", editRoomRoute);

// customerView
import { CustomerViewRoomsRoute } from "./routes/customerViewRoom.routes";
import CustomerViewRoomsService from './services/customerViewRoom.service';
import CustomerViewRoomsController from './controller/customerViewRoom.controller';

export let customerViewRoomsService = new CustomerViewRoomsService(knex);
let customerViewRoomsController = new CustomerViewRoomsController(customerViewRoomsService);
let customerViewRoomsRoute = CustomerViewRoomsRoute(customerViewRoomsController);
app.use("/view-room", customerViewRoomsRoute);

// BecomeHost
import { BecomeHostRoute } from './routes/becomeHost.routes';
import BecomeHostService from './services/becomeHost.service';
import BecomeHostController from './controller/becomeHost.controller';

export let becomeHostService = new BecomeHostService(knex);
let becomeHostController = new BecomeHostController(becomeHostService);
let becomeHostRoute = BecomeHostRoute(becomeHostController);
app.use("/host", becomeHostRoute);

// Booking
import { BookingRoute } from './routes/booking.routes';
import BookingService  from './services/booking.service';
import BookingController from "./controller/booking.controller";

export let bookingService = new BookingService(knex);
let bookingController = new BookingController(bookingService);
let bookingRoute = BookingRoute(bookingController);
app.use('/booking', bookingRoute)

// ChatRoom
import { ChatRoomRoute } from './routes/chatRoom.routes';
import ChatRoomService  from './services/chatRoom.service';
import ChatRoomController from "./controller/chatRoom.controller";

export let chatRoomService = new ChatRoomService(knex);
let chatRoomController = new ChatRoomController(chatRoomService);
let chatRoomRoute = ChatRoomRoute(chatRoomController);
app.use('/chat', chatRoomRoute)



const PORT = 8080;
server.listen(PORT, () => {
    console.log(`listen on port http://localhost:${PORT}`)
})