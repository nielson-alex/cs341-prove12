const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const chatBox = document.getElementById('chatBox')
const messageEl = document.getElementById('message')
const user = document.getElementById('user')
const date = new Date() // Date implementation

socket.on('newMessage', data => {
    addMessage(data, false)
})

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

// Post message to board
const postMessage = () => {
    // Get input values from the page
    const message = messageEl.value.trim()
    const from = user.value
    const time = getTime()

    const data = { message, from, time }

    // Emit the message
    socket.emit('message', data)

    // Add the message to the page
    addMessage(data, true)

    // Clear input
    messageEl.value = ''
}

document.getElementById('btnSendMessage').addEventListener('click', postMessage);

// Add message from any user to chatbox, determine if added
// by current user.
const addMessage = (data = {}, user = false) => {
    // Add an li to the page containing the new message
    // Give it the uMessage class if from the current user
    chatBox.innerHTML += `
    <li class="message${user ? ' uMessage' : ''}">
        ${data.from} @${data.time}: ${data.message}
    </li>
    `
}
