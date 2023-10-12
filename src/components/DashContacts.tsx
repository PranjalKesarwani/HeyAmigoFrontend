import { NavLink, useNavigate } from "react-router-dom"
import { ContactList } from "./utility/ContactList"
import { useState } from "react"
import axios from "axios";
import { useAppDispatch } from "../hooks/hooks";
import { changeDashChat, fetchUserPMessages, setSelectedContact } from "../store/slices/dashChatSlice";
import { TSearchedData } from "../types";
import { fetchUserPContacts } from "../store/slices/dashChatSlice";
import { useEffect } from 'react'
import { useAppSelector } from "../hooks/hooks";


type TSearch = [
  {
    _id: string;
    username: string;
    email: string;
  }
]


export const DashContacts = () => {

  const navigate = useNavigate();


  const dispatch = useAppDispatch();
  const allContacts = useAppSelector((state) => state.dashInfo.fetchedPContacts);

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
        // dispatch(fetchUserPContacts());

      }
      if (res.status === 201) {
        dispatch(setSelectedContact(data));


      }
      dispatch(fetchUserPContacts());
      dispatch(fetchUserPMessages())
      setSearchResult([]);
      dispatch(changeDashChat(true));


    } catch (error) {

      console.log(error)
    }



  }

  useEffect(() => {
    dispatch(fetchUserPContacts());
  }, [])

  return (

    <>

      <div className="dashContacts flex flex-col  bg-slate-200 p-3 rounded-3xl col-12 col-sm-6 col-md-6 col-lg-4">
        <div className="p-3 relative">
          <input id="searchInput" className="rounded-xl pl-11 relative py-1" type="search" placeholder="Search user" onChange={(e) => processSearch(e)} />
          <i className="fa-solid fa-magnifying-glass absolute left-6 top-6 text-2xl"></i>
          {searchResult?.length ? <>
            <ul className="bg-white border p-1 rounded-lg absolute z-10 w-3/5">
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
        <ContactList allContacts={allContacts} />

        <div className="gap-1 flex justify-between mt-1 text-white">

          <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
            return props.isActive ? "active w-1/2 p-2 rounded-bl-xl text-center" : "w-1/2  p-2 rounded-bl-xl text-center pending"
          }} to="/dashboard">
            Personal Chat

          </NavLink>

          <NavLink className={(props: { isActive: boolean, isPending: boolean }) => {
            return props.isActive ? "active w-1/2  p-2 rounded-br-xl text-center" : "w-1/2  p-2 rounded-br-xl text-center pending"
          }} to="/dashboardg">
            Group Chat

          </NavLink>
        </div>
      </div>


    </>
  )
}