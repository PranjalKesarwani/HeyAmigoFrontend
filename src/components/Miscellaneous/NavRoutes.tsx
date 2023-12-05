import { NavLink } from 'react-router-dom'
import { useSocket } from '../../context/socketContext'

const NavRoutes = () => {
    const {isChecked} = useSocket();
  return (
    <div className="gap-2 flex justify-between mt-1 text-white ">

          <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
            return props.isActive ? `active w-1/2 p-2 rounded-bl-xl text-center text-slate-800  ` : `w-1/2  p-2 rounded-bl-xl text-center pending text-slate-800  `
          }} to="/dashboard">
            <i className={`fa-solid fa-user-group mr-3 text-slate-800 ${isChecked ? '':''}`}></i>
            Personal Chat

          </NavLink>

          <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
            return props.isActive ? `active w-1/2  p-2 rounded-br-xl text-center text-slate-800  ` : `w-1/2  p-2 rounded-br-xl text-center text-slate-800 pending `
          }} to="/dashboardg">
                        <i className={`fa-solid fa-users mr-3 text-slate-800 ${isChecked ? '':''}`}></i>

            Group Chat

          </NavLink>
        </div>
  )
}

export default NavRoutes
