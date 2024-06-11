//by this way of folder management-> 'api/stores/[storeId]/routes.ts' we are actually going to manage and target individual store
//we have to create 'two route api calls': 1.Updation of store_name[using PATCH request]
//                                         2.Deletion of store [using DELETE req]


import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

//'PATCH' req is used for updation of store name in setting functionality
export async function PATCH(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name} = body;  //destructure 'name' from body
        if(!userId){
            return new NextResponse("Unauthenticated" , {status:401})
        }
        if(!name){
            return new NextResponse("Name is Required",{status:400});
        }

        if(!params.storeId){
            return new NextResponse("Store Id is Required",{status:400});
        }
        //update the store
        const store = await prismadb.store.updateMany({
            where:{
                id:params.storeId,
                userId
            },
            data:{
                name
            }
        });

        return NextResponse.json(store);


    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("internal Error",{status:500});
    }
}


//'DELETE' req is used for deletion of store name in setting functionality
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is Required", { status: 400 });
        }
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store);


    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
}