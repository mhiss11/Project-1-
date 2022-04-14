const eventbrite = new EventBrite();
const ui = new UI();


document.getElementById('submitBtn').addEventListener('click', (e) => {
    e.preventDefault();

    const eventName = document.getElementById('event-name').value;
    const catergory = document.getElementById('category').value;

    console.log(eventName + ' : ' + catergory);

    if(eventName !== '') {
        console.log('Successful')
        eventbrite.queryAPI(eventName, catergory)

    } else {
        console.log('Failed')
       
    }

})