const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  eventColorInput = document.querySelector('.event-color'),
  addEventSubmit = document.querySelector(".add-event-btn ");
  

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];


document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.querySelector("#dateInput");
  const calendarIcon = document.querySelector("#calendarIcon");

  // Inicializar Flatpickr pero sin abrir al escribir
  const calendar = flatpickr(dateInput, {
    dateFormat: "d/m/Y",
    allowInput: true, // Permite escribir sin abrir el calendario automáticamente
    clickOpens: false, // Evita que el calendario se abra al escribir
  });

  // Abrir el calendario solo al hacer clic en el ícono
  calendarIcon.addEventListener("click", () => {
    calendar.open();
  });
});



const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2 || dateInput.value.length === 5) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 10) {
    dateInput.value = dateInput.value.slice(0, 10);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 6 || dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, dateInput.value.length - 1);
    }
  }
});

// Seleccionar un día desde el calendario
function selectDay(day) {
  activeDay = day;
  dateInput.value = `${activeDay < 10 ? '0' + activeDay : activeDay}/${month + 1 < 10 ? '0' + (month + 1) : month + 1}/${year}`;
}

// Evento del botón "Aceptar" para ir a la fecha ingresada
gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");

  // Validar el formato de la fecha
  if (dateArr.length === 3) {
    const inputDay = parseInt(dateArr[0], 10);
    const inputMonth = parseInt(dateArr[1], 10);
    const inputYear = parseInt(dateArr[2], 10);

    if (
      !isNaN(inputDay) &&
      !isNaN(inputMonth) &&
      !isNaN(inputYear) &&
      inputMonth > 0 &&
      inputMonth <= 12 &&
      inputYear > 0 &&
      inputDay > 0 &&
      inputDay <= new Date(inputYear, inputMonth, 0).getDate()
    ) {
      const newMonth = inputMonth - 1;
      const newYear = inputYear;

      // Si el mes y el año son los mismos, no redibujes el calendario
      if (newMonth === month && newYear === year) {
        activeDay = inputDay;
        updateActiveDay(); // Marca directamente el día activo
      } else {
        // Si el mes o año cambian, redibuja el calendario
        month = newMonth;
        year = newYear;
        activeDay = inputDay;

        initCalendar(); // Redibuja el calendario
        setTimeout(() => {
          updateActiveDay(); // Marca el día activo después del redibujado
        }, 0);
      }

      return;
    }
  }

  alert("Fecha inválida. Usa el formato dd/mm/yyyy.");
}

// Actualizar el día activo
function updateActiveDay() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.classList.remove("active");
    if (
      !day.classList.contains("prev-date") &&
      !day.classList.contains("next-date") &&
      parseInt(day.innerHTML, 10) === activeDay
    ) {
      day.classList.add("active");
    }
  });
}



//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event" style="border-left: 5px solid ${event.color}">
          <div class="title">
              <i class="fas fa-circle" style="color: ${event.color};"></i>
            <h3 class="event-title">${event.title}</h3>
          </div>
          <div class="event-time">
            <span class="event-time">${event.time}</span>
          </div>
      </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No tienes Eventos</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.innerHTML =
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeFromAMPM = document.querySelector(".event-time-from-ampm").value;
  const eventTimeTo = addEventTo.value;
  const eventTimeToAMPM = document.querySelector(".event-time-to-ampm").value;

  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validar formato de hora
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 12 || // Cambiado a 12 para formato AM/PM
    timeFromArr[1] > 59 ||
    timeToArr[0] > 12 ||
    timeToArr[1] > 59
  ) {
    alert("Por favor, introduce una hora válida en formato de 12 horas.");
    return;
  }

  // Construir el evento con AM/PM
  const formattedTimeFrom = `${eventTimeFrom} ${eventTimeFromAMPM}`;
  const formattedTimeTo = `${eventTimeTo} ${eventTimeToAMPM}`;

  const newEvent = {
    title: eventTitle,
    time: `${formattedTimeFrom} - ${formattedTimeTo}`,
    color: eventColorInput.value
  };

  // Añadir el evento al array y actualizar
  const eventDayObj = eventsArr.find(
    (eventObj) =>
      eventObj.day === activeDay &&
      eventObj.month === month + 1 &&
      eventObj.year === year
  );

  if (eventDayObj) {
    eventDayObj.events.push(newEvent);
  } else {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  updateEvents(activeDay);

  const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
      activeDayEl.classList.add("event");
    }

  saveEvents();
  addEventWrapper.classList.remove("active");
});


//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Seguro de que Quieres Eliminar el Evento?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}