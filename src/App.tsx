import './App.css';
import { SignupLogin } from './components/auth/SignupLogin';
import { Dashboard } from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardG } from './components/DashboardG';
import Lobby from './components/Lobby';
import Room from './components/Room';
// import ErrorPage from './components/ErrorPage';




function App() {



  return (
    <>
      <BrowserRouter>


        <Routes>
          <Route path='/' element={<SignupLogin />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboardg' element={<DashboardG />} />
          <Route path='/lobby' element={<Lobby />} />
          <Route path='/room/:roomId' element={<Room />} />
          <Route path='*' element={<SignupLogin />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
