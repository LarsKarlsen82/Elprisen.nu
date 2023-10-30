// document.addEventListener("DOMContentLoaded", function() {
//     const calendarIcon = document.getElementById("calendar-icon");
//     const centeredText = document.querySelector(".centered-text");
//     const historikContainer = document.querySelector(".historik-container");
//     const datePicker = document.getElementById("date-picker");

//     function fetchData(dateStr) {
//         const apiUrl = `https://www.elprisenligenu.dk/api/v1/prices/2023/${dateStr}_DK1.json`;

//         fetch(apiUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error("Network response was not ok");
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 // Handle the fetched data and update the UI as needed
//                 // Example: Display data in the historikContainer
//                 historikContainer.innerHTML = ""; // Clear previous data
//                 data.forEach(item => {
//                     const timeContainer = document.createElement("div");
//                     timeContainer.classList.add("historik-time-container");
//                     timeContainer.innerHTML = `<div>kl. ${item.time_start.split("T")[1].slice(0, -9)}</div>
//                                                <div>${item.DKK_per_kWh} kr</div>`;
//                     historikContainer.appendChild(timeContainer);
//                 });
//             })
//             .catch(error => {
//                 // Handle errors, log them to the console, or update the UI with an error message
//                 console.error("Error fetching data:", error);
//                 historikContainer.innerHTML = "Error fetching data.";
//             });
//     }

//     function openDatePicker() {
//         flatpickr(datePicker, {
//             dateFormat: "d-m-Y", // Customize date format as needed
//             onClose: function(selectedDates, dateStr, instance) {
//                 // Update the date in the date picker elements
//                 datePicker.textContent = dateStr;
//                 centeredText.textContent = `Elpriserne D.${dateStr}`;

//                 // Fetch and display data for the selected date
//                 fetchData(dateStr);
//             }
//         }).open();
//     }

//     calendarIcon.addEventListener("click", openDatePicker);
// });





// document.addEventListener("DOMContentLoaded", function() {
//     const centeredText = document.querySelector(".centered-text");
//     const datePicker = document.getElementById("date-picker");
//     const historikContainer = document.querySelector(".historik-time");

//     function fetchData(dateStr) {
//         const apiUrl = `https://www.elprisenligenu.dk/api/v1/prices/2023/${dateStr}_DK1.json`;

//         fetch(apiUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error("Network response was not ok");
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 // Sort the data array in ascending order based on time
//                 data.sort((a, b) => {
//                     return a.time_start.localeCompare(b.time_start);
//                 });

//                 historikContainer.innerHTML = ""; // Clear previous data
//                 // Process the sorted data
//                 data.forEach(item => {
//                     const time = item.time_start.split("T")[1].slice(0, -9);
//                     const price = item.DKK_per_kWh;
//                     const timePriceDiv = document.createElement("div");
//                     timePriceDiv.classList.add("historik-time-container");
//                     timePriceDiv.innerHTML = `<div>kl. ${time}</div><div>${price} kr</div>`;
//                     historikContainer.appendChild(timePriceDiv);
//                 });
//             })
//             .catch(error => {
//                 console.error("Error fetching data:", error);
//                 historikContainer.innerHTML = "Error fetching data.";
//             });
//     }

//     function openDatePicker() {
//         flatpickr(datePicker, {
//             dateFormat: "m-d",
//             onClose: function(selectedDates, dateStr, instance) {
//                 // Update date elements with the selected date
//                 datePicker.textContent = dateStr;
//                 centeredText.textContent = `Elpriserne D.${dateStr}`;
//                 fetchData(dateStr);
//             }
//         }).open();
//     }

//     const calendarIcon = document.getElementById("calendar-icon");
//     calendarIcon.addEventListener("click", openDatePicker);
// });


document.addEventListener("DOMContentLoaded", function() {
    const centeredText = document.querySelector(".centered-text");
    const datePicker = document.getElementById("date-picker");
    const historikContainer = document.querySelector(".historik-time");

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
                // Sort the data array in ascending order based on time
                data.sort((a, b) => {
                    return a.time_start.localeCompare(b.time_start);
                });

                historikContainer.innerHTML = ""; // Clear previous data
                // Process the sorted data and apply gradient color
                data.forEach(item => {
                    const time = item.time_start.split("T")[1].slice(0, -9);
                    const price = item.DKK_per_kWh;
                    const timePriceDiv = document.createElement("div");
                    timePriceDiv.classList.add("historik-time-container");
                    timePriceDiv.style.background = getColorForPrice(parseFloat(price)); // Apply gradient color
                    timePriceDiv.innerHTML = `<div>kl. ${time}</div><div>${price} kr</div>`;
                    historikContainer.appendChild(timePriceDiv);
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                historikContainer.innerHTML = "Error fetching data.";
            });
    }

    function getColorForPrice(price) {
        if (price >= 0 && price <= 0.2) {
            return "linear-gradient(to right, green, limegreen)";
        } else if (price > 0.2 && price <= 0.45) {
            return "linear-gradient(to right, yellow, gold)";
        } else if (price > 0.45 && price <= 0.6) {
            return "linear-gradient(to right, orange, darkorange)";
        } else if (price > 0.6 && price <= 1.0) {
            return "linear-gradient(to right, red, darkred)";
        }
        // Default color if price is out of specified range
        return "linear-gradient(to right, gray, lightgray)";
    }

    function openDatePicker() {
        flatpickr(datePicker, {
            dateFormat: "m-d",
            onClose: function(selectedDates, dateStr, instance) {
                // Update date elements with the selected date
                datePicker.textContent = dateStr;
                centeredText.textContent = `Elpriserne D.${dateStr}`;
                fetchData(dateStr);
            }
        }).open();
    }

    const calendarIcon = document.getElementById("calendar-icon");
    calendarIcon.addEventListener("click", openDatePicker);


});
