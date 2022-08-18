import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paper from '@material-ui/core/Paper';
import { faLaptopHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "../css/BookingHistoryList.module.css"
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import { Container } from "react-bootstrap";

// yarn add moment

interface IRoomInfoProps {
  card: {
    id: number,
    space_name: string | null,
    hourly_price: any,
    capacity: string | number | null,
    district: string | null,
    pictures: string[],
    description: string | null,
    address: string | null,
    weeklyTimeSlot: any,
    facilityItems: any
  }
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: "white",
    marginTop: "10px"
  },
}));

const d2 = (x: number) => {
  return x < 10 ? "0" + x : "" + x;
};
const parseTime = (num: number) => {
  let str = ''
  if (`${num}`.includes(".") && Math.floor(num) === 0) {
    str = `30 minutes`
  } else if (`${num}`.includes(".")) {
    str = `${Math.floor(num)} ${Math.floor(num) > 1 ? `hours` : `hour`} and 30 minutes`
  } else {
    str = `${num} ${Math.floor(num) > 1 ? `hours` : `hour`}`
  }

  return str
}

function diff_minutes(dt1: string, dt2: string) {
  let date1 = `2020-01-02 ${dt1}`
  let date2 = `2020-01-02 ${dt2}`
  let dtF = new Date(date1);
  let dtL = new Date(date2);
  let diff = (dtF.getTime() - dtL.getTime()) / 1000;
  diff = diff / 60 / 60;
  return Math.abs(diff);
}

const UserBookingHistoryList: React.FC<IRoomInfoProps> = () => {

  const bearer: string = 'Bearer ' + localStorage.token;
  const { REACT_APP_API_SERVER } = process.env;
  const { id }: any = useParams();
  const classes = useStyles();
  const [completedRequest, setCompletedRequest] = useState([])
  const [acceptedRequest, setAcceptedRequest] = useState([])
  const [pendingRequest, setPendingRequest] = useState([])
  const [rejectedRequest, setRejectedRequest] = useState([])
  const [value, setValue] = useState(0);
  const fetchBookingData = async () => {

    const res = await fetch(`${REACT_APP_API_SERVER}/booking/user-booking-record/${id}`, {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    });
    const { bookingList } = await res.json();

    if (bookingList.length > 0) {
      for (let item of bookingList) {
        for (let i = 0; i < item.time_slots.length; i++) {
          let [hour, minute] = item.time_slots[i].end_time.split(':');
          if (minute === "30") {
            hour = parseInt(hour) + 1
            hour = d2(hour)
            minute = "00"
          } else {
            // eslint-disable-next-line no-self-assign
            hour = hour
            minute = "30"
          }
          // eslint-disable-next-line no-useless-concat
          let end_time_slot = hour + ":" + minute + ":" + "00"
          item.time_slots[i].end_time = end_time_slot
          if (item.time_slots.length === 1) {
            item.time_slots = diff_minutes(item.time_slots[i].start_time, item.time_slots[i].end_time)
          } else {
            item.time_slots[i] = diff_minutes(item.time_slots[i].start_time, item.time_slots[i].end_time)
          }
        }
      }
      for (let k = 0; k < bookingList.length; k++) {
        if (bookingList[k].time_slots.length === 1) {

        } else if (bookingList[k].time_slots.length > 1) {
          bookingList[k].time_slots = bookingList[k].time_slots.reduce((prev: any, current: any) => {
            return prev + current
          })
        }
      }
    }
    setCompletedRequest(bookingList.filter((timeSlot: any) => timeSlot.status === "completed"))
    setAcceptedRequest(bookingList.filter((timeSlot: any) => timeSlot.status === "accepted"))
    setPendingRequest(bookingList.filter((timeSlot: any) => timeSlot.status === "pending"))
    setRejectedRequest(bookingList.filter((timeSlot: any) => timeSlot.status === "rejected"))
  }
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    fetchBookingData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <React.Fragment>
      <div className="container">
        <Container >
          <div className={classes.root}>
            <AppBar className={styles.tablist} position="static" color="transparent">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons={"on"}
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Completed" {...a11yProps(0)} />
                <Tab label="Accepted" {...a11yProps(1)} />
                <Tab label="Pending" {...a11yProps(2)} />
                <Tab label="Rejected" {...a11yProps(3)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              {completedRequest.length === 0 && <div>
                <FontAwesomeIcon icon={faLaptopHouse} className="default-image" />
                <br></br>
                <br></br>
                <span className="no-photos-at-moment">Currently No Completed Time-Slot Record.</span>
              </div>}
              {completedRequest.length > 0 && completedRequest.map((data: any, idx: any) => (
                <NavLink className={styles.box_href} to={`/room-owner/user-booking-history-detail/${data.id}`}>
                  <Paper className={styles.card_piece} elevation={3}>
                    <div className={styles.each_grid_info}>
                      <div className={styles.request_basic_info}>
                        <div className={styles.request_info}>
                          Space Name: <span className={styles.span_info}>{data.space_name}</span>
                        </div>
                        <div className={styles.request_info}>
                          Request Date: <span className={styles.span_info}>{moment(data.created_at).format("MMMM Do YYYY")}</span>
                        </div>
                        <div className={styles.request_info}>
                          Total Price: <span className={styles.span_info}>{data.price} HKD</span>
                        </div>
                        <div className={styles.request_info}>
                          Duration: <span className={styles.span_info}>{parseTime(data.time_slots)}</span>
                        </div>
                        <div className={styles.request_info}>
                          Number of people: <span className={styles.span_info}>{data.head_count}</span>
                        </div>
                      </div>
                      <div>
                        <div className={styles.user_info_section}>
                          <div className={styles.user_pic}>
                            <img src={data.picture_filename.slice(0, 5) === "https" ? data.picture_filename : REACT_APP_API_SERVER + "/" + data.picture_filename} alt="profile-pic" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </NavLink>
              ))}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {acceptedRequest.length === 0 && <div>
                <FontAwesomeIcon icon={faLaptopHouse} className="default-image" />
                <br></br>
                <br></br>
                <span className="no-photos-at-moment">Currently No Accepted Time-Slot Record.</span>
              </div>}
              {acceptedRequest.length > 0 && acceptedRequest.map((data: any, idx: any) => (
                <NavLink className={styles.box_href} to={`/room-owner/user-booking-history-detail/${data.id}`}>
                  <Paper className={styles.card_piece} elevation={3}>
                    <div className={styles.each_grid_info}>
                      <div className={styles.request_basic_info}>
                        <div className={styles.request_info}>
                          Space Name: <span className={styles.span_info}>{data.space_name}</span>
                        </div>
                        <div className={styles.request_info}>
                          Request Date: <span className={styles.span_info}>{moment(data.created_at).format("MMMM Do YYYY")}</span>
                        </div>
                        <div className={styles.request_info}>
                          Total Price: <span className={styles.span_info}>{data.price} HKD</span>
                        </div>
                        <div className={styles.request_info}>
                          Duration: <span className={styles.span_info}>{parseTime(data.time_slots)}</span>
                        </div>
                        <div className={styles.request_info}>
                          Number of people: <span className={styles.span_info}>{data.head_count}</span>
                        </div>
                      </div>
                      <div>
                        <div className={styles.user_info_section}>
                          <div className={styles.user_pic}>
                            <img src={data.picture_filename.slice(0, 5) === "https" ? data.picture_filename : REACT_APP_API_SERVER + "/" + data.picture_filename} alt="profile-pic" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </NavLink>
              ))}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {pendingRequest.length === 0 && <div>
                <FontAwesomeIcon icon={faLaptopHouse} className="default-image" />
                <br></br>
                <br></br>
                <span className="no-photos-at-moment">Currently No Pending Time-Slot Record.</span>
              </div>}
              {pendingRequest.length > 0 && pendingRequest.map((data: any, idx: any) => (
                <NavLink className={styles.box_href} to={`/room-owner/user-booking-history-detail/${data.id}`}>
                  <Paper className={styles.card_piece} elevation={3}>
                    <div className={styles.each_grid_info}>
                      <div className={styles.request_basic_info}>
                        <div className={styles.request_info}>
                          Space Name: <span className={styles.span_info}>{data.space_name}</span>
                        </div>
                        <div className={styles.request_info}>
                          Request Date: <span className={styles.span_info}>{moment(data.created_at).format("MMMM Do YYYY")}</span>
                        </div>
                        <div className={styles.request_info}>
                          Total Price: <span className={styles.span_info}>{data.price} HKD</span>
                        </div>
                        <div className={styles.request_info}>
                          Duration: <span className={styles.span_info}>{parseTime(data.time_slots)}</span>
                        </div>
                        <div className={styles.request_info}>
                          Number of people: <span className={styles.span_info}>{data.head_count}</span>
                        </div>
                      </div>
                      <div>
                        <div className={styles.user_info_section}>
                          <div className={styles.user_pic}>
                            <img src={data.picture_filename.slice(0, 5) === "https" ? data.picture_filename : REACT_APP_API_SERVER + "/" + data.picture_filename} alt="profile-pic" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </NavLink>
              ))}
            </TabPanel>
            <TabPanel value={value} index={3}>
              {rejectedRequest.length === 0 && <div>
                <FontAwesomeIcon icon={faLaptopHouse} className="default-image" />
                <br></br>
                <br></br>
                <span className="no-photos-at-moment">Currently No Rejected Time-Slot Record.</span>
              </div>}
              {rejectedRequest.length > 0 && rejectedRequest.map((data: any, idx: any) => (
                <NavLink className={styles.box_href} to={`/room-owner/user-booking-history-detail/${data.id}`}>
                  <Paper className={styles.card_piece} elevation={3}>
                    <div className={styles.each_grid_info}>
                      <div className={styles.request_basic_info}>
                        <div className={styles.request_info}>
                          Space Name: <span className={styles.span_info}>{data.space_name}</span>
                        </div>
                        <div className={styles.request_info}>
                          Request Date: <span className={styles.span_info}>{moment(data.created_at).format("MMMM Do YYYY")}</span>
                        </div>
                        <div className={styles.request_info}>
                          Total Price: <span className={styles.span_info}>{data.price} HKD</span>
                        </div>
                        <div className={styles.request_info}>
                          Duration: <span className={styles.span_info}>{parseTime(data.time_slots)}</span>
                        </div>
                        <div className={styles.request_info}>
                          Number of people: <span className={styles.span_info}>{data.head_count}</span>
                        </div>
                      </div>
                      <div>
                        <div className={styles.user_info_section}>
                          <div className={styles.user_pic}>
                            <img src={data.picture_filename.slice(0, 5) === "https" ? data.picture_filename : REACT_APP_API_SERVER + "/" + data.picture_filename} alt="profile-pic" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </NavLink>
              ))}
            </TabPanel>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default UserBookingHistoryList;