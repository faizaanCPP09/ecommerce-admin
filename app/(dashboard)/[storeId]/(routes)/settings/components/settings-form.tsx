//This form actually works for settings page->(localhost:3000/[storeId]/settings)
//Here we have developed a form using shadcn/ui components

"use client"

import * as z from "zod";
import { Store } from "@prisma/client" ;
import { Router, Trash } from "lucide-react" ;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";




interface SettingsFormProps {
    initialData: Store;
}

//form creation starts from 'z' zod/zodResolver
const formSchema = z.object({
    name: z.string().min(1),    //type of entry should be a string and of min length 1
});

type SettingsFormValues = z.infer<typeof formSchema>
export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
})=>{
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();         //to prevent hydration error we have declared it before[window.location.origin]

    //states in ReactJS
    const[open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);
    

    const form = useForm<SettingsFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues: initialData
    });

    //handling an api call of store_updation_name
    const onSubmit = async(data: SettingsFormValues) => {
        //console.log(data); //updated store name is printed->after 'save changes'

        //now we have below the api-call from api/stores/storeId/route.ts
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`,data);
            router.refresh();
            toast.success("Store updated.")
        } catch (error) {
            toast.error("Something Went Wrong");
        }finally{
            setLoading(false);
        }
    };

    //handling an api call of onDelete
    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push("/")       //goto the root folder[layout.tsx of root]
            toast.success("Store deleted.");
        } catch(error) {
            toast.error("Make sure you removed all the products and categories first.")
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
        <AlertModal 
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading
            title="Setting"
            description="Manage Store Preference"
            />
            <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>
        </div>
        <Separator/>  
        <Form {...form}>  
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({  field  })=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    Save Changes
                </Button>
            </form>
        </Form>
        <Separator/>
        <ApiAlert
          title="NEXT_PUBLIC_API_URL"
          description={`${origin}/api/${params.storeId}`}
          variant="public"
        />
        </>
    );
};

