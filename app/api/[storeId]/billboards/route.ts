//API for creating a 'billboard'->[create a billboard for a particular store_storeId]
//Here we have created "API" for 'billboard'

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }:{params:{storeId: string}}  //as always we have to access storeid..to confirm that we are adding billboard in current store
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;
        //destructing name into body

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!label){
            return new NextResponse("Name is required", {status:400});
        }
        if(!imageUrl){
            return new NextResponse("Image URL is required", {status:400});
        }
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status:400});
        }
        //here below we are finding storeId for a particular user
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse("Unauthorized ",{status:403});
        }
        const billboard = await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeId: params.storeId
            }
        });
        return NextResponse.json(billboard);
    }catch(error){
        console.log('[BILLBOARDS_POST]',error);
        return new NextResponse("Internal error",{status:500});
    }
}


//for loading all the billboards available on that store
export async function GET(
    req: Request,
    {params}:{params: {storeId:string}}
) {
    try {
        
        if(!params.storeId){
            return new NextResponse("Store Id is Required", { status: 400 });
        }

        const billboards = await prismadb.billboard.findMany({
            where:{
                storeId : params.storeId
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}