import {useAuth}  from "../hooks/useAuth.js";
import {Navigate} from "react-router";
import Loader from "../../../components/Loader.jsx";

const Protected = ({children}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader message="Authenticating" />;
    }

    if(!user){
        return <Navigate to="/login" />;
    }

    return (
        <div>
            
            {children}
        </div>
    );
}   

export default Protected;
