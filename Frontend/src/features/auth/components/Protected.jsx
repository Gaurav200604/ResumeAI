import {useAuth}  from "../hooks/useAuth.js";
import {Navigate} from "react-router";

import React from "react";

const Protected = ({children}) => {
    const { user, loading } = useAuth();
    

    if (loading) {
        return <div className='loading'>Loading...</div>
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
