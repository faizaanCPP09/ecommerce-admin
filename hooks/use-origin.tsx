//we have created this hook for API_ALERT:.. which will be displayed at below of settings page

import { useState, useEffect } from "react";

export const useOrigin = ()=>{
    const [mounted,setMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin? window.location.origin : "";

    useEffect(()=>{
        setMounted(true);
    },[])
    if(!mounted){
        return '';
    }
    return origin;
};