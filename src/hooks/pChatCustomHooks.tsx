import { InvalidateQueryFilters, QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { TDashChatSlice } from "../store/slices/dashChatSlice";
import { NavigateFunction } from "react-router-dom";
import { AnyAction, AsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { TDashGChatSlice } from "../store/slices/dashGChatSlice";

import { TInitialState } from "../store/slices/dashboardSlice";
import { TPContact } from "../types";


const keys = {
    getUserPContacts: ["userPContacts"]
}


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

export function useUpdateUserPContacts({ queryClient, navigate, dispatch, fetchUserPContacts }:TUpdateProps) {
    return useMutation({
        mutationFn: () => dispatch(fetchUserPContacts()).unwrap().catch((err) => { console.log(err); navigate('/') }),
        onSuccess: () => {
            queryClient.invalidateQueries(["userPContacts"] as InvalidateQueryFilters);
        },
    })
}



