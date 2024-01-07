import { InvalidateQueryFilters, QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { TDashChatSlice } from "../store/slices/dashChatSlice";
import { NavigateFunction } from "react-router-dom";
import { AnyAction, AsyncThunk, ThunkDispatch } from "@reduxjs/toolkit";
import { TDashGChatSlice } from "../store/slices/dashGChatSlice";

import { TInitialState } from "../store/slices/dashboardSlice";
import { TDashGContact } from "../types";


const keys = {
    getUserGContacts: ["userGContacts"]
}


type TGProps = {
    dispatch: ThunkDispatch<{
        user: TInitialState;
        dashInfo: TDashChatSlice;
        dashGInfo: TDashGChatSlice;
    }, undefined, AnyAction>,
    fetchUserGContacts: AsyncThunk<TDashGContact[], void, any>,
    navigate: NavigateFunction
}

export function useGetUserGContacts({ dispatch, fetchUserGContacts, navigate }: TGProps) {
    return useQuery({
        queryFn: () => dispatch(fetchUserGContacts()).unwrap().catch(() => { navigate('/') }),
        queryKey: keys.getUserGContacts,
        refetchOnMount: false,
        staleTime: Infinity
    });
}

type TUpdateGProps = TGProps & {
    queryClient:QueryClient
}

export function useUpdateUserGContacts({ queryClient, navigate, dispatch, fetchUserGContacts }:TUpdateGProps) {
    return useMutation({
        mutationFn: () => dispatch(fetchUserGContacts()).unwrap().catch(() => {  navigate('/') }),
        onSuccess: () => {
            queryClient.invalidateQueries(["userGContacts"] as InvalidateQueryFilters);
        },
    })
}



