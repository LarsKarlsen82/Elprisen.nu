function toggleMenu() {
    let menu = document.getElementById("burger-menu");
    let icon = document.getElementById("menu-icon");

    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
        icon.innerHTML = '<i class="fas fa-chevron-up"></i>'; // Up arrow
    } else {
        menu.style.display = "none";
        icon.innerHTML = '<i class="fas fa-chevron-down"></i>'; // Down arrow
    }
}

// Fetch lige nu data til "overblik"


document.addEventListener("DOMContentLoaded", function() {
    // Get reference to the elements where you want to display the fetched data
    const elprisElement = document.getElementById("elpris");
    const timeElement = document.getElementById("time");

    // Fetch data from the API endpoint
    fetch("https://www.elprisenligenu.dk/api/v1/prices/2023/10-30_DK1.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Get the current time
            const currentTime = new Date();

            // Find the object in the array that corresponds to the current time
            const currentItem = data.find(item => {
                const startTime = new Date(item.time_start);
                const endTime = new Date(item.time_end);

                // Check if the current time is within the start and end time of the item
                return currentTime >= startTime && currentTime <= endTime;
            });

            // Display the data for the current time
            if (currentItem) {
                const elpris = currentItem.DKK_per_kWh.toFixed(4); // Format to 4 decimal places
                const startTime = new Date(currentItem.time_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = new Date(currentItem.time_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                elprisElement.textContent = `Elpris: ${elpris} kr per kWh`;
                timeElement.textContent = `Tidspunkt: ${startTime} - ${endTime}`;
            } else {
                // Handle the case when no matching item is found for the current time
                elprisElement.textContent = "Data not available for the current time.";
                timeElement.textContent = "";
            }
        })
        .catch(error => {
            // Handle errors, log them to the console
            console.error("Error fetching data:", error);
            elprisElement.textContent = "Error fetching data.";
            timeElement.textContent = "";
        });
});


// Til historik:

// document.addEventListener("DOMContentLoaded", function() {
//     const calendarIcon = document.getElementById("calendar-icon");
//     const centeredText = document.querySelector(".centered-text");
//     const historikContainer = document.querySelector(".historik-container");
//     const datePicker = document.getElementById("date-picker");

//     function openDatePicker() {
//         flatpickr(datePicker, {
//             dateFormat: "d-m-Y", // Customize date format as needed
//             onClose: function(selectedDates, dateStr, instance) {
//                 // Update the date in the date picker elements
//                 datePicker.textContent = dateStr;
//                 centeredText.textContent = `Elpriserne D.${dateStr}`;

//                 // Handle the rest of the code for fetching and displaying data (similar to the previous example)
//                 // ...
//             }
//         }).open();
//     }

//     calendarIcon.addEventListener("click", openDatePicker);
// });

document.addEventListener("DOMContentLoaded", function() {
    const calendarIcon = document.getElementById("calendar-icon");
    const centeredText = document.querySelector(".centered-text");
    const historikContainer = document.querySelector(".historik-container");
    const datePicker = document.getElementById("date-picker");

    function fetchData(dateStr) {
        const apiUrl = `https://www.elprisenligenu.dk/api/v1/prices/2023/${dateStr}_DK1.json`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                // Handle the fetched data and update the UI as needed
                // Example: Display data in the historikContainer
                historikContainer.innerHTML = ""; // Clear previous data
                data.forEach(item => {
                    const timeContainer = document.createElement("div");
                    timeContainer.classList.add("historik-time-container");
                    timeContainer.innerHTML = `<div>kl. ${item.time_start.split("T")[1].slice(0, -9)}</div>
                                               <div>${item.DKK_per_kWh} kr</div>`;
                    historikContainer.appendChild(timeContainer);
                });
            })
            .catch(error => {
                // Handle errors, log them to the console, or update the UI with an error message
                console.error("Error fetching data:", error);
                historikContainer.innerHTML = "Error fetching data.";
            });
    }

    function openDatePicker() {
        flatpickr(datePicker, {
            dateFormat: "d-m-Y", // Customize date format as needed
            onClose: function(selectedDates, dateStr, instance) {
                // Update the date in the date picker elements
                datePicker.textContent = dateStr;
                centeredText.textContent = `Elpriserne D.${dateStr}`;

                // Fetch and display data for the selected date
                fetchData(dateStr);
            }
        }).open();
    }

    calendarIcon.addEventListener("click", openDatePicker);
});

