function checkWindowWidth() {
    if (window.innerWidth >= 1401 && !window.location.href.includes('desktop.html')) {
        window.location.href = "desktop.html";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);
});





// Modal

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// ----------------------------------------------------



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

// Fetch lige nu data til "index"


document.addEventListener("DOMContentLoaded", async function() {
    const elprisElement = document.getElementById("elpris");
    const timeElement = document.getElementById("time");

    try {
        // Get the current date in the format YYYY/MM-DD
        const currentDate = new Date().toLocaleDateString('en-CA', {
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-'); // Replace slashes with dashes

        // Construct the API endpoint URL with the current date and region code (e.g., DK2)
        const apiUrl = `https://www.elprisenligenu.dk/api/v1/prices/2023/${currentDate}_DK2.json`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data to inspect its structure

        const currentTime = new Date();
        const currentItem = data.find(item => {
            const startTime = new Date(item.time_start);
            const endTime = new Date(item.time_end);
            return currentTime >= startTime && currentTime <= endTime;
        });

        if (currentItem) {
            const elpris = currentItem.DKK_per_kWh.toFixed(4);
            const startTime = new Date(currentItem.time_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(currentItem.time_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            elprisElement.textContent = `${elpris} kr per kWh`;
            timeElement.textContent = ` ${startTime} - ${endTime}`;
        } else {
            elprisElement.textContent = "Data not available for the current time.";
            timeElement.textContent = "";
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
        elprisElement.textContent = "Error fetching data.";
        timeElement.textContent = "";
    }
});


//Oversigt

// document.addEventListener("DOMContentLoaded", function() {
//     const timeContainer = document.querySelector(".time"); // Select the time-container element
//     const lowestPriceElement = document.querySelector(".circle-oversigt .top-text");
//     const highestPriceElement = document.querySelector(".circle-oversigt2 .top-text");

//     function fetchTodayData() {
//         const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
//         const apiUrl = `https://www.elprisenligenu.dk/api/v1/prices/2023/${currentDate}_DK2.json`;

//         fetch(apiUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error("Network response was not ok");
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 // Clear previous data in time-container
//                 timeContainer.innerHTML = "";

//                 // Extract time and price values for the first 8 entries
//                 const timeAndPrices = data.slice(0, 24).map(entry => {
//                     return {
//                         time: entry.time_start.slice(11, 16),
//                         price: parseFloat(entry.DKK_per_kWh)
//                     };
//                 });

//                 // Find lowest and highest prices
//                 const lowestPrice = Math.min(...timeAndPrices.map(item => item.price));
//                 const highestPrice = Math.max(...timeAndPrices.map(item => item.price));

//                 // Update lowest and highest price elements
//                 lowestPriceElement.textContent = `${lowestPrice.toFixed(3)} KR`;
//                 highestPriceElement.textContent = `${highestPrice.toFixed(3)} KR`;

//                 // Populate the time-container with the first 8 entries
//                 timeAndPrices.forEach(item => {
//                     const timeDiv = document.createElement("div");
//                     timeDiv.classList.add("time-container");
//                     timeDiv.innerHTML = `<div>kl. ${item.time}</div><div>${item.price.toFixed(3)} kr</div>`;
//                     timeContainer.appendChild(timeDiv);
//                 });
//             })
//             .catch(error => {
//                 console.error("Error fetching data:", error);
//                 // Handle error here if necessary
//             });
//     }

//     // Call fetchTodayData function to fetch and display today's data
//     fetchTodayData();
// });
document.addEventListener("DOMContentLoaded", function() {
    const timeContainer = document.querySelector(".time"); // Select the time-container element
    const lowestPriceElement = document.querySelector(".circle-oversigt .top-text");
    const highestPriceElement = document.querySelector(".circle-oversigt2 .top-text");

    function fetchTodayData() {
        const currentDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        const apiUrl = `https://www.elprisenligenu.dk/api/v1/prices/2023/${currentDate}_DK2.json`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                // Clear previous data in time-container
                timeContainer.innerHTML = "";

                // Extract time and price values for the first 8 entries
                const timeAndPrices = data.slice(0, 24).map(entry => {
                    return {
                        time: entry.time_start.slice(11, 16),
                        price: parseFloat(entry.DKK_per_kWh)
                    };
                });

                // Find lowest and highest prices
                const lowestPrice = Math.min(...timeAndPrices.map(item => item.price));
                const highestPrice = Math.max(...timeAndPrices.map(item => item.price));

                // Update lowest and highest price elements
                lowestPriceElement.textContent = `${lowestPrice.toFixed(3)} KR`;
                highestPriceElement.textContent = `${highestPrice.toFixed(3)} KR`;

                // Populate the time-container with the first 8 entries
                timeAndPrices.forEach(item => {
                    const timeDiv = document.createElement("div");
                    timeDiv.classList.add("time-container");
                    timeDiv.innerHTML = `<div>kl. ${item.time}</div><div>${item.price.toFixed(3)} kr</div>`;

                    // Adjust the color based on price ranges using switch statement
                    const priceDiv = timeDiv.querySelector("div:last-child");
                    switch (true) {
                        case (item.price >= -0.5 && item.price <= 0.099):
                            priceDiv.style.color = "lightblue";
                            break;
                        case (item.price >= 0.1 && item.price <= 0.45):
                            priceDiv.style.color = "limegreen";
                            break;
                        case (item.price > 0.45 && item.price <= 0.7099):
                            priceDiv.style.color = "orange";
                            break;
                        case (item.price > 0.71 && item.price <= 2.0):
                            priceDiv.style.color = "red";
                            break;
                        default:
                            // Handle other cases if needed
                            break;
                    }

                    timeContainer.appendChild(timeDiv);
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                // Handle error here if necessary
            });
    }

    // Call fetchTodayData function to fetch and display today's data
    fetchTodayData();
});



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
            

                data.forEach((item, index) => {
                    const time = item.time_start.split("T")[1].slice(0, -9);
                    const price = parseFloat(item.DKK_per_kWh).toFixed(3); // Round off price to 3 decimal places
                    const timePriceDiv = document.createElement("div");
                    timePriceDiv.classList.add("historik-time-container");

                
                
                    // Create div elements for time and price
                    const timeDiv = document.createElement("div");
                    timeDiv.textContent = `kl. ${time}`;
                    const priceDiv = document.createElement("div");
                    priceDiv.textContent = `${price} kr`;
                

                // Adjust the color based on price ranges using switch statement
                    switch (true) {
                        case (price >= -0.5 && price <= 0.099):
                            priceDiv.style.color = "lightblue"; // Change the text color to blue for the second div in the range -0 - 0.2
                            break;
                        case (price >= 0.1 && price <= 0.45):
                            priceDiv.style.color = "limegreen"; // Change the text color to green for the second div in the range 0.21 - 0.45
                            break;
                        case (price > 0.45 && price <= 0.7099):
                            priceDiv.style.color = "orange"; // Change the text color to orange for the second div in the range 0.46 - 0.7
                            break;
                        case (price > 0.71 && price <= 2.0):
                            priceDiv.style.color = "red"; // Change the text color to red for the second div in the range 0.71 - 2.0
                            break;
                        default:
                            // Handle other cases if needed
                            break;
                }
            
                
                    // Append time and price div elements to the main div
                    timePriceDiv.appendChild(timeDiv);
                    timePriceDiv.appendChild(priceDiv);
                
                    historikContainer.appendChild(timePriceDiv);
                });

        })
        .catch(error => {
            console.error("Error fetching data:", error);
            historikContainer.innerHTML = "Data findes ikke.";

            historikContainer.style.color = "white";
            historikContainer.style.marginTop = "-1080px";
            historikContainer.style.marginLeft = "450px";
        });
}
    
    function openDatePicker() {
        flatpickr(datePicker, {
            dateFormat: "m-d",
            onClose: function(selectedDates, dateStr, instance) {
                // Original date format (M-D) for fetching data
                const originalDateFormat = dateStr;
                
                // Format date for displaying in DD-MM-YYYY format
                const formattedDate = moment(dateStr, "M-D").format("DD-MM-YYYY");
    
                // Update date-picker and centered-text with the selected date in DD-MM-YYYY format
                datePicker.textContent = formattedDate;
    
                // Fetch data using the original date format (M-D)
                fetchData(originalDateFormat);
            }
        }).open();
    }
    
    const calendarIcon = document.getElementById("calendar-icon");
    calendarIcon.addEventListener("click", openDatePicker);
    

});


// Priser inkl. moms toggle-ting

document.addEventListener('DOMContentLoaded', function() {
    // Get the initial value of elprisElement
    const initialElprisValue = parseFloat(document.getElementById('elpris').textContent);
    const textContainerElements = document.querySelectorAll('.text-container .top-text');
    const timeContainerElements = document.querySelectorAll('.time-container .time-bottom');
    const historikTimeContainerElements = document.querySelectorAll('.historik-time-container .below-text');
    const priserToggle = document.getElementById('priser-toggle');

    let isToggled = false;

    priserToggle.addEventListener('click', function() {
        isToggled = !isToggled;

        if (isToggled) {
            // Multiply the initial value by 1.25 when toggled
            const newElprisValue = (initialElprisValue * 1.25).toFixed(3);
            document.getElementById('elpris').textContent = newElprisValue + ' KR';
            console.log(isToggled);

            textContainerElements.forEach(function(element) {
                const topText = parseFloat(element.textContent) * 1.25;
                element.textContent = topText.toFixed(3);
            });

            timeContainerElements.forEach(function(element) {
                const timeBottom = parseFloat(element.textContent) * 1.25;
                element.textContent = timeBottom.toFixed(3) + ' kr';
            });

            historikTimeContainerElements.forEach(function(element) {
                const belowText = parseFloat(element.textContent) * 1.25;
                element.textContent = belowText.toFixed(3) + ' kr';
            });
        } else {
            // Restore the initial value when toggled again
            document.getElementById('elpris').textContent = initialElprisValue.toFixed(3) + ' KR';

            textContainerElements.forEach(function(element) {
                const topText = parseFloat(element.textContent) / 1.25;
                element.textContent = topText.toFixed(3);
            });

            timeContainerElements.forEach(function(element) {
                const price = parseFloat(element.textContent) / 1.25;
                element.textContent = price.toFixed(3) + ' kr';
            });

            historikTimeContainerElements.forEach(function(element) {
                const price = parseFloat(element.textContent) / 1.25;
                element.textContent = price.toFixed(3) + ' kr';
            });
        }
    });
});




