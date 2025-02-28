//Handling API for a color. API calls for performing action for a single and particular color.
//we are going to perform: GET(for displaying) , PATCH(for updating), DELETE(for deleting) request for a single 'colorId' entity.


import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: {  colorId: string } }
) {
    try {

        if (!params.colorId) {
            return new NextResponse("Color Id is Required", { status: 400 });
        }


        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);


    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name,value } = body;
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }
        if (!value) {
            return new NextResponse("Value is Required", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("Color Id is Required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized ", { status: 403 });
        }

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);


    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId:string ,colorId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.colorId) {
            return new NextResponse("Color Id is Required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized ", { status: 403 });
        }

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);


    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
}
