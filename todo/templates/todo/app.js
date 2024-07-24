document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // 入力されたデータを取得
    const title = document.getElementById('title').value;
    const due = document.getElementById('due').value;
    
    // タスクデータをローカルストレージに保存
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTask = {
        id: Date.now(),
        title: title,
        due: due,
        status: 'pending'
    };
    tasks.push(newTask);
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('taskForm').reset();
    displayTasks();
});

function displayTasks(filter = 'all') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // フィルタリングロジック
    if (filter === 'completed') {
        tasks = tasks.filter(task => task.status === 'completed');
    } else if (filter === 'pending') {
        tasks = tasks.filter(task => task.status === 'pending');
    } else if (filter === 'overdue') {
        const currentDate = new Date();
        tasks = tasks.filter(task => new Date(task.due) < currentDate && task.status === 'pending');
    }

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.innerHTML = `
            <h3>${task.title}</h3>
            <p>Due: ${task.due}</p>
            <p>Status: ${task.status}</p>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="toggleStatus(${task.id})">${task.status === 'pending' ? 'Complete' : 'Reopen'}</button>
        `;
        taskList.appendChild(taskItem);
    });
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function toggleStatus(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.status = task.status === 'pending' ? 'completed' : 'pending';
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function filterTasks() {
    const filter = document.getElementById('filter').value;
    displayTasks(filter);
}

window.onload = function() {
    displayTasks();
};