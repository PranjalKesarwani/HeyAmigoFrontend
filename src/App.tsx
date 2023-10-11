import './App.css';
import { SignupLogin } from './components/auth/SignupLogin';
import { Dashboard } from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Test} from "./components/Test"
import { DashboardG } from './components/DashboardG';

function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboardg' element={<DashboardG />} />
          <Route path='/' element={<SignupLogin />} />
          <Route path='/test' element={<Test />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
