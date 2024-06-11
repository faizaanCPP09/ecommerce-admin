//Handling API for a particular billboard. API calls for performing action for a single and particular billboard.
//we are going to perform: GET(for displaying) , PATCH(for updating), DELETE(for deleting) request.


import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

//API calls to perform action on a specific billboard
export async function GET(
    req: Request,
    { params }: { params: {  billboardId: string } }
) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard Id is Required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { label,imageUrl } = body;
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!label) {
            return new NextResponse("Label is Required", { status: 400 });
        }
        if (!imageUrl) {
            return new NextResponse("Image Url is Required", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("BillBoard Id is Required", { status: 400 });
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);


    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId:string ,billboardId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard Id is Required", { status: 400 });
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);


    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
};
