document.addEventListener("DOMContentLoaded", function() {
    if (window.innerWidth >= 1401) {
        window.location.href = "desktop.html";
    }
});

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

            elprisElement.textContent = `Elpris: ${elpris} kr per kWh`;
            timeElement.textContent = `Tidspunkt: ${startTime} - ${endTime}`;
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
            historikContainer.innerHTML = "Error fetching data.";
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


// Settings

// Function to fetch data from an external source
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data'); // Replace this with your API endpoint
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to multiply data by 1.25
function multiplyData(data) {
    return data * 1.25;
}

// Update UI with fetched data
async function updateUI() {
    const dataElement = document.getElementById('data');
    const data = await fetchData();
    if (data !== null) {
        dataElement.textContent = data;
    } else {
        dataElement.textContent = 'Error fetching data';
    }
}

// Handle button click event
const toggleButton = document.getElementById('priser-toggle');
toggleButton.addEventListener('click', async () => {
    const dataElement = document.getElementById('data');
    const currentData = parseFloat(dataElement.textContent);
    if (!isNaN(currentData)) {
        const newData = multiplyData(currentData);
        dataElement.textContent = newData;
    }
});

// Fetch data and update UI when the page loads
updateUI();




    function toggleMenu() {
        var menu = document.getElementById("burger-menu");
        menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "flex" : "none";
    }
