
import TaskCard from "./TaskCard"

import "./TaskList.css"
export default function TaskList({tasks}) {
  if (!tasks) {
    return <p>Loading...</p>;
  }
  
  
  
  return (
    <>
      <h1>Your tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <TaskCard task={task} />
          </div>
        ))
      )}
    </>
  );
}