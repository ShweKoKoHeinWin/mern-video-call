import { Loader } from 'lucide-react'
import React from 'react'
import useTheme from "../stores/useThemeStore";

const PageLoader = () => {
    const {theme} = useTheme();
    return (
        <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
            <Loader className='animate-spin size-10 text-primary' />
        </div>
    )
}

export default PageLoader
