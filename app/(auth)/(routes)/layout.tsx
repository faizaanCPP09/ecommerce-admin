export default function AuthLayout({
    children
}: {
    children:React.ReactNode
}){
    return (
        <div className="flex items-center flex-col justify-center mt-2 h-full">
            {children}
        </div>
    )
}