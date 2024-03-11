import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Load tasks from local storage on app load
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedCount = parseInt(localStorage.getItem('count')) || 0;
    setTasks(storedTasks);
    setCount(storedCount);
  }, []);

  // Save tasks to local storage whenever tasks or count change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('count', count);
  }, [tasks, count]);

  const addTask = (task, quantity) => {
    const newTasks = [...tasks];
    for (let i = 0; i < quantity; i++) {
      newTasks.push({ name: task, updateCount: 0 });
    }
    setTasks(newTasks);
    setCount(count + quantity);
    setInputValue('');
  };

  const updateTask = (index, updatedTask) => {
    const newTasks = [...tasks];
    newTasks[index] = { name: updatedTask, updateCount: newTasks[index].updateCount + 1 };
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    setCount(count - 1);
    setEditIndex(null);
  };

  return (
    <div className="App">
      <h1>Todo App with a Twist</h1>
      <div>
        <input
          type="text"
          placeholder="Add task with quantity"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const input = inputValue.trim();
              const match = input.match(/(.+)\s(\d+)/);

              if (match) {
                const task = match[1];
                const quantity = parseInt(match[2], 10);
                addTask(task, quantity);
              }
            }
          }}
        />
        <button
          onClick={() => {
            const input = inputValue.trim();
            const match = input.match(/(.+)\s(\d+)/);

            if (match) {
              const task = match[1];
              const quantity = parseInt(match[2], 10);
              addTask(task, quantity);
            }
          }}
        >
          Add Todo
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {index === editIndex ? (
              <div>
                <input className='input'
                  type="text"
                  value={task.name}
                  onChange={(e) => {
                    const newTasks = [...tasks];
                    newTasks[index].name = e.target.value;
                    setTasks(newTasks);
                  }}
                />
                <button
                  onClick={() => {
                    updateTask(index, task.name);
                    setEditIndex(null);
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <span>
                {task.name} ( updated {task.updateCount} times )
              </span>
            )}
            <button onClick={() => setEditIndex(index)}>Edit</button>
            <button onClick={() => deleteTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total Tasks: {count}</p>
    </div>
  );
}

export default App;