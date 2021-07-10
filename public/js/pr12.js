const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const errorContainer = document.getElementById('errMsg')
const usernameInput = document.getElementById('username')
const date = new Date()

// A simple async POST request function
const getData = async (url = '') => {
    const response = await fetch(url);

    return response.json()
}

function getTime() {
    const date = new Date();
    const year = `${date.getFullYear()}`;
    const month = `${date.getMonth()}`.length < 2 ? `0${date.getMonth()}` : `${date.getMonth()}`;
    const day = `${date.getDate()}`.length < 2 ? `0${date.getDate()}` : `${date.getDate()}`;
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let time = 0;

    if (hours > 12) {
        hours = `${hours - 12}`.length < 2 ? `0${hours - 12}` : `${hours - 12}`;
        minutes = `${minutes}`.length < 2 ? `0${minutes}` : `${minutes}`;
        time = `${hours}:${minutes} PM`;
    } else {
        hours = `${hours}`.length < 2 ? `0${hours}` : `${hours}`;
        minutes = `${minutes}`.length < 2 ? `0${minutes}` : `${minutes}`;
        time = `${hours}:${minutes} AM`;
    }

    return `${year}-${month}-${day} ${time}`;
}


// A simple async POST request function
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

// Login user to access chat room.
const login = async () => {
    console.log('entered login');
    // Get the username from our input
    const username = usernameInput.value

    // Do some simple validation on the client-side
    errorContainer.innerHTML = ''
    if (!username || username.trim() === '') {
        errorContainer.innerHTML = 'Username cannot be empty!'
        return
    }

    // Get JSON data from the server
    const data = await postData('/login', {
        username
    })

    // Check for errors
    if (data.error) {
        errorContainer.innerHTML = data.error
        return
    }

    // No errors, emit a newUser event and redirect to /chat
    socket.emit('newUser', username, getTime())
    window.location = '/chat'
}

function keypressLogin(e) {
    console.log('e');
    if (e.key === 'Enter') {
        login();
    }
}

document.getElementById('btnLogin').addEventListener('click', login);
username.addEventListener('keydown', keypressLogin);