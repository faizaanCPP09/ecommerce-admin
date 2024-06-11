"use client"
//Here we are writing code for 'store', when admin enters its dashboard, He/she can create a store[eg: Jeans, Caps]. For that the code is written. 

// zod is a is a "TypeScript-first schema declaration and validation library." zod is a library of primitives that allow developers to construct a representation of an object (a “schema”), and infer TypeScript types from it. It also provides tools to validate the values stored by a given object against such a schema.

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-hot-toast"

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";;
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1),    //name box: input->'string is required of min 1 length' 
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false); //states in 'React'->Here state signify that the box is loading after clicking on submission of store name 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
        },
    });

    const onSubmit = async(values: z.infer<typeof formSchema>)=>{
        //console.log(values); //These value are ready to be sent to server, from where we can now add it to the database
        //admin add a store_name on the dialog box and that value is stored, printed on console
        //Just for testing any error

        try {
            setLoading(true);

            //throw new Error("x"); ->>This error pops out if anything written wrong in store box creation[just for demonstration]
            const response = await axios.post('/api/stores', values);
            //console.log(response.data);
            //better to toast it
            toast.success("Store Created Successfully");    //pop-up when store added successfully
            console.log(response.data);
            window.location.assign(`/${response.data.id}`); //whenever the admin adds up a store, he will be redirected to dashboard
        } catch (error) {
            //console.log(error);
            //Toasting the error
            toast.error("Something went wrong.");
        }finally{
            setLoading(false);
        }


    }

return(
    <Modal
    title="Create Store"
    description="Add a new store to manage products and categories"
    isOpen = {storeModal.isOpen}
    onClose= {storeModal.onClose}
    >
        <div>
            <div className="space-y-4 py-2 pb-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control = {form.control}
                            name = "name"
                            render = {({field})=>(
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                        disabled={loading}
                                        placeholder="E-commerce"
                                        {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                            <div className="pt-6 space-x-2  flex items-center justify-end">
                            <Button
                                disabled={loading}
                                variant = "outline"
                                onClick={storeModal.onClose}>
                                   Cancel
                            </Button>
                            <Button disabled={loading} type="submit">Continue</Button>
                            </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>
  );
};

//Here we have created a 'StoreModal'. It shows how a dialog box with 'title' , 'desc' and state of the form that the form is closed or opened 