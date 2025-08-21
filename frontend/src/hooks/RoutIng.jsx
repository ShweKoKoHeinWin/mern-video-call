import { Navigate } from "react-router";

const RoutIng = ({isAllow, children, redirect = '/'}) => {
    if (!!isAllow) return children;
    return <Navigate to={redirect} />
}

export default RoutIng
