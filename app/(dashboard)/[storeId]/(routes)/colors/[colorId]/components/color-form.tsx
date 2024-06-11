//Like how we created 'setting-form & billboard-form & category-form & size-form' -> we have created a 'color-form'
//It shows up the front interface of colors:: `localhost:3000/[storeId]/colors/new`

"use client"

import { Trash } from "lucide-react";
import { useState } from "react";
import * as z from "zod"
import { Color } from "@prisma/client";
import { set, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/,{
        message:"String must be a valid hex code"
    })  //only hexcode will be allowed..as it is a component of colors-> in value of color you have to enter 'HEX-CODE' of colors(like: #FFF for white)
});
type ColorFormValues = z.infer<typeof formSchema>;


interface ColorFormProps {
    initialData: Color | null
}


export const ColorForm: React.FC<ColorFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }

    });

    const title = initialData ? "Edit Color" : "Create Color";
    const Description = initialData ? "Edit Color" : "Add a new Color";
    const toastMessage = initialData ? "Color Updated." : "Color Created.";
    const action = initialData ? "Save changes" : "Create";


    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
            }else{
                await axios.post(`/api/${params.storeId}/colors`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {

            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast.success("Color Deleted")

        } catch (error) {
            toast.error("Make Sure you remove all Products using this color first.");
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

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Color Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input disabled={loading} placeholder="Color Value" {...field} />
                                            <div 
                                                className="border p-4 rounded-full "
                                                style={{backgroundColor:field.value}}
                                            />
                                        </div>
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