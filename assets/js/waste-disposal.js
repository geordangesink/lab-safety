document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = Array.from(document.querySelectorAll('.draggable'));
    const dropboxes = document.querySelectorAll('.dropbox');
    const counter = document.getElementById('counter');
    let incorrectAttempts = 0;

    // Correct mapping key
    const correctMapping = {
        'draggable1': 'dropbox6',
        'draggable2': 'dropbox1',
        'draggable3': 'dropbox8',
        'draggable4': 'dropbox2',
        'draggable5': 'dropbox3',
        'draggable6': 'dropbox2',
        'draggable7': 'dropbox1',
        'draggable8': 'dropbox1',
        'draggable9': 'dropbox1',
        'draggable10': 'dropbox4',
        'draggable11': 'dropbox7',
        'draggable12': 'dropbox7',
        'draggable13': 'dropbox3',
        'draggable14': 'dropbox5',
        'draggable15': 'dropbox4',
        'draggable16': 'dropbox7'
    };

    const initialPositions = {};

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Hide all draggable elements except the first one in the shuffled array
    function initializeDraggables() {
        shuffle(draggables);
        draggables.forEach((draggable, index) => {
            const container = draggable.parentElement;
            initialPositions[draggable.id] = {
                left: container.style.left,
                top: container.style.top
            };

            if (index !== 0) {
                container.style.display = 'none';
            }
        });
    }

    // Show the next draggable element
    function showNextDraggable() {
        for (let i = 0; i < draggables.length; i++) {
            const container = draggables[i].parentElement;
            if (container.style.display === 'none') {
                container.style.display = 'block';
                break;
            }
        }
    }

    // End check for draggables
    function checkCompletion() {
        const remainingDraggables = document.querySelectorAll('.draggable-container');
        if (remainingDraggables.length === 0) {
            const message = document.querySelector("#congratulations-message");
            message.textContent = `Congratulations! You have made ${incorrectAttempts} mistakes`;
            message.classList.remove("hide");
        }
    }

    draggables.forEach(draggable => {
        const container = draggable.parentElement;

        draggable.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', null); // fix for firefox
            const style = window.getComputedStyle(container, null);
            event.dataTransfer.setData('text/plain', 
                (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + 
                (parseInt(style.getPropertyValue('top'), 10) - event.clientY) + ',' +
                draggable.id);
        });
    });

    dropboxes.forEach(dropbox => {
        dropbox.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        dropbox.addEventListener('drop', (event) => {
            event.preventDefault();
            const offset = event.dataTransfer.getData('text/plain').split(',');
            const draggableId = offset[2];
            const draggable = document.getElementById(draggableId);
            const container = draggable.parentElement;

            // Remove any existing message
            let existingMessage = dropbox.querySelector('.message');
            if (existingMessage) {
                dropbox.removeChild(existingMessage);
            }

            const message = document.createElement('div');
            message.style.color = "black";
            message.className = 'message';

            // check if correct
            if (correctMapping[draggableId] === dropbox.id) {
                message.textContent = 'Correct!';
                message.style.backgroundColor = 'lightgreen';
                container.remove();
                // show next chemical
                showNextDraggable();
            } else {
                message.textContent = 'Wrong!';
                message.style.backgroundColor = 'lightcoral';
                // increment the incorrect attempts counter
                incorrectAttempts += 1;
                counter.textContent = `Incorrect Attempts: ${incorrectAttempts}`;
                // Reset the draggable object to its initial position
                container.style.left = initialPositions[draggableId].left;
                container.style.top = initialPositions[draggableId].top;
                container.style.display = 'block';
            }

            
            dropbox.appendChild(message);

            // show the message
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 2000);

            checkCompletion();
        });
    });

    // Initialize: Show only the first draggable element in the shuffled order
    initializeDraggables();
});
