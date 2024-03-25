document.getElementById('taskForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const courseId = document.getElementById('courseId').value;
        const taskName = document.getElementById('taskName').value;
        const dueDate = document.getElementById('dueDate').value;
        const otherDetails = document.getElementById('otherDetails').value;

        const response = await fetch('/courses/${courseId}/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskName, dueDate, otherDetails })
        });

        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        const data = await response.json();
        console.log(data); // Handle the response
    } catch (error) {
        console.error('Error:', error.message);
    }
});
