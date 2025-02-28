//cell-action.tsx page is used for making of the 3rd row of size table, using drop-dowm menu from shadcn/ui library.
//Third row of 3-dots::: It consists of Actions: 'update', 'delete', 'copy' that particluar billboardId

"use client"

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { SizeColumn } from "./columns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: SizeColumn;

}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Size Id Copied to clipboard.")
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`)
            router.refresh();
            // router.push("/");
            toast.success("Size Deleted")

        } catch (error) {
            toast.error("Make Sure you remove all products using this size first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }


    

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={()=>setOpen(false)}
                onConfirm={onDelete}
                loading = {loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}