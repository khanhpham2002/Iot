let dataseekers = [];
const databodyid = document.getElementById('dataseeker_tbody');
const dsli = document.getElementById('list_li');

const sortbytemp = document.getElementById('sort-click-temp');
const sortbyhumi = document.getElementById('sort-click-humi');
const sortbylight = document.getElementById('sort-click-light');
const sortbydust = document.getElementById('sort-click-dust');

const sortbytime = document.getElementById('sort-click-time');

const findsensor = document.getElementById('find_submit');
const findvalue = document.getElementById('find_value');
const selectvalue = document.getElementById('value_select');

const timestart = document.getElementById('my-input-date1');
const timeend = document.getElementById('my-input-date2');
const findbytime = document.getElementById('time_submit');

// const findbydatetime = document.getElementById('my-input-date3');
// const findbytime1 = document.getElementById('time_submit1');

function convertStringToDate(dateTimeString) {
    var parts = dateTimeString.split(/[\/ :]/);
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]) - 1; // Trừ 1 vì tháng trong JavaScript bắt đầu từ 0
    var year = parseInt(parts[2]);
    var hours = parseInt(parts[3]);
    var minutes = parseInt(parts[4]);
    var seconds = parseInt(parts[5]);

    return new Date(year, month, day, hours, minutes, seconds);
}
async function fetchData(callback) {
    try {
        const response = await fetch('http://localhost:8080/mqtt/allsensor');
        const data = await response.json();
        dataseekers = data;
        callback(dataseekers);
    } catch (error) {
        console.error('Lỗi:', error);
    }
}
fetchData(function (data) {
    let checkt = 0, checkhm = 0, checkl = 0, checktime = 0;
    let stateSensor = dataseekers;
    let perPage = 7;
    let totalPages = Math.ceil(stateSensor.length / perPage);
    let currentPage = 1;
    let start = 0;
    let end = perPage;
    const btnPrev = document.getElementById('prev_click');
    const btnNext = document.getElementById('next_click');

    function renderPage(page) {
        totalPages = Math.ceil(stateSensor.length / perPage)
        dsli.textContent = "";
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                let li = document.createElement('li');
                let ta = document.createElement('a');
                ta.classList.add('page-link');
                ta.id = 'page' + i;
                ta.textContent = i;
                li.appendChild(ta);
                dsli.appendChild(li);
            }
        }
        else {
            let litag = '';
            let beforePage = page - 1;
            let afterPage = page + 1;

            if (page <= 3) {
                litag += `<li><a class="page-link" id="page1">1<a/></li>`;
                litag += `<li><a class="page-link" id="page2">2<a/></li>`;
                litag += `<li><a class="page-link" id="page3">3<a/></li>`;
                litag += `<li><a class="page-link" id="page4">4<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="page${totalPages}" >${totalPages}<a/></li>`;
            }
            else if (page <= totalPages - 3) {
                litag += `<li><a class="page-link" id="page1">1<a/></li>`;
                litag += `<li><a class="page-link" id="page2">2<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="page${beforePage}">${beforePage}<a/></li>`;
                litag += `<li><a class="page-link" id="page${page}">${page}<a/></li>`;
                litag += `<li><a class="page-link" id="page${afterPage}">${afterPage}<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="page${totalPages - 1}" >${totalPages - 1}<a/></li>`;
                litag += `<li><a class="page-link" id="page${totalPages}" >${totalPages}<a/></li>`;
            }
            else {
                litag += `<li><a class="page-link" id="page1">1<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="page${totalPages - 3}" >${totalPages - 3}<a/></li>`;
                litag += `<li><a class="page-link" id="page${totalPages - 2}" >${totalPages - 2}<a/></li>`;
                litag += `<li><a class="page-link" id="page${totalPages - 1}" >${totalPages - 1}<a/></li>`;
                litag += `<li><a class="page-link" id="page${totalPages}" >${totalPages}<a/></li>`;
            }
            dsli.innerHTML = litag;
        }
    }
    renderPage(currentPage)

    function renderData(arr) {
        databodyid.textContent = "";
        arr.map((item, index) => {
            if (index >= start && index < end) {
                console.log(start)
                console.log(end)
                let tr = document.createElement('tr');
                for (let key in item) {
                    let td = document.createElement('td');
                    if (key === "id") td.classList.add('col-1');
                    else if (key === "ctime") td.classList.add('col-3');
                    else if (key === "humidity") td.classList.add('col-2');
                    else td.classList.add('col-2');
                    td.setAttribute('scope', 'col');
                    td.textContent = item[key];
                    tr.appendChild(td);
                }
                databodyid.appendChild(tr);

            }
        })
    }
    document.getElementById('page1').style.background = '#7ae6d7';
    renderData(dataseekers)

    btnNext.addEventListener('click', () => {
        currentPage++;
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        start = (currentPage - 1) * perPage;
        end = currentPage * perPage;
        renderPage(currentPage)
        changePage()
        const setwhite = document.querySelectorAll('.number-page li a');
        setwhite.forEach(anchor => {
            anchor.style.background = '#fff';
        });
        document.getElementById('page' + currentPage).style.background = '#7ae6d7';
        renderData(stateSensor)

    })

    btnPrev.addEventListener('click', () => {
        currentPage--;
        if (currentPage <= 1) {
            currentPage = 1;
        }
        start = (currentPage - 1) * perPage;
        end = currentPage * perPage;
        renderPage(currentPage)
        changePage()
        const setwhite = document.querySelectorAll('.number-page li a');
        setwhite.forEach(anchor => {
            anchor.style.background = '#fff';
        });
        document.getElementById('page' + currentPage).style.background = '#7ae6d7';
        renderData(stateSensor)

    })


    function changePage() {
        const liElements = document.querySelectorAll('.number-page .page-link');
        liElements.forEach(li => {
            li.addEventListener('click', () => {
                const res = parseInt(li.textContent);
                currentPage = res;
                start = (currentPage - 1) * perPage;
                end = currentPage * perPage;
                renderPage(currentPage)
                changePage()
                const setwhite = document.querySelectorAll('.number-page li a');
                setwhite.forEach(anchor => {
                    anchor.style.background = '#fff';
                });
                document.getElementById('page' + currentPage).style.background = '#7ae6d7';

                renderData(stateSensor)

            });
        });
    }
    changePage()

    // sort........................................................................

    sortbytime.addEventListener('click', () => {
        checktime++;
        stateSensor = stateSensor.sort((p1, p2) => {
            if (checktime % 2 == 0) {
                return convertStringToDate(p1.ctime) - convertStringToDate(p2.ctime);
            }
            else return convertStringToDate(p2.ctime) - convertStringToDate(p1.ctime);
        })
        renderData(stateSensor)
    })

    sortbytemp.addEventListener('click', () => {
        checkt++;
        stateSensor = stateSensor.sort((p1, p2) => {
            if (checkt % 2 == 0) return p1.temp - p2.temp;
            else return p2.temp - p1.temp;
        })
        renderData(stateSensor)
    })

    sortbyhumi.addEventListener('click', () => {
        checkhm++;
        stateSensor = stateSensor.sort((p1, p2) => {
            if (checkhm % 2 == 0) return p1.humidity - p2.humidity;
            else return p2.humidity - p1.humidity;
        })
        renderData(stateSensor)
    })

    sortbylight.addEventListener('click', () => {
        checkl++;
        stateSensor = stateSensor.sort((p1, p2) => {
            if (checkl % 2 == 0) return p1.light - p2.light;
            else return p2.light - p1.light;
        })
        renderData(stateSensor)
    })

    sortbydust.addEventListener('click', () => {
        checkl++;
        stateSensor = stateSensor.sort((p1, p2) => {
            if (checkl % 2 == 0) return p1.dust - p2.dust;
            else return p2.dust - p1.dust;
        })
        renderData(stateSensor)
    })
    // tìm kiếm theo giá trị ............................................................

    findsensor.addEventListener('click', () => {
        if (selectvalue.value == "temp") stateSensor = dataseekers.filter(e => e.temp == findvalue.value)
        else if (selectvalue.value == "humidity") stateSensor = dataseekers.filter(e => e.humidity == findvalue.value)
        else if (selectvalue.value == "dust") stateSensor = dataseekers.filter(e => e.dust == findvalue.value)
        else stateSensor = dataseekers.filter(e => e.light == findvalue.value)
        start = 0
        end = perPage
        currentPage = 1
        renderData(stateSensor)
        renderPage(currentPage)
        changePage()
        if (stateSensor.length > 0) document.getElementById('page1').style.background = '#7ae6d7';
    })

    // tìm kiếm theo thời gian......................................................

    findbytime.addEventListener('click', () => {
        let startt = new Date(timestart.value + "T00:00:00.000")
        let endt = new Date(timeend.value + "T23:59:59.000")
        stateSensor = dataseekers.filter(e => convertStringToDate(e.ctime) >= startt && convertStringToDate(e.ctime) <= endt)
        currentPage = 1
        renderData(stateSensor)
        renderPage(currentPage)
        changePage()
        if (stateSensor.length > 0) document.getElementById('page1').style.background = '#7ae6d7';
    })

    // findbytime1.addEventListener('click', () => {
    //     stateSensor = dataseekers.filter(e => e.ctime == findbydatetime.value)
    //     currentPage = 1
    //     renderData(stateSensor)
    //     renderPage(currentPage)
    //     changePage()
    //     if (stateSensor.length > 0) document.getElementById('page1').style.background = '#7ae6d7';
    // })
});
