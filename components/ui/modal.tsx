"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "./dialog";

interface ModalProps{
    title: string;
    description: string;
    isOpen: boolean;
    onClose:()=>void;
    children?:React.ReactNode;
};

export const Modal: React.FC<ModalProps>=({
    title,
    description,
    isOpen,
    onClose,
    children
})=>{
    const onChange = (open: boolean)=>{
        if(!open){
            onClose();
        }
    };
    return(
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    );
};

//This 'modal.tsx' handles the dialog: Like the content of it[title,desc,header, functionality of onChange and closing] 