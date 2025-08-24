import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import API from '../lib/api';

const useSignUp = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: API.signup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });
}

export default useSignUp
