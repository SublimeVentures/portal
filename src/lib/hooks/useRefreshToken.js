import { useEffect, useState } from "react";

const useRefreshToken = () => {
   const {setAuth} = useAuth()

    const refresh = async () => {
       const response = "" // get on /refresh
        setAuth(prev => {
            console.log(JSON.stringify(prev))
            console.log(JSON.stringify(response))
            return {...prev, accessToken: response}
        })
        return response
    }

    return refresh;
};

export default useRefreshToken;
