let arrTemp = Array(11).fill(0);
let arrHumidity = Array(11).fill(0);
let arrLight = Array(11).fill(0);
let arrDust = Array(11).fill(0);

let newdata;
const tempArrBg = [0, 20, 40, 60, 80, 100]
const humiArrBg = [0, 20, 40, 60, 80, 100]
const lightArrBg = [0, 400, 800, 900, 1000, 1200]
const dustArrBg = [0, 2, 4, 6, 8, 10]


const tempLevel = [
    "#FFCFCF",
    "#FFA6A6",
    "#FF7D7D",
    "#FF5454",
    "#FF2B2B",
    "#FF0000"
]

const humidLevel = [
    "#AEDFF7",
    "#7EC0EE",
    "#4FA4D6",
    "#2587B8",
    "#0C6EAA",
    "#005896"
]

const lightLevel = [
    "#FFD700",
    "#FFFF00",
    "#FFFACD",
    "#F0E68C",
    "#FFEFD5",
    "#FFFFE0",
]
const dustLevel = [
    "#E0F2F1",
    "#B2DFDB",
    "#66B2B2",
    "#008080",
    "#004C4C",
    "#002626",
]
document.addEventListener("DOMContentLoaded", function () {
    // xử lý dữ liệu ở actionhistory................................
    let led1 = false;
    let led2 = false;

    const led1btn = document.getElementById('light_switch');
    const led2btn = document.getElementById('fan_switch');


    led1btn.addEventListener("change", function () {
        let preled1 = led1;
        led1 = !led1;
        const tmp = {
            l1: led1 ? 1 : 0,
            l2: led2 ? 1 : 0,

        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmp)
        };
        fetch('http://localhost:8080/mqtt/pub', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Gọi API thất bại với mã lỗi: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    return null;
                }
                return response.json();
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
        setTimeout(
            function fetchallactions() {
                fetch('http://localhost:8080/mqtt/allaction')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Gọi API thất bại với mã lỗi: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data[data.length - 1].led1 != preled1) {
                            if (led1) {
                                document.getElementById('bulb_icon').style.color = 'yellow';
                            }
                            else {
                                document.getElementById('bulb_icon').style.color = 'black';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi:', error);
                    })
            }
            , 3000);
    });
    led2btn.addEventListener("change", function () {
        let preled2 = led2;
        led2 = !led2;
        const tmp = {
            l1: led1 ? 1 : 0,
            l2: led2 ? 1 : 0,

        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmp)
        };
        fetch('http://localhost:8080/mqtt/pub', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Gọi API thất bại với mã lỗi: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    return null;
                }
                return response.json();
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
        setTimeout(
            function fetchallactions() {
                fetch('http://localhost:8080/mqtt/allaction')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Gọi API thất bại với mã lỗi: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data[data.length - 1].led2 != preled2) {
                            if (led2) {
                                document.querySelector('.ceiling_fan').style.animation = "spin 0.5s linear infinite";
                            }
                            else {
                                document.querySelector(".ceiling_fan").style.animation = null;
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi:', error);
                    })
            }
            , 3000);
    });

    // xử lý dữ liệu ở home.................................................

    function myTemp() {
        fetch('http://localhost:8080/mqtt/newsensor')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Gọi API thất bại với mã lỗi: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                newdata = data;
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        if (newdata) {
            rdTemp = newdata.temp;
            rdHumidity = newdata.humidity;
            rdLight = newdata.light;
            rdDust = newdata.dust
        } else {
            rdTemp = 0;
            rdHumidity = 0;
            rdLight = 0;
            rdDust = 0;
        }
        let tmp = false;
        function warnning() {
            if (rdDust >= 7) {
                tmp = !tmp
                if (tmp) {
                    document.getElementById('bulb_icon').style.color = 'yellow';
                    document.querySelector('.ceiling_fan').style.animation = "spin 0.5s linear infinite";
                }
                else {
                    document.getElementById('bulb_icon').style.color = 'black';
                    document.querySelector(".ceiling_fan").style.animation = null;
                }
            }
            else {
                tmp = false;
                document.getElementById('bulb_icon').style.color = 'black';
                document.querySelector(".ceiling_fan").style.animation = null;
            }
        }
        setInterval(warnning, 500);
        arrTemp.shift();
        arrHumidity.shift();
        arrLight.shift();
        arrDust.shift();

        arrTemp.push(rdTemp);
        arrHumidity.push(rdHumidity);
        arrLight.push(rdLight);
        arrDust.push(rdDust)

        data1.datasets[0].data = arrDust;
        data1.datasets[1].data = arrTemp;
        data2.datasets[0].data = arrHumidity;
        data2.datasets[1].data = arrLight;


        document.getElementById("temp").innerHTML = rdTemp + "°C";
        document.getElementById("humidity").innerHTML = rdHumidity + "%";
        document.getElementById("light").innerHTML = rdLight + "Lux";
        document.getElementById("dust").innerHTML = rdDust;




        for (let i = 0; i < 5; i++) {
            if (rdTemp > tempArrBg[i] && rdTemp <= tempArrBg[i + 1]) {
                document.getElementById("item_temp").style.background = `linear-gradient(${tempLevel[i]},${tempLevel[i + 1]})`;
            }
        }
        for (let i = 0; i < 5; i++) {
            if (rdHumidity > humiArrBg[i] && rdHumidity <= humiArrBg[i + 1]) {
                document.getElementById("item_humidity").style.background = `linear-gradient(${humidLevel[i]},${humidLevel[i + 1]})`;
            }
        }
        for (let i = 0; i < 5; i++) {
            if (rdLight > lightArrBg[i] && rdLight <= lightArrBg[i + 1]) {
                document.getElementById("item_light").style.background = `linear-gradient(${lightLevel[i]},${lightLevel[i + 1]})`;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (rdDust > dustArrBg[i] && rdDust <= dustArrBg[i + 1]) {
                document.getElementById("item_dust").style.background = `linear-gradient(${dustLevel[i]},${dustLevel[i + 1]})`;
            }
        }
        chart1.update();
        chart2.update();
    }
    setInterval(myTemp, 2000);
    const labels = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20'];
    let data1 = {
        labels: labels,
        datasets: [
            {
                label: 'Dust',
                backgroundColor: "green",
                borderColor: 'green',
                data: arrDust,
                tension: 0.4
            },
            {
                label: 'Temp',
                backgroundColor: "red",
                borderColor: 'red',
                data: arrTemp,
                tension: 0.4
            },

        ],
    }

    let data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Humidity',
                backgroundColor: "blue",
                borderColor: 'blue',
                data: arrHumidity,
                tension: 0.4
            },
            {
                label: 'Light',
                backgroundColor: "yellow",
                borderColor: 'yellow',
                data: arrLight,
                tension: 0.4
            },

        ],
    }


    let config1 = {
        type: 'line',
        data: data1,
    }
    const canvas1 = document.getElementById('myChart1');
    const chart1 = new Chart(canvas1, config1);

    let config2 = {
        type: 'line',
        data: data2,
    }
    const canvas2 = document.getElementById('myChart2');
    const chart2 = new Chart(canvas2, config2);

});


// ...................................



