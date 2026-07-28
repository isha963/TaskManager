
import { useEffect , useState} from "react";
import { useParams } from "react-router-dom";
import { getTaskById } from "../api/taskApi";

export default function TaskDetails() {
  const [task, setTask] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchTask = async () => {
      const response = await getTaskById(id);
      console.log(response);
      setTask(response.task);
    };

    fetchTask();
  }, [id]);
  
  if (!task) {
    return <p>Loading...</p>;
  }

  return (
    <>
      

      
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>{task.priority}</p>
      <p>{task.status}</p>
    </>
  );
}
