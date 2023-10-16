let actionhtr = [];

const dsli = document.getElementById('list_li');
const cnt = document.getElementById('getactiontbody');

const sortbytimeaction = document.getElementById('sort-time-action');

const findbyswitch = document.getElementById('find_submit1');
const led1switch = document.getElementById('value_select1');
const led2switch = document.getElementById('value_select2');

const findbytimeaction = document.getElementById('time_submit1');
const timestart1 = document.getElementById('my-input-date1');
const timeend1 = document.getElementById('my-input-date2');

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
        const response = await fetch('http://localhost:8080/mqtt/allaction');
        const data = await response.json();
        actionhtr = data;
        callback(actionhtr);
    } catch (error) {
        console.error('Lỗi:', error);
    }
}
fetchData(function (data) {
    let stateAction = actionhtr;
    let perPage = 7;
    let totalPages = Math.ceil(actionhtr.length / perPage);
    let currentPage = 1;
    let start = 0;
    let end = perPage;
    let checkt = 0;
    const btnPrev = document.getElementById('prev_click');
    const btnNext = document.getElementById('next_click');

    function renderPage(page) {
        totalPages = Math.ceil(stateAction.length / perPage)
        dsli.textContent = "";
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                let li = document.createElement('li');
                let ta = document.createElement('a');
                ta.classList.add('page-link');
                ta.id = 'pagea' + i;
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
                litag += `<li><a class="page-link" id="pagea1">1<a/></li>`;
                litag += `<li><a class="page-link" id="pagea2">2<a/></li>`;
                litag += `<li><a class="page-link" id="pagea3">3<a/></li>`;
                litag += `<li><a class="page-link" id="pagea4">4<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="pagea${totalPages}" >${totalPages}<a/></li>`;
            }
            else if (page <= totalPages - 3) {
                litag += `<li><a class="page-link" id="pagea1">1<a/></li>`;
                litag += `<li><a class="page-link" id="pagea2">2<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="pagea${beforePage}">${beforePage}<a/></li>`;
                litag += `<li><a class="page-link" id="pagea${page}">${page}<a/></li>`;
                litag += `<li><a class="page-link" id="pagea${afterPage}">${afterPage}<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="pagea${totalPages - 1}" >${totalPages - 1}<a/></li>`;
                litag += `<li><a class="page-link" id="pagea${totalPages}" >${totalPages}<a/></li>`;
            }
            else {
                litag += `<li><a class="page-link" id="pagea1">1<a/></li>`;
                litag += `<li><div style="width: 40px; color: black;">. . .<div/></li>`;
                litag += `<li><a class="page-link" id="pagea${totalPages - 3}" >${totalPages - 3}<a/></li>`;
                litag += `<li><a class="page-link" id="pagea${totalPages - 2}" >${totalPages - 2}<a/></li>`;
                litag += `<li><a class="page-link" id="pagea${totalPages - 1}" >${totalPages - 1}<a/></li>`;
                litag += `<li><a class="page-link" id="pagea${totalPages}" >${totalPages}<a/></li>`;
            }
            dsli.innerHTML = litag;
        }
    }
    renderPage(currentPage)

    function renderData(arr) {
        cnt.textContent = "";
        arr.map((item, index) => {
            if (index >= start && index < end) {
                let tr = document.createElement('tr');
                for (let key in item) {
                    let td = document.createElement('td');
                    if (key === 'id') td.classList.add('col-2');
                    else if (key === 'tght') td.classList.add('col-4');
                    else td.classList.add('col-3');
                    td.setAttribute('scope', 'col');
                    if (key === 'stateled') {
                        td.textContent = item[key] ? 'ON' : 'OFF';
                    }
                    else td.textContent = item[key];
                    tr.appendChild(td);
                }
                cnt.appendChild(tr);
            }
        })
    }
    document.getElementById('pagea1').style.background = '#7ae6d7';
    renderData(stateAction)

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
        document.getElementById('pagea' + currentPage).style.background = '#7ae6d7';
        renderData(stateAction)
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
        document.getElementById('pagea' + currentPage).style.background = '#7ae6d7';
        renderData(stateAction)
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
                document.getElementById('pagea' + currentPage).style.background = '#7ae6d7';

                renderData(stateAction)

            });
        });
    }
    changePage()

    sortbytimeaction.addEventListener('click', () => {
        checkt++;
        stateAction = actionhtr.sort((p1, p2) => {
            if (checkt % 2 == 0) {
                return convertStringToDate(p1.tght) - convertStringToDate(p2.tght);
            }
            else return convertStringToDate(p2.tght) - convertStringToDate(p1.tght);
        })
        currentPage = 1
        renderData(stateAction)
        renderPage(currentPage)
        changePage()
        if (stateAction.length > 0) document.getElementById('pagea1').style.background = '#7ae6d7';
    })

    // tìm kiếm theo trang thái led ..........................................
    // findbyswitch.addEventListener('click', () => {
    //     stateAction = actionhtr.filter(e => e.led1 == led1switch.value && e.led2 == led2switch.value);
    //     start = 0
    //     end = perPage
    //     renderData(stateAction)
    //     currentPage = 1
    //     renderPage(currentPage)
    //     changePage()
    //     if (stateAction.length > 0) document.getElementById('pagea1').style.background = '#7ae6d7';
    // })

    // tìm kiếm theo thời gian ..................................................

    findbytimeaction.addEventListener('click', () => {
        console.log(1)
        let startt = new Date(timestart1.value + "T00:00:00.000")
        let endt = new Date(timeend1.value + "T23:59:59.000")
        stateAction = actionhtr.filter(e => convertStringToDate(e.tght) >= startt && convertStringToDate(e.tght) <= endt)
        currentPage = 1
        renderData(stateAction)
        renderPage(currentPage)
        changePage()
        if (stateAction.length > 0) document.getElementById('pagea1').style.background = '#7ae6d7';
    })
})
