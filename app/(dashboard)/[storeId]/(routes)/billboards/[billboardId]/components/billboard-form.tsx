//Like how we created 'setting-form' for setting page we have created a 'billboard-form'
//we have used up a image upload component: cloudinary management/next-cloudinary
//image-upload component is from components/ui/image-uplaod.tsx

"use client"

import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({  //label and imageURL from schema prisma
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});
type BillboardFormValues = z.infer<typeof formSchema>;


interface BillboardFormProps {
    initialData: Billboard | null     //if billboard not found return null
}


export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        }
    });

    const title = initialData ? "Edit billboard" : "Create Bill Board";
    const Description = initialData ? "Edit a billboard" : "Add a new Bill Board";
    const toastMessage = initialData ? "Billboard Updated." : "BillBoard Created.";
    const action = initialData ? "Save changes" : "Create";


    // admin creating a new billboard for store, and submitting that:
    //1. Creating a new 'Billboard' for that particular store-> POST req
    //2. Updating an existing billboard->  PATCH req
    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if(initialData){//if you have initially created a billboard & update it!
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            }else{//else creating a new billboard
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/billboards`);  //it again refreshes to main screen/as of now[Where it shows BillBoards[0] Add New]
            toast.success(toastMessage);    //toastMessage will either show up that a particular billboard has been created OR existing billboard has been upadated.
            //when you recieve above toast msg->go to network&there will loading billboard..go to its response section and copy the 'id'[Billboard Id]->paste it in URL[localhost:3000/[storeId]/billboards/[billboardId]]-> you will enter in the page of edit that specific billboard
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false);
        }
    }
    // admin deleting a billboard, by using a DELETE req.
    const onDelete = async () => {
        try {

            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh();
            router.push(`/${params.storeId}/billboards`);  //for going back to store-billboard page
            toast.success("Billboard Deleted");
        } catch (error) {
            toast.error("Make Sure you remove all Categories using this billboard first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={Description}
                />
                {initialData &&
                    (<Button
                        disabled={loading}
                        variant={"destructive"}
                        size={"icon"}
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4 " />
                    </Button>)}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value?[field.value]:[]}
                                    disabled={loading} onChange={(url)=>field.onChange(url)}
                                    onRemove={()=>field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard label" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
                </form>
            </Form>
            {/* <Separator /> */}

        </>
    );
};