import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import API from '../lib/api';

const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: API.login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });
}

export default useLogin
