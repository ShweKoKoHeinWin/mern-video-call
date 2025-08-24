import { useQuery } from '@tanstack/react-query';
import API from '../lib/api';

const useAuthUser = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: API.getAuthUser,
        retry: false,
    });
    const authUser = data?.user;
    return {isLoading, authUser}
}

export default useAuthUser
