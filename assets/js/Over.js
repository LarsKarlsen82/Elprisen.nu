// Get the current date
const currentDate = new Date();

// Format the date as 'YYYY/MM-DD'
const formattedDate = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;


// Fetch data for the current date
// Fetch data for the current date
fetch(`https://www.elprisenligenu.dk/api/v1/prices/${formattedDate}_DK1.json`)
    .then(response => response.json())
    .then(data => {
        // Update lowest and highest prices
        document.querySelector('.top-text').textContent = `${data.lowestPrice} KR`;
        document.querySelector('.bottom-text').textContent = 'PR.KWH';
        console.log(data);

        // Update time containers if data.timePrices is defined and is an array
        const timeContainers = document.querySelectorAll('.time-container');
        if (data.timePrices && Array.isArray(data.timePrices)) {
            data.timePrices.forEach((timePrice, index) => {
                timeContainers[index].firstElementChild.textContent = `kl. ${timePrice.hour}`;
                timeContainers[index].lastElementChild.textContent = `${timePrice.price} kr`;
            });
        } else {
            console.error('Invalid or missing timePrices data:', data.timePrices);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

