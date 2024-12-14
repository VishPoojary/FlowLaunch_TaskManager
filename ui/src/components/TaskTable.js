
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';

const TaskTable = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos?_limit=20')
            .then((response) => response.json())
            .then((data) => {
                const formattedTasks = data.map((task) => ({
                    id: task.id,
                    title: task.title,
                    description: `Description for task ${task.id}`,
                    status: task.completed ? 'Done' : 'To Do',
                }));
                setTasks(formattedTasks);
            });
    }, []);

    useEffect(() => {
        const table = new Tabulator('#task-table', {
            data: tasks,
            layout: 'fitColumns',
            responsiveLayout: 'hide',
            addRowPos: 'top',
            pagination: 'local',
            paginationSize: 10,
            columns: [
                { title: 'ID', field: 'id', hozAlign: 'center', width: 50 },
                { title: 'Title', field: 'title', editor: 'input' },
                { title: 'Description', field: 'description', editor: 'textarea' },
                {
                    title: 'Status',
                    field: 'status',
                    editor: 'select',
                    editorParams: { values: ['To Do', 'In Progress', 'Done'] },
                },
                {
                    title: 'Actions',
                    formatter: () => '<button class="btn btn-danger btn-sm">Delete</button>',
                    cellClick: (e, cell) => {
                        const updatedTasks = tasks.filter((task) => task.id !== cell.getRow().getData().id).map((task, index) => ({ ...task, id: index + 1 }));
                        setTasks(updatedTasks);
                        showNotification('Task deleted successfully!');
                    },
                },
            ],
        });

        if (filterStatus !== 'All') {
            table.setFilter('status', '=', filterStatus);
        } else {
            table.clearFilter();
        }

        return () => {
            table.destroy();
        };
    }, [tasks, filterStatus]);

    const handleSearch = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);

      if (term === '') {
          setFilterStatus(tasks); 
      } else {
          const filtered = tasks.filter(
              (task) =>
                  task.title.toLowerCase().includes(term) ||
                  task.description.toLowerCase().includes(term)
          );
          setFilterStatus(filtered);
      }
  };

    const handleAddTask = () => {
        if (!newTask.title.trim() || !newTask.description.trim()) {
            alert('Please fill in all fields');
            return;
        }
        setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
        setNewTask({ title: '', description: '', status: 'To Do' });
        showNotification('Task added successfully!');
    };

    const getStatusCount = (status) => tasks.filter((task) => task.status === status).length;

    const showNotification = (message) => {
      setNotification(message);
      setTimeout(() => setNotification(''), 3000); 
  };


    return (
        <div className="container my-5">
            <h1 className="text-center">Task List Manager</h1>

            {/* Notification */}
            {notification && (
                <div className="alert alert-success" role="alert">
                    {notification}
                </div>
            )}

            {/* Counters */}
            <div className="d-flex justify-content-around my-3">
                <span className="badge p-3 bg-primary">To Do: {getStatusCount('To Do')}</span>
                <span className="badge p-3 bg-warning">In Progress: {getStatusCount('In Progress')}</span>
                <span className="badge p-3 bg-success">Done: {getStatusCount('Done')}</span>
            </div>

            {/* Task Form  */}
            <div className="card p-3 mb-4">
                <h5>Add New Task</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={newTask.status}
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-primary" onClick={handleAddTask}>
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Title or Description"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Filter */}
            <div className="mb-3">
                <select
                    className="form-select"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    value={filterStatus}
                >
                    <option value="All">All</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            {/* Task Table */}
            <div id="task-table" className="table-responsive"></div>
        </div>
    );
};

export default TaskTable;

