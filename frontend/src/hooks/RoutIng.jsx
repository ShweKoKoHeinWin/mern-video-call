import { Navigate } from "react-router";

const RoutIng = ({isAllow, children, redirect = '/'}) => {
    console.log(!!isAllow, redirect)
    if (!!isAllow) return children;
    return <Navigate to={redirect} />
}

export default RoutIng
