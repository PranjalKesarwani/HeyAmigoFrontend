import './App.css';
import { SignupLogin } from './components/auth/SignupLogin';
import { Dashboard } from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardG } from './components/DashboardG';
import PreviewScreen from './components/Miscellaneous/PreviewScreen';

function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboardg' element={<DashboardG />} />
          <Route path='/' element={<SignupLogin />} />
          <Route path='/preview/:imageUrl' element={<PreviewScreen/>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
