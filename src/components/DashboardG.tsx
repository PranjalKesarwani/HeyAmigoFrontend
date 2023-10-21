import axios from "axios"
import { DashGroupContacts } from "./DashGContacts"
import { DashGChats } from "./DashGChats"
import { Navbar } from "./utility/Navbar"
import React, { useState, useEffect } from 'react'
import { TSearchedData } from "../types"
// import { changeDashChat, searchedResult } from "../store/slices/dashChatSlice"
import { useAppDispatch } from "../hooks/hooks"
import { useRef } from "react"
import { changeGDashChat, setAllGContacts } from "../store/slices/dashGChatSlice"
import { useNavigate } from "react-router-dom"



// type TselectedUsers = [TSearchedData]



export const DashboardG = () => {

    const navigate = useNavigate();

    const dispatch = useAppDispatch()

    const [modal, setModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>();
    const [searchResult, setSearchResult] = useState<[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<[TSearchedData] | []>([]);

    const grpNameRef = useRef<HTMLInputElement>(null);

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


    const handleSearchedUser = (elem: TSearchedData) => {

        console.log(elem);


        for (let i = 0; i < selectedUsers.length; i++) {
            if (selectedUsers[i]._id === elem._id) {
                alert('User already added');
                return
            }
        }
     
        setSelectedUsers((prev) => {

            return [...prev, elem] as [TSearchedData]
        })


    }


    const handleGroup = async () => {

        try {
            if (grpNameRef.current?.value === "") {
                alert('Write group name!');
                return;
            }
            if (selectedUsers.length < 2) {
                alert('Add atleast 2 users!');
                return;
            }

            const allUserIds = selectedUsers.map((obj) => obj._id);


            const res = await axios.post('/api/grpcontact-routes/create-grp', {
                allUsers: JSON.stringify(allUserIds),
                grpName: grpNameRef.current?.value
            });


            if (res.status === 401) {
                navigate('/')
            }
            if (res.status === 201) {
                dispatch(setAllGContacts(res.data));
                setModal(false);
                setSelectedUsers([]);
            }

        } catch (error) {
            console.log(error);
        }


    }

    const handleRemoveUser = (elem: TSearchedData) => {
        for (let i = 0; i < selectedUsers.length; i++) {
            if (selectedUsers[i]._id === elem._id) {

                selectedUsers.splice(i, 1);  //Removing usres from current state
                setSelectedUsers((prev) => {
                    return [...prev]        //Here setting the new state, which just had removed users just above
                });


                return
            }
        }

    }



    useEffect(() => {
        dispatch(changeGDashChat(false));
    }, [])

    return (
        <>
            <div className="dashBoard  flex flex-col bg-white ">
                <Navbar />

                {
                    !modal ? <><div className="dashBody w-screen  flex justify-between p-3">
                        <DashGroupContacts setModal={setModal} />
                        <DashGChats/>
                    </div>
                    </>
                        :
                        <>
                            <div className="groupModal text-center w-100 h-100 flex justify-center items-center">

                                <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4 h-2/4 bg-slate-100 p-2 flex flex-col justify-evenly items-center rounded-lg shadow-lg">

                                    <div className="w-11/12 flex justify-end p-2 mt-4 "><i className="fa-solid fa-x text-2xl text-red-500" role="button" onClick={() => setModal(false)} ></i></div>


                                    {
                                        selectedUsers.length != 0 ? <>
                                            <div className="w-3/4 mx-auto flex justify-evenly gap-2 flex-wrap p-2">

                                                {
                                                    selectedUsers.map((elem: TSearchedData, idx: number) => {
                                                        return (
                                                            <span key={idx} className="badge text-bg-primary rounded-2xl">{elem.username}<i className="fa-solid fa-x text-sm p-1 bg-white text-black rounded-full ml-3 cursor-pointer" onClick={() => handleRemoveUser(elem)} ></i></span>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </> : <></>
                                    }

                                    <div className="w-3/4 mx-auto p-2">
                                        <input type="text" placeholder="Group Name" className="rounded-lg p-2 w-full" ref={grpNameRef} />
                                    </div>

                                    <div className="w-3/4 mx-auto">


                                        <div className="p-2 relative w-full">
                                            <input className="rounded-xl pl-11 relative py-1 w-full" type="search" placeholder="Search user" onChange={(e) => processSearch(e)} />
                                            <i className="fa-solid fa-magnifying-glass absolute left-6 top-5 text-2xl"></i>
                                            {searchResult?.length ? <>
                                                <ul className="bg-white border p-1 rounded-lg absolute z-10 w-3/5">
                                                    {searchResult.map((elem: any, index: number) => {
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
                                    </div>

                                    <div className="w-3/5 p-2 mx-auto footer">
                                        <button className="btn btn-success w-full text-2xl" onClick={handleGroup}>Create</button>
                                    </div>


                                </div>

                            </div>
                        </>
                }

            </div>
        </>
    )
}