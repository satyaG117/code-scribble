import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route } from 'react-router-dom'

import Navbar from './shared/components/navigation/Navbar';
import Scribbles from './scribbles/pages/Scribbles';
import './App.css'
import Signup from './users/pages/Signup';
import Login from './users/pages/Login';
import NewScribble from './scribbles/pages/NewScribble';
import ViewScribble from './scribbles/pages/ViewScribble';
import ScribbleEditor from './scribbles/pages/ScribbleEditor'
import { AuthContext } from './shared/contexts/AuthContext';
import { useAuth } from './shared/hooks/useAuth';
import AuthOnlyRoutes from './shared/components/routes/AuthOnlyRoutes';
import NoAuthOnlyRoutes from './shared/components/routes/NoAuthOnlyRoutes';
import { ToastContainer } from 'react-toastify';
import EditScribble from './scribbles/pages/EditScribble';
import Profile from './users/pages/Profile';

function App() {

  const { userId, token, login, logout } = useAuth();
  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, userId, token, login, logout }}>
      <Navbar />
      <ToastContainer />
      <div className='main-container container-fluid p-0 m-0'>
        <Routes>
          <Route element={<AuthOnlyRoutes/>}>
            <Route path='/scribbles/:scribbleId/edit' element={<EditScribble />} />
            <Route path='/scribbles/create' element={<NewScribble />} />
            <Route path='/scribbles/:scribbleId/editor' element={<ScribbleEditor />} />
          </Route>
          <Route element={<NoAuthOnlyRoutes/>}>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
          </Route>
          <Route path='/scribbles' element={<Scribbles />} />
          <Route path='/scribbles/:scribbleId' element={<ViewScribble />} />
          <Route path='/profile/:userId' element={<Profile />} />

        </Routes>
      </div>
    </AuthContext.Provider>
  )
}

export default App
