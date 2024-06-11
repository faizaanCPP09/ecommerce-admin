//For authentication and checking the existance of store
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import Navbar  from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params
}:{
    children: React.ReactNode
    params: {storeId: string}
}) {
    const {userId} = auth(); //fetch userId from 'auth'

    if(!userId){
        redirect('/sign-in')
    }

    //confirming finally that this store exists
    const store = await prismadb.store.findFirst({
        where:{
            id: params.storeId,
            userId
        }
    });
    if(!store){//hence, there is a store..so we did not redirect
        redirect('/');
    }
    return(
        <>
        <Navbar/>
        {children}
        </>
    )
}