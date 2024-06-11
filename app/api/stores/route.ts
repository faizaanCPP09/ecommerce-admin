//API for creating a 'store'->In admin panel page, first we as admin need to create a store[category like: jeans,tshirt]
//Here we have created "API" for 'store'

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;
        //destructing name into body

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }
        if(!name){
            return new NextResponse("Name is required", {status:400});
        }
        const store = await prismadb.store.create({
            data:{
                name,
                userId
                //date time wil fetched from date and time function
            }
        });
        return NextResponse.json(store);
    }catch(error){
        console.log('[STORE_POST]',error);
        return new NextResponse("Internal error",{status:500});
    }
}