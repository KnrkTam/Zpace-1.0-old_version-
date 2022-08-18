import React, { useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2';
import styles from "../css/SummaryChart.module.css"
import { TextField } from '@material-ui/core';
const SummaryChart = ({ roomInfo }: any) => {
    let monthlyPrices: number[] = new Array(12).fill(0)
    let monthlyRequest: number[] = new Array(12).fill(0)
    const [year, setYear] = useState(new Date().getFullYear())
    let roomNameArr: any = []
    let roomPriceArr: any = []
    let roomLikeArr: any = []
    let roomRequestArr: any = []
    let roomAcceptedArr: any = []
    let sumLike = 0
    let requestNum = 0
    let sumPrice = 0
    let totalAcceptedRequest = 0
    let colors = ['#EC5858', '#585aaa', '#fd3a69', '#fecd1a', '#595b83', '#16a596', '#f9813a']
    let backgroundColor: any = []
    let num = 0
    const renderChartData = () => {
        for (let i = 0; i < roomInfo.length; i++) {
            roomNameArr[i] = roomInfo[i].space_name
            if (num < 5) {
                backgroundColor[i] = colors[num]
                num += 1
            } else {
                num = 0
            }
            roomPriceArr[i] = 0
            roomLikeArr[i] = 0
            roomRequestArr[i] = 0
            roomAcceptedArr[i] = 0
            sumLike += roomInfo[i].like.length
            roomLikeArr[i] += roomInfo[i].like.length
            requestNum += roomInfo[i].request.length
            roomRequestArr[i] += roomInfo[i].request.length
            let acceptedPrice = roomInfo[i].request.filter((e: any) => e.status !== "pending" && e.status !== "rejected")
            totalAcceptedRequest += acceptedPrice.length
            roomAcceptedArr[i] += acceptedPrice.length
            for (let price of acceptedPrice) {
                
                if (year === new Date(price.timeSlot[0].date).getFullYear()) {
                    sumPrice += price.price
                    roomPriceArr[i] += price.price
                    let month = new Date(price.timeSlot[0].date).getMonth()
                    monthlyPrices[month] += price.price
                }

            }
            for (let eachRoomRequest of roomInfo[i].request) {
                if (year === new Date(eachRoomRequest.timeSlot[0].date).getFullYear()) {
                    let month = new Date(eachRoomRequest.timeSlot[0].date).getMonth()
                    monthlyRequest[month] += 1
                }

            }
        }
    }
    renderChartData()
    const onSubmitYear = (e: any) => {
        e.preventDefault()
        renderChartData()
    }

    const dataPrice = {
        labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        datasets: [
            {
                label: `Revenue for ${year} (M)`,
                data: monthlyPrices,
                borderColor: '#556052',
                backgroundColor: '#EC5858',
                pointBorderColor: '#8DB596',
                pointBackgroundColor: '#FFE05D',
                pointBorderWidth: 5,
                fontSize: 16,
            }
        ]
    }
    const dataRequest = {
        labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        datasets: [
            {
                label: `Number of requests for ${year} (M)`,
                data: monthlyRequest,
                borderColor: '#8db596',
                backgroundColor: '#585aaa',
                pointBorderColor: '#8db596',
                pointBackgroundColor: '#ffe05d',
                pointBorderWidth: 10,
            }
        ],
    }
    let optionsPrice = {
        title: {
            display: true,
            text: "Total Revenue",
            fontSize: 20,
            responsive: true,
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        min: 0,
                        max: Math.ceil((sumPrice + 1000) / 100) * 100,
                        stepSize: 500,
                        fontSize: 18
                    }
                }
            ],
            xAxes: [{
                ticks: {
                    fontSize: 20,
                    autoSkip: false,
                    maxRotation: 180,
                    minRotation: 0
                }
            }]
        },
        options: {
            legend: {
                "display": true,
                "labels": {
                    "fontSize": 20,
                }
            },
            responsive: true,
        },
    }
    let optionsRequest = {
        title: {
            display: true,
            text: "Total Number of Bookings made by Visitors",
            fontSize: 20,
            responsive: true,
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        min: 0,
                        max: requestNum + 5,
                        stepSize: 5,
                        fontSize: 16,
                    }
                }
            ],
            xAxes: [{
                ticks: {
                    fontSize: 20,
                    autoSkip: false,
                    maxRotation: 180,
                    minRotation: 0
                }
            }]
        },
        options: {
            legend: {
                "display": true,
                "labels": {
                    "fontSize": 20,
                }
            },
            responsive: true,
        },
    }
    let pieLike = {
        title: {
            display: true,
            text: "Bookmarks from Visitors",
            fontSize: 16,
            responsive: true,
        },
        legend: {
            display: true,
            labels: {
                fontSize: 16
            }
        },
        maintainAspectRatio: false,
        responsive: true
    }
    const dataPieLike = {
        datasets: [{
            data: roomLikeArr,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            pointBorderColor: backgroundColor,
            pointBackgroundColor: backgroundColor,
            pointBorderWidth: 5,
            fontSize: 20
        }

        ],
        labels: roomNameArr

    };
    let piePrice = {
        title: {
            display: true,
            text: "Total Revenue",
            fontSize: 16,
            responsive: true,
        },
        legend: {
            display: true,
            labels: {
                fontSize: 16
            }
        },
        maintainAspectRatio: false,
        responsive: true,
    }
    const dataPiePrice = {
        datasets: [{
            data: roomPriceArr,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            pointBorderColor: backgroundColor,
            pointBackgroundColor: backgroundColor
        }

        ],
        labels: roomNameArr
    };
    let pieRequest = {
        title: {
            display: true,
            text: "Total Requests from Visitors",
            fontSize: 16,
            responsive: true,
        },
        legend: {
            display: true,
            labels: {
                fontSize: 16
            }
        },
        maintainAspectRatio: false,
        responsive: true,
    }
    const dataPieRequest = {
        datasets: [{
            data: roomRequestArr,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            pointBorderColor: backgroundColor,
            pointBackgroundColor: backgroundColor
        }
        ],
        labels: roomNameArr
    };

    let pieAcceptedRequest = {
        title: {
            display: true,
            text: "Total Requests from Visitors (Accepted)",
            fontSize: 16,
            responsive: true,
        },
        legend: {
            display: true,
            labels: {
                fontSize: 16
            }
        },
        maintainAspectRatio: false,
        responsive: true,
    }
    const dataPieAcceptedRequest = {
        datasets: [{
            data: roomAcceptedArr,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            pointBorderColor: backgroundColor,
            pointBackgroundColor: backgroundColor
        }
        ],
        labels: roomNameArr
    };
    return (
        <>
            <div className={styles.enterYearChart}>
                <form onSubmit={onSubmitYear}>
                    <TextField size="small" label="Choose Year" variant="outlined" type="number" inputProps={{ max: `${new Date().getFullYear()}` }} onChange={(e) => setYear(parseInt(e.target.value))} value={year} />
                </form>
            </div>

            <div className={styles.chart_summary}>
                <div className={styles.bardata}>
                    <Bar data={dataPrice} options={optionsPrice} />
                </div>
                <div className={styles.bardata}>
                    <Bar data={dataRequest} options={optionsRequest} />
                </div>
            </div>

            <div className={styles.pieChart}>
                <div className={styles.pieChartEach}>
                    <Doughnut data={dataPieLike} options={pieLike} />
                    <div>Total Likes: {sumLike}</div>
                </div>
                <div className={styles.pieChartEach}>
                    <Doughnut data={dataPieRequest} options={pieRequest} />
                    <div>Total Requests: {requestNum}</div>
                </div>
            </div>
            <div className={styles.pieChart}>
                <div className={styles.pieChartEach}>
                    <Doughnut data={dataPieAcceptedRequest} options={pieAcceptedRequest} />
                    <div>Total Accepted Requests: {totalAcceptedRequest}</div>
                </div>
                <div className={styles.pieChartEach}>
                    <Doughnut data={dataPiePrice} options={piePrice} />
                    <div>Total Revenue: ${sumPrice}</div>
                </div>
            </div>
        </>
    )
}

export default SummaryChart
