
import { Link } from 'react-router-dom';

export default function TaskCard({task}) {
  
  
  

  return (
    <>
      <Link to={`/tasks/${task._id}`}>
        {task.title}
      </Link>
    </>
  );
}
