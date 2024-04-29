import StorageService from "@/services/StorageService";
import Router, { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

const AuthProvider = ({children}: {children: ReactElement}) => {

    const router = useRouter()

    const [verified, setVerified] = useState<boolean>(false)

    useEffect(() => {
        if(!router.pathname.includes("/authenticate")){
            router.push("/authenticate")
            setVerified(true)
        }else if(router.pathname.includes("/authenticate")){
            setVerified(true)
        }else{
            setVerified(false)
        }
    }, [])

    if(verified)
        return <div>{children}</div>
    else
        return <div></div>
}

export default AuthProvider;