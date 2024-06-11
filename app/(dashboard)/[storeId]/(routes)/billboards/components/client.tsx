"use client"

import { Plus } from "lucide-react";
import { useParams,useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface BillboardClientProps{
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                title ={`BillBoards (${data.length})`} //keeping it dynamic (if we created 2 billboard of a single store selected..it will showup Billboard(2) on successfully adding the 2nd billboard)
                description="Manage Billboards for your store"
                />
                <Button onClick={()=>router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="label" columns={columns} data={data} />
            <Heading title="API" description="API calls for Billboards"/>
            <Separator/>
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}