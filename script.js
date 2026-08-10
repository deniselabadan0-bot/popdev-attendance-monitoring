/* =========================================
   POPDEV ATTENDANCE TRACKER
   MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   PASSWORDS
   =========================================

   TEMPORARY PLACEHOLDERS ONLY.

   We will replace these later with the
   actual secure login/database system.
   ========================================= */

const LEADERS_PASSWORD = "LEADER_PASSWORD";
const PRESIDENT_PASSWORD = "PRESIDENT_PASSWORD";


/* =========================================
   MONITORING PERIOD
   ========================================= */

const START_DATE = new Date(2026, 7, 10);
const END_DATE = new Date(2027, 7, 10);


/* =========================================
   POPDEV MEMBERS
   ========================================= */

const areas = {

    principal: {
        name: "Principal's Office → SNED Area",
        shortName: "Principal's Office → SNED",
        leader: "Princess Elsie",

        members: [
            "Mary Cahoy",
            "Justin Cyrus",
            "AJ",
            "Princess Elsie",
            "Allysa Casiño",
            "Eunice Narvaez",
            "Angel Angcopa",
            "Angelo Saluna"
        ]
    },


    ground: {
        name: "Ground Floor Area",
        shortName: "Ground Floor",
        leader: "Ericalyn Pagente",

        members: [
            "Brylle Zamora",
            "Jlay Ragasajo",
            "Cherry Fe",
            "Raul Pitt",
            "Daph Daph",
            "Jezel Orong",
            "Precious Denise Tadena",
            "Jheliane Omac",
            "Maxene Nadela",
            "Ericalyn Pagente",
            "Fhianna Kzh Come"
        ]
    },


    building13: {
        name: "Building 13 Area",
        shortName: "Building 13",
        leader: "Shubie Gulbin",

        members: [
            "Jovel Pagalan",
            "Maria Fe Wabe",
            "Justin Durian",
            "Keziah Hernando",
            "Savannah Generoso",
            "Scarlet Pontillas",
            "Ritche Valenzuela",
            "Shubie Gulbin",
            "Crystal Orong",
            "Jandi"
        ]
    },


    building14: {
        name: "Building 14 Area",
        shortName: "Building 14",
        leader: "Kate Sumaylo",

        members: [
            "Kate Sumaylo",
            "Khryzel Amahoy",
            "Michael Angelo",
            "Psycha Llamos",
            "Princess Rheanne",
            "Renz Basahon",
            "Simon Damiles",
            "Zyca Bacas"
        ]
    }

};


/* =========================================
   GLOBAL VARIABLES
   ========================================= */

let selectedArea = "principal";

let currentWeekStart = new Date(START_DATE);

let loggedIn = false;

let userRole = null;


/* =========================================
   ELEMENTS
   ========================================= */

const loginScreen =
    document.getElementById("loginScreen");

const app =
    document.getElementById("app");

const passwordInput =
    document.getElementById("passwordInput");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");

const logoutButton =
    document.getElementById("logoutButton");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const selectedAreaTitle =
    document.getElementById("selectedAreaTitle");

const selectedAreaLeader =
    document.getElementById("selectedAreaLeader");

const currentWeekLabel =
    document.getElementById("currentWeekLabel");

const todayDate =
    document.getElementById("todayDate");

const previousWeekButton =
    document.getElementById("previousWeek");

const nextWeekButton =
    document.getElementById("nextWeek");

const remarksInput =
    document.getElementById("remarksInput");

const saveRemarks =
    document.getElementById("saveRemarks");

const totalMembersElement =
    document.getElementById("totalMembers");

const totalPresentElement =
    document.getElementById("totalPresent");

const totalAbsentElement =
    document.getElementById("totalAbsent");

const attendanceRateElement =
    document.getElementById("attendanceRate");

const areaSummaries =
    document.getElementById("areaSummaries");


/* =========================================
   LOCAL STORAGE
   =========================================

   This is temporary storage for testing.

   Later, this will be replaced with shared
   online database storage so all leaders
   can access the same records.
   ========================================= */

let attendanceData =
    JSON.parse(
        localStorage.getItem("popdevAttendance")
    ) || {};

let remarksData =
    JSON.parse(
        localStorage.getItem("popdevRemarks")
    ) || {};


/* =========================================
   SAVE DATA
   ========================================= */

function saveAttendanceData() {

    localStorage.setItem(
        "popdevAttendance",
        JSON.stringify(attendanceData)
    );
}


function saveRemarksData() {

    localStorage.setItem(
        "popdevRemarks",
        JSON.stringify(remarksData)
    );
}


/* =========================================
   DATE HELPERS
   ========================================= */

function formatDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}


function dateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function addDays(date, amount) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + amount
    );

    return result;
}


/* =========================================
   WEEK HELPERS
   ========================================= */

function getWeekDates(startDate) {

    const dates = [];

    for (let i = 0; i < 5; i++) {

        dates.push(
            addDays(startDate, i)
        );
    }

    return dates;
}


function isWithinMonitoringPeriod(date) {

    return (
        date >= START_DATE &&
        date <= END_DATE
    );
}


function getWeekNumber(startDate) {

    const difference =
        startDate - START_DATE;

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    return Math.floor(days / 7) + 1;
}


/* =========================================
   TODAY
   ========================================= */

function updateTodayDisplay() {

    const today =
        new Date();

    todayDate.textContent =
        formatDate(today);
}


/* =========================================
   WEEK DISPLAY
   ========================================= */

function updateWeekDisplay() {

    const dates =
        getWeekDates(
            currentWeekStart
        );

    const weekNumber =
        getWeekNumber(
            currentWeekStart
        );

    const validDates =
        dates.filter(
            isWithinMonitoringPeriod
        );

    if (validDates.length === 0) {
        return;
    }

    const firstDate =
        validDates[0];

    const lastDate =
        validDates[
            validDates.length - 1
        ];

    currentWeekLabel.textContent =
        `Week ${weekNumber} • ` +
        `${formatDate(firstDate)} – ` +
        `${formatDate(lastDate)}`;

    updateTableHeaderDates(
        dates
    );

    renderAttendanceTable();

    loadRemarks();
}


function updateTableHeaderDates(dates) {

    const headers =
        document.querySelectorAll(
            ".attendance-table thead th"
        );

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        if (!headers[i + 2]) {
            continue;
        }

        const date =
            dates[i];

        const small =
            headers[i + 2]
                .querySelector("small");

        if (!isWithinMonitoringPeriod(date)) {

            headers[i + 2].style.opacity =
                "0.35";

            if (small) {
                small.textContent =
                    "No monitoring";
            }

        } else {

            headers[i + 2].style.opacity =
                "1";

            if (small) {
                small.textContent =
                    date.toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric"
                        }
                    );
            }
        }
    }
}


/* =========================================
   ATTENDANCE TABLE
   ========================================= */

function renderAttendanceTable() {

    const area =
        areas[selectedArea];

    if (!area) {
        return;
    }

    selectedAreaTitle.textContent =
        area.name;

    selectedAreaLeader.textContent =
        `Leader: ${area.leader}`;

    attendanceTableBody.innerHTML = "";

    const dates =
        getWeekDates(
            currentWeekStart
        );

    area.members.forEach(
        (member, index) => {

            const row =
                document.createElement("tr");

            if (
                member.toLowerCase() ===
                area.leader.toLowerCase()
            ) {

                row.classList.add(
                    "leader-row"
                );
            }


            const numberCell =
                document.createElement("td");

            numberCell.textContent =
                index + 1;


            const memberCell =
                document.createElement("td");

            memberCell.textContent =
                member;


            row.appendChild(
                numberCell
            );

            row.appendChild(
                memberCell
            );


            dates.forEach(
                date => {

                    const cell =
                        document.createElement("td");

                    if (
                        !isWithinMonitoringPeriod(
                            date
                        )
                    ) {

                        cell.textContent = "—";

                        cell.style.color =
                            "#a0aaa4";

                        row.appendChild(cell);

                        return;
                    }


                    const checkbox =
                        document.createElement(
                            "input"
                        );

                    checkbox.type =
                        "checkbox";

                    checkbox.className =
                        "attendance-checkbox";


                    const key =
                        createAttendanceKey(
                            selectedArea,
                            member,
                            date
                        );


                    checkbox.checked =
                        attendanceData[key] === true;


                    checkbox.addEventListener(
                        "change",
                        function () {

                            attendanceData[key] =
                                checkbox.checked;

                            saveAttendanceData();

                            updateSummary();
                        }
                    );


                    cell.appendChild(
                        checkbox
                    );

                    row.appendChild(
                        cell
                    );
                }
            );


            attendanceTableBody.appendChild(
                row
            );

        }
    );
}


/* =========================================
   ATTENDANCE KEY
   ========================================= */

function createAttendanceKey(
    areaId,
    member,
    date
) {

    return [
        areaId,
        member,
        dateKey(date)
    ].join("|");
}


/* =========================================
   AREA SELECTION
   ========================================= */

function selectArea(areaId) {

    if (!areas[areaId]) {
        return;
    }

    selectedArea =
        areaId;

    document
        .querySelectorAll(".area-card")
        .forEach(card => {

            card.classList.toggle(
                "selected",
                card.dataset.area === areaId
            );

        });

    renderAttendanceTable();

    loadRemarks();
}


/* =========================================
   AREA CARD EVENTS
   ========================================= */

document
    .querySelectorAll(".area-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                selectArea(
                    card.dataset.area
                );

            }
        );

    });


/* =========================================
   WEEK NAVIGATION
   ========================================= */

previousWeekButton.addEventListener(
    "click",
    function () {

        const previous =
            addDays(
                currentWeekStart,
                -7
            );

        if (
            previous >= START_DATE
        ) {

            currentWeekStart =
                previous;

            updateWeekDisplay();
        }
    }
);


nextWeekButton.addEventListener(
    "click",
    function () {

        const next =
            addDays(
                currentWeekStart,
                7
            );

        if (
            next <= END_DATE
        ) {

            currentWeekStart =
                next;

            updateWeekDisplay();
        }
    }
);


/* =========================================
   REMARKS
   ========================================= */

function createRemarksKey() {

    return [
        selectedArea,
        dateKey(currentWeekStart)
    ].join("|");
}


function loadRemarks() {

    const key =
        createRemarksKey();

    remarksInput.value =
        remarksData[key] || "";
}


saveRemarks.addEventListener(
    "click",
    function () {

        const key =
            createRemarksKey();

        remarksData[key] =
            remarksInput.value;

        saveRemarksData();

        alert(
            "Remarks saved successfully."
        );
    }
);


/* =========================================
   PASSWORD VISIBILITY
   ========================================= */

togglePassword.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "🙈";

        } else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "👁";
        }
    }
);


/* =========================================
   LOGIN
   ========================================= */

function login() {

    const password =
        passwordInput.value.trim();


    if (
        password ===
        LEADERS_PASSWORD
    ) {

        loggedIn = true;

        userRole =
            "leader";

        openApplication();

        return;
    }


    if (
        password ===
        PRESIDENT_PASSWORD
    ) {

        loggedIn = true;

        userRole =
            "president";

        openApplication();

        return;
    }


    loginMessage.textContent =
        "Incorrect password. Please try again.";

    passwordInput.value = "";
}


loginButton.addEventListener(
    "click",
    login
);


passwordInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            login();
        }

    }
);


/* =========================================
   OPEN APPLICATION
   ========================================= */

function openApplication() {

    loginScreen.classList.add(
        "hidden"
    );

    app.classList.remove(
        "hidden"
    );

    loginMessage.textContent = "";

    passwordInput.value = "";


    configureRoleAccess();

    updateTodayDisplay();

    updateWeekDisplay();

    generateWeeks();

    updateSummary();
}


/* =========================================
   ROLE ACCESS
   ========================================= */

function configureRoleAccess() {

    const summaryButton =
        document.getElementById(
            "summaryNavButton"
        );


    if (
        userRole ===
        "president"
    ) {

        /*
         President password:
         Summary dashboard only.
        */

        summaryButton.style.display =
            "block";

        showSection(
            "summary"
        );

    } else {

        /*
         Leaders password:
         Detailed monitoring.
        */

        summaryButton.style.display =
            "none";

        showSection(
            "monitoring"
        );
    }
}


/* =========================================
   LOGOUT
   ========================================= */

logoutButton.addEventListener(
    "click",
    function () {

        loggedIn = false;

        userRole = null;

        app.classList.add(
            "hidden"
        );

        loginScreen.classList.remove(
            "hidden"
        );

        passwordInput.value = "";

    }
);


/* =========================================
   NAVIGATION
   ========================================= */

document
    .querySelectorAll(".nav-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const section =
                    button.dataset.section;

                showSection(
                    section
                );

            }
        );

    });


function showSection(sectionName) {

    document
        .querySelectorAll(".content-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(
            sectionName + "Section"
        );

    if (target) {

        target.classList.add(
            "active-section"
        );
    }


    const activeButton =
        document.querySelector(
            `.nav-button[data-section="${sectionName}"]`
        );

    if (activeButton) {

        activeButton.classList.add(
            "active"
        );
    }


    if (
        sectionName ===
        "summary"
    ) {

        updateSummary();
    }
}


/* =========================================
   GENERATE WEEK LIST
   ========================================= */

function generateWeeks() {

    const container =
        document.getElementById(
            "weeksContainer"
        );

    container.innerHTML = "";

    let weekStart =
        new Date(START_DATE);

    let weekNumber = 1;


    while (
        weekStart <= END_DATE
    ) {

        const weekDates =
            getWeekDates(
                weekStart
            );

        const validDates =
            weekDates.filter(
                isWithinMonitoringPeriod
            );

        if (
            validDates.length === 0
        ) {
            break;
        }


        const card =
            document.createElement(
                "div"
            );

        card.className =
            "week-card";


        const firstDate =
            validDates[0];

        const lastDate =
            validDates[
                validDates.length - 1
            ];


        card.innerHTML = `
            <h3>Week ${weekNumber}</h3>
            <
