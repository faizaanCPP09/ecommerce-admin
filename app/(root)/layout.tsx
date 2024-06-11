import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
    children
}:{
    children: React.ReactNode;          //datatypeof children
}) {
    const {userId} = auth();

    if(!userId){    //checks in for currently active user[if its loggedIn do not redirect]
        redirect('/sign-in');
    }
    const store = await prismadb.store.findFirst({//check if the user has any store created
        where:{
            userId
        }
    });
    if(store){
        redirect(`/${store.id}`);   //redirect to dashboard/storeID
    }
    return(
        <>
            {children}
        </>
    );
};