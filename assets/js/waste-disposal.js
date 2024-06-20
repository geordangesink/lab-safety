document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');
    const dropboxes = document.querySelectorAll('.dropbox');
    const counter = document.getElementById('counter');
    let incorrectAttempts = 0;

    // Correct key
    const correctMapping = {
        'draggable1': 'dropbox1',
        'draggable2': 'dropbox2',
        'draggable3': 'dropbox1'
    };

    // Initial position
    const initialPositions = {};

    draggables.forEach(draggable => {
        const container = draggable.parentElement;
        // Store the initial position
        initialPositions[draggable.id] = {
            left: container.style.left,
            top: container.style.top
        };

        draggable.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', null); // Firefox fix
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

            // Create a message
            const message = document.createElement('div');
            message.className = 'message';

            // Check if chemical is correct
            if (correctMapping[draggableId] === dropbox.id) {
                message.textContent = 'Correct!';
                message.style.backgroundColor = 'lightgreen';
                container.style.left = '0px';
                container.style.top = '0px';
                dropbox.appendChild(container); // Move the chemical into the drop box
            } else {
                message.textContent = 'Wrong!';
                message.style.backgroundColor = 'lightcoral';
                // Incorrect attempts counter
                incorrectAttempts += 1;
                counter.textContent = `Incorrect Attempts: ${incorrectAttempts}`;
                // Reset to initial position
                container.style.left = initialPositions[draggableId].left;
                container.style.top = initialPositions[draggableId].top;
            }

            // Show message for a few seconds under the dropbox
            dropbox.appendChild(message);

            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 2000);
        });
    });
});
