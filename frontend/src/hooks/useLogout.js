import React from 'react'
import api from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });
}

export default useLogout
