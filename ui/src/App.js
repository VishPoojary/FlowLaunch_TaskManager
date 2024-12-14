import React, { useState, useEffect } from 'react';
import TaskTable from './components/TaskTable';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      const formattedData = data.slice(0, 20).map(task => ({
        id: task.id,
        title: task.title,
        description: `Description for task ${task.id}`,
        status: task.completed ? 'Done' : 'To Do',
      }));
      setTasks(formattedData);
    };
    fetchTasks();
  }, []);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks =
    filterStatus === 'All'
      ? tasks
      : tasks.filter(task => task.status === filterStatus);

  return (
    <div className="container">
      <TaskTable
        tasks={filteredTasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
};

export default App;
