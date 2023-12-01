import React, { useState, useEffect } from 'react'
import { TDashGContact, TSearchedData, TUser } from '../../types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUserGContacts, setSelectedGContact } from '../../store/slices/dashGChatSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setToggleGInfo } from '../../store/slices/dashGChatSlice';


const GInfoWindow = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [search, setSearch] = useState<string>();
    const [searchResult, setSearchResult] = useState<[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<TUser[]>([]);
    const selectedGContact = useAppSelector((state) => state.dashGInfo.selectedGContact) as TDashGContact;
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const [newChatName, setNewChatName] = useState('');




    useEffect(() => {
        setNewChatName(selectedGContact.chatName);
        setSelectedUsers(() => {
            return (
                selectedGContact.users.map(elem => elem)
            )
        });
    }, [])




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


    const handleSearchedUser = (elem: TUser) => {


        for (let i = 0; i < selectedUsers.length; i++) {
            if (selectedUsers[i]._id === elem._id) {
                alert('User already added');
                return
            }
        }

        setSelectedUsers((prev) => {

            return [...prev, elem] as TUser[]
        })
        // selectedUsers.push(elem);



    }


    const handleUpdateGroup = async () => {

        try {
            if (newChatName === "") {
                alert('Write group name!');
                return;
            }
            if (selectedUsers.length < 2) {
                alert('Add atleast 2 users!');
                return;
            }

            const allUserIds = selectedUsers.map((obj) => obj._id);


            const res = await axios.post(`/api/grpcontact-routes/update-grp/${selectedGContact._id}`, {
                allUsers: JSON.stringify(allUserIds),
                grpName: newChatName,

            });


            if (res.status === 200) {
                dispatch(setToggleGInfo(false));
                dispatch(setSelectedGContact(res.data));
                dispatch(fetchUserGContacts());

            }


            if (res.status === 401) {
                navigate('/')
            }


        } catch (error) {
            console.log(error);
        }


    }



    const handleRemoveUser = (elem: TSearchedData) => {

        if (selectedGContact.groupAdmin._id !== userInfo._id) {
            alert('Only admin can remove the user');
            return;
        }

        for (let i = 0; i < selectedUsers.length; i++) {
            if (selectedUsers[i]._id === elem._id) {


                selectedUsers.splice(i, 1);
                setSelectedUsers((prev) => {
                    return [...prev]
                });


                return;
            }
        }

    }

    const handleChatName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewChatName(e.target.value)
    }
    const grpCreationDate = new Date(selectedGContact.createdAt).toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"})

    return (
        <>
            <div className="groupModal text-center w-100 h-100 flex justify-center items-center rounded-2xl">

                <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4 h-2/4 bg-slate-100 p-2 flex flex-col justify-evenly items-center rounded-lg shadow-lg ">

                    <div className="w-11/12 flex justify-end p-2 mt-4 ">

                        <i className="fa-regular fa-circle-xmark text-4xl text-black" role="button" onClick={() => dispatch(setToggleGInfo(false))} ></i>
                    </div>

                    <div className="p-1 flex flex-col items-start justify-center gap-1">
                        <h3 className='text-slate-500 text-xl  p-1 rounded-xl'>This group is created at(mm/dd/yyyy): {grpCreationDate}</h3>
                        <h2 className='text-slate-800 text-xl pl-1 text-left '>Group Admin: 

                        {
                            selectedGContact.groupAdmin._id === userInfo._id ? 'You' : `${selectedGContact.groupAdmin.username}`
                        }

                        </h2>
                    </div>

                    {
                        selectedUsers.length != 0 ? <>
                            <div className="w-3/4 mx-auto flex items-center justify-evenly gap-2 flex-wrap p-2">

                                {
                                    selectedUsers.map((elem: TUser, idx: number) => {
                                        return (
                                            <span key={idx} className="badge text-bg-warning rounded-2xl p-2 ">{elem.username}<i className="fa-solid fa-circle-xmark text-2xl  text-black rounded-full ml-3 cursor-pointer" onClick={() => handleRemoveUser(elem)} ></i></span>

                                        )
                                    })
                                }
                            </div>
                        </> : <></>
                    }

                    <div className="w-3/4 mx-auto p-2">
                        <input type="text" placeholder="Group Name" className="rounded-lg p-2 w-full text-2xl" onChange={(e) => { handleChatName(e) }} value={newChatName} />
                    </div>

                    <div className="w-3/4 mx-auto">


                        <div className="p-2 relative w-full">
                            <input className="rounded-xl pl-11 relative py-1 w-full text-2xl" type="search" placeholder="Search user" onChange={(e) => processSearch(e)} />
                            <i className="fa-solid fa-magnifying-glass absolute left-6 top-4 text-2xl"></i>
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
                        <button className="btn btn-success w-full text-2xl" onClick={handleUpdateGroup}>Update Group</button>
                    </div>


                </div>

            </div>
        </>
    )
}

export default GInfoWindow
