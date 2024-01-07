import { InvalidateQueryFilters, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "./hooks";
import { TDashChatSlice, fetchUserPContacts } from "../store/slices/dashChatSlice";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AnyAction, AsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { TDashGChatSlice } from "../store/slices/dashGChatSlice";
import { Dispatch } from "react";
import { TInitialState } from "../store/slices/dashboardSlice";
import { TPContact } from "../types";


const keys = {
    getUserPContacts: ["userPContacts"]
}

// const queryClient = useQueryClient();

// export const { mutateAsync: updateUserPContacts } = useMutation({
//     mutationFn: async () => {
//         const dispatch = useAppDispatch();
//         const navigate = useNavigate();
//         return dispatch(fetchUserPContacts()).unwrap().catch((err) => { console.log(err); navigate('/') }).finally(() => console.log('contact list mutation'))
//     },
//     onSuccess: () => {
//         queryClient.invalidateQueries(["userPContacts"] as InvalidateQueryFilters);
//     },

// });
type TProps = {
    dispatch: ThunkDispatch<{
        user: TInitialState;
        dashInfo: TDashChatSlice;
        dashGInfo: TDashGChatSlice;
    }, undefined, AnyAction>,
    fetchUserPContacts: AsyncThunk<TPContact[], void, any>,
    navigate: NavigateFunction
}

export function useGetUserPContacts({ dispatch, fetchUserPContacts, navigate }: TProps) {
    return useQuery({
        queryFn: () => dispatch(fetchUserPContacts()).unwrap().catch(() => { navigate('/') }),
        queryKey: keys.getUserPContacts,
        refetchOnMount: false,
        staleTime: Infinity
    });
}

type TUpdateProps = TProps & {
    queryClient:QueryClient
}
// type TUpdateProps = {
//     queryClient: QueryClient,
//     navigate: NavigateFunction,
//     dispatch: ThunkDispatch<{
//         user: TInitialState;
//         dashInfo: TDashChatSlice;
//         dashGInfo: TDashGChatSlice;
//     }, undefined, AnyAction>,
//     fetchUserPContacts: AsyncThunk<TPContact[], void, any>
// }
export function useUpdateUserPContacts({ queryClient, navigate, dispatch, fetchUserPContacts }:TUpdateProps) {
    return useMutation({
        mutationFn: () => dispatch(fetchUserPContacts()).unwrap().catch((err) => { console.log(err); navigate('/') }),
        onSuccess: () => {
            queryClient.invalidateQueries(["userPContacts"] as InvalidateQueryFilters);
        },
    })
}



