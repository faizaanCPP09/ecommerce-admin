//API for creating a 'category'->[create a category for a particular store/billboard OR updating an existing category OR Deleting an existing catefory from a store/billboard]
//It uses POST(for creating) , PATCH(for updating), DELETE(for deleting) request.
//Here we have created "API" for 'category'

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }:{params:{storeId: string}}  //as always we have to access storeid..to confirm that we are adding CATEGORY in current store
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;
        //destructing name into body

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!name){
            return new NextResponse("Name is required", {status:400});
        }
        if(!billboardId){
            return new NextResponse("BillboardId is required", {status:400});
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
        const category = await prismadb.category.create({
            data:{
                name,
                billboardId,
                storeId: params.storeId
            }
        });
        return NextResponse.json(category);
    }catch(error){
        console.log('[CATEGORIES_POST]',error);
        return new NextResponse("Internal error",{status:500});
    }
}


//for loading all the categories available on that store
export async function GET(
    req: Request,
    {params}:{params: {storeId:string}}
) {
    try {
        
        if(!params.storeId){
            return new NextResponse("Store Id is Required", { status: 400 });
        }

        const categories = await prismadb.category.findMany({
            where:{
                storeId : params.storeId
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}