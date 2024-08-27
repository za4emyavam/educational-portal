import {useAuth} from "../security/AuthContext";
import {Navigate} from "react-router-dom";

export default function LogoutComponent() {
    const authContext = useAuth()
    authContext.logout()

    return <Navigate to="/"/>
}