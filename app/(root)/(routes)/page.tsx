"use client"

import { useEffect } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";

// zustand for global state management
// import { Modal } from "@/components/ui/modal";
// import { Button } from "@/components/ui/button";
// import { UserButton } from "@clerk/nextjs";


const SetupPage = () =>{
    //ensure that the reusable Modal[dialog] do not close, unless until we add a store
    const onOpen = useStoreModal((state)=>state.onOpen);
    const isOpen = useStoreModal((state)=>state.isOpen);

    useEffect(()=>{
        if(!isOpen){
            onOpen();
        }
    },[isOpen, onOpen]);
    
return null;

}
export default SetupPage;

//NOTE: 'npm i zustand' package is used for dialog box form