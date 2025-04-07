const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events')) || [];

// Event listeners for navigation and adding events
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('addEvent').addEventListener('click', addEvent);
document.getElementById('theme').addEventListener('change', changeTheme);

// Function to render the calendar
function renderCalendar() {
    const monthYear = document.getElementById('monthYear');
    const dates = document.getElementById('dates');
    monthYear.innerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    dates.innerHTML = '';

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Render empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('date');
        dates.appendChild(emptyDiv);
    }

    // Render the days of the month with numeric values
    for (let date = 1; date <= lastDate; date++) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        dateDiv.innerText = date; // Set the inner text to the numeric date

        // Add an event listener to show events for that date
        dateDiv.addEventListener('click', () => showEvents(date));
        dates.appendChild(dateDiv);
    }

    // Update the events list
    updateEventsList();
}

// Function to add an event
function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const color = document.getElementById('eventColor').value;

    if (title && date) {
        events.push({ title, date, time, color });
        localStorage.setItem('events', JSON.stringify(events));
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventTime').value = '';
        updateEventsList();
    } else {
        alert("Please enter both title and date.");
    }
}

// Function to show events for a specific date
function showEvents(date) {
    const eventsForDate = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === date &&
               eventDate.getMonth() === currentDate.getMonth() &&
               eventDate.getFullYear() === currentDate.getFullYear();
    });

    const eventsList = document.getElementById('events');
    eventsList.innerHTML = '';

    if (eventsForDate.length > 0) {
        eventsForDate.forEach((event, index) => {
            const li = document.createElement('li');
            li.innerText = `${event.title} at ${event.time}`;
            li.style.color = event.color; // Set the color of the event

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the event from bubbling up
                deleteEvent(event.date, index);
            });

            li.appendChild(deleteButton);
            eventsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.innerText = "No events for this date.";
        eventsList.appendChild(li);
    }
}

// Function to delete an event
function deleteEvent(date, index) {
    // Remove the event from the events array
    events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(events));
    updateEventsList();
    renderCalendar();
}

// Function to update the events list
function updateEventsList() {
    const eventsList = document.getElementById('events');
    eventsList.innerHTML = '';
    events.forEach((event, index) => {
        const li = document.createElement('li');
        li.innerText = `${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.time}`;
        li.style.color = event.color; // Set the color of the event

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the event from bubbling up
            deleteEvent(event.date, index);
        });

        li.appendChild(deleteButton);
        eventsList.appendChild(li);
    });
}

// Function to change the theme
function changeTheme() {
    const theme = document.getElementById('theme').value;
    if (theme === 'dark') {
        document.body.classList.add('dark');
        document.querySelector('.container').classList.add('dark');
        document.querySelectorAll('.date').forEach(date => date.classList.add('dark'));
    } else {
        document.body.classList.remove('dark');
        document.querySelector('.container').classList.remove('dark');
        document.querySelectorAll('.date').forEach(date => date.classList.remove('dark'));
    }
}

// Initial render of the calendar
renderCalendar();