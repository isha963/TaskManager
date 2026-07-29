
import { useEffect , useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import { getTaskById,updateTask,deleteTask } from "../api/taskApi";

export default function TaskDetails() {
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
  });
  const [error, setError] = useState("");
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
      const fetchTask = async () => {
        const response = await getTaskById(id);
        setTask(response.task);
      };

      fetchTask();

  }, [id]);
  
  if (!task) {
    return <p>Loading...</p>;
  }
  const handleClick = async () => {
    const response = await getTaskById(id);

    setIsEditing(true);
    setFormData({
      title: response.task.title,
      description: response.task.description,
      dueDate: response.task.dueDate,
      priority: response.task.priority,
      status: response.task.status,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // const response = await getTaskById(id);

      // setTask(response.task);

      const res = await updateTask(id, formData);
      // console.log(response);

      setTask(res.task);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const handleDelete = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    console.log("Confirmed:", confirmed);

    if(confirmed)
    {
      setError("");
      try {
        await deleteTask(id);
      
        navigate("/dashboard");
      } catch (error) {
        setError(error.message);
      }
    } 
  };


  return (
    <>
      {isEditing ? (
        <div>
          <h1>Edit</h1>
          <form onSubmit={handleSubmit}>
            <label>Title:</label>{" "}
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
            />
            <label>Description:</label>{" "}
            <input
              type="text"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
            />
            <label>Duedate:</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => {
                setFormData({ ...formData, dueDate: e.target.value });
              }}
            />
            <label>Priority:</label>
            <select
              value={formData.priority}
              onChange={(e) => {
                setFormData({ ...formData, priority: e.target.value });
              }}
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <label>Status:</label>
            <select
              value={formData.status}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value });
              }}
            >
              <option value="">Select Status</option>
              <option value="Todo">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button type="submit">save</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      ) : (
        <div>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
          <p>{task.priority}</p>
          <p>{task.status}</p>

          <button onClick={handleClick}>edit</button>
          <button onClick={handleDelete}>delete</button>
          {error && <p>{error}</p>}
        </div>
      )}
    </>
  );
}
