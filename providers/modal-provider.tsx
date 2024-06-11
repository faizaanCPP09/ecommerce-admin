"use client"

import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () =>{
    const[isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    //until the above cycle is not completed, it will return NULL
    //as we are using this provider in layout[root]..which is a server component & this 'modal-provider.tsx' is in client component->This will result into Hydration Error
    if(!isMounted){ //if the app is not mounted, meaning we are not in 'server site' and thus we are not going to render anything on server side.
        return null;    //to avoid hydration error
    }
    //what to return if we are on the server-site
    return(
        <>
        <StoreModal/>
        </>
    )
}