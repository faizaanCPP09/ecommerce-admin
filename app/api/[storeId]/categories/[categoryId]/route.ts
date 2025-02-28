//Handling API for a particular categories. API calls for performing action for a single and particular categories.
//we are going to perform: GET(for displaying) , PATCH(for updating), DELETE(for deleting) request.

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


//API calls to perform action on a specific categories
export async function GET(
    req: Request,
    { params }: { params: {  categoryId: string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 });
        }


        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include:{
                billboard: true
            }
        });

        return NextResponse.json(category);


    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name,billboardId } = body;
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("name is Required", { status: 400 });
        }
        if (!billboardId) {
            return new NextResponse("BillBoard Id is Required", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 });
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

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);


    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
}



export async function DELETE(
    req: Request,
    { params }: { params: { storeId:string ,categoryId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!params.categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 });
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);


    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("internal Error", { status: 500 });
    }
}