
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import TaskDetails from './pages/TaskDetails.jsx'
function App() {
 

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<PublicRoute>{<Login />}</PublicRoute>}
        ></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route
          path="/dashboard"
          element={<ProtectedRoute>{<Dashboard />}</ProtectedRoute>}
        ></Route>
        <Route path="/tasks/:id" element={<TaskDetails />} />
      </Routes>
    </>
  );
}

export default App
