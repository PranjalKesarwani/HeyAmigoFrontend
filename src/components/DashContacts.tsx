import {  useNavigate } from "react-router-dom"
import { ContactList } from "./utility/ContactList"
import { useState } from "react"
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { changeDashChat, fetchUserPMessages, setSelectedContact } from "../store/slices/dashChatSlice";
import { TSearchedData } from "../types";
import { fetchUserPContacts } from "../store/slices/dashChatSlice";
import { useSocket } from "../context/socketContext";
import NavRoutes from "./Miscellaneous/NavRoutes";



type TSearch = [
  {
    _id: string;
    username: string;
    email: string;
  }
]


export const DashContacts = () => {

  const navigate = useNavigate();
  const dashInfo = useAppSelector((state) => state.dashInfo);
  const { isChecked } = useSocket();



  const dispatch = useAppDispatch();

  const [search, setSearch] = useState<React.Dispatch<React.SetStateAction<string>> | string>("");
  const [searchResult, setSearchResult] = useState<TSearch | []>(); //Here you left empty bracket, so it means you are also giving it undefined type



  const debounce = function (func: Function, timeout = 200) {
    let timer: ReturnType<typeof setTimeout>;;
    return function (this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args) }, timeout);
    }
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {


    try {
      setSearch(e.target.value.toLowerCase());

      const res = await axios.get(`/api/auth/searchuser?search=${search}`);


      if (res.status === 401) {
        navigate('/')
      }
      setSearchResult(res.data)

      if (e.target.value === "") {
        setSearchResult([]);
      }

    } catch (error) {
      console.log(error)
    }

  }
  const processSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e));

  const handleSearchedUser = async (elem: TSearchedData) => {


    try {
      const res = await axios.post("/api/chat-routes/create-chat", { ...elem, isGroupChat: false });

      const data = res.data;
      if (res.status === 401) {
        navigate('/')
      }
      if (res.status === 200) {
        dispatch(setSelectedContact(data));

      }
      if (res.status === 201) {
        dispatch(setSelectedContact(data));
        dispatch(fetchUserPContacts()).unwrap().catch((err) => { console.log(err); navigate('/') });


      }
      dispatch(fetchUserPMessages())
      setSearchResult([]);
      dispatch(changeDashChat(true));


    } catch (error) {

      console.log(error)
    }



  }


  return (

    <>
      <div className={` dashContacts     rounded-3xl   flex flex-col w-full h-[97%] my-auto   p-3 max-w-[40rem] sm:w-full ${dashInfo.isDashChat ? "hidden sm:flex" : "flex"} ${isChecked ? 'depthEffectD1' : 'depthEffectL1'} `}>
        <div className="p-3 relative">
          <input id="searchInput" className={`rounded-xl pl-11 relative py-1  ${isChecked ? 'planeEffectD text-slate-300' : 'planeEffectL text-black'}`} type="search" placeholder="Search user" onChange={(e) => processSearch(e)} />
          <i className={`fa-solid fa-magnifying-glass absolute left-6 top-6 text-2xl ${isChecked ? "text-slate-300" : "text-black"}`}></i>
          {searchResult?.length ? <>
            <ul className="bg-white border p-1 rounded-lg absolute z-10 w-3/5 h-[24rem] overflow-y-scroll">
              {searchResult.map((elem, index) => {
                return (
                  <div key={index} className="searchList w-full  p-1 cursor-pointer " onClick={() => handleSearchedUser(elem)} >
                    <li className=" rounded-md text-2xl list-none" >Name: {elem.username}</li>
                    <h6 className="text-xl text-slate-500" >Email: {elem.email}</h6>
                    <hr />
                  </div>
                )
              })}
            </ul>
          </> : <></>}


        </div>
        <ContactList />

        {/* <div className="gap-2 flex justify-between mt-1 text-white ">

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
        </div> */}
        <NavRoutes />
      </div>


    </>
  )
}