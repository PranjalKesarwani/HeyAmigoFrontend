import axios from "axios"
import { DashGroupContacts } from "./DashGContacts"
import { DashGChats } from "./DashGChats"
import { Navbar } from "./utility/Navbar"
import React, { useState, useEffect } from 'react'
import { TSearchedData } from "../types"
// import { changeDashChat, searchedResult } from "../store/slices/dashChatSlice"
import { useAppDispatch, useAppSelector } from "../hooks/hooks"
import { useRef } from "react"
import { changeGDashChat, fetchUserGContacts, setAllGContacts } from "../store/slices/dashGChatSlice"
import { useNavigate } from "react-router-dom"
import PrevScreen from "./Miscellaneous/PrevScreen"
// import AllMediaComponent from "./Miscellaneous/AllMediaComponent"
import AllMediaGComponent from "./Miscellaneous/AllMediaGComponent"
import { useSocket } from "../context/socketContext"
import { BASE_URL, get_config, post_config } from "../Url/Url"
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUpdateUserGContacts } from "../hooks/gChatCustomHook"

// const base_url = '${BASE_URL}';



// type TselectedUsers = [TSearchedData]



export const DashboardG = () => {

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { dark, light, isChecked } = useSocket();

    const [modal, setModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>();
    const [searchResult, setSearchResult] = useState<[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<[TSearchedData] | []>([]);

    const user = useAppSelector((state) => state.user);
    const dashGInfo = useAppSelector((state) => state.dashGInfo);
    const queryClient = useQueryClient();

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

            const res = await axios.get(`${BASE_URL}/api/auth/searchuser?search=${search}`,get_config);



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

    // const { mutateAsync: updateUserGContacts } = useMutation({
    //     mutationFn: () => dispatch(fetchUserGContacts()).unwrap().catch((err) => { console.log(err); navigate('/') }).finally(() => console.log('contact list mutation')),
    //     onSuccess: () => {
    //       queryClient.invalidateQueries(["userGContacts"] as InvalidateQueryFilters);
    //     },
    
    //   });
    const { mutateAsync: updateUserGContacts } = useUpdateUserGContacts({ queryClient, navigate, dispatch, fetchUserGContacts });

      


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


            const res = await axios.post(`${BASE_URL}/api/grpcontact-routes/create-grp`, {
                allUsers: JSON.stringify(allUserIds),
                grpName: grpNameRef.current?.value
            },post_config);


            if (res.status === 401) {
                navigate('/')
            }
            if (res.status === 201) {
                dispatch(setAllGContacts(res.data));
                updateUserGContacts();
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
            <div className="dashBoard  flex flex-col  relative justify-center max-w-[1700px] mx-auto max-h-[1100px]">


                {
                    user.togglePrevScreen ? <><PrevScreen imgUrl={user.prevUrl} /></> : <></>
                }

                <Navbar />

                {
                    !modal ? <><div className={`dashBody w-screen  flex justify-center p-2 sm:p-3 sm:justify-evenly gap-2 relative ${isChecked ? dark : light}`}>
                        {
                            dashGInfo.isAllGImages &&
                            (

                                <AllMediaGComponent />
                            )
                        }


                        <DashGroupContacts setModal={setModal} />
                        <DashGChats />
                    </div>
                    </>
                        :
                        <>
                            <div className={`groupModal text-center w-100 h-100 flex justify-center items-center ${isChecked ? dark : light}`}>

                                <div className={`relative col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4 h-2/4  p-2 flex flex-col justify-evenly items-center rounded-lg ${isChecked ? 'planeEffectD' : 'planeEffectL'}`}>

                                    
                                        <i className={`fa-regular fa-circle-xmark text-4xl  absolute top-8 right-8 ${isChecked ? 'text-slate-300' : 'text-black'}`} role="button" onClick={() => setModal(false)} ></i>
                             


                                    {
                                        selectedUsers.length != 0 ? <>
                                            <div className="w-3/4 mx-auto flex justify-evenly gap-2 flex-wrap p-2 ">

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
                                        <input type="text" placeholder="Group Name" className={`rounded-lg p-2 w-full ${isChecked ? 'inputEffectD text-slate-300' : 'inputEffectL text-black'}`} ref={grpNameRef} />
                                    </div>

                                    <div className="w-3/4 mx-auto">


                                        <div className="p-2 relative w-full">
                                            <input className={`rounded-xl pl-11 relative py-1 w-full ${isChecked ? 'inputEffectD text-slate-300' : 'inputEffectL text-black'}`} type="search" placeholder="Search user" onChange={(e) => processSearch(e)} />
                                            <i className={`fa-solid fa-magnifying-glass absolute left-6 top-4 text-2xl ${isChecked ? 'text-slate-300' : 'text-black'}`}></i>
                                            {searchResult?.length ? <>
                                                <ul className="bg-white border p-1 rounded-lg absolute z-10 w-3/5 h-[20rem] overflow-y-scroll">
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