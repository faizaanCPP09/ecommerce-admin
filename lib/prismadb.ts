//PrismaDB setup first code
import { PrismaClient } from "@prisma/client";

declare global{
    var prisma: PrismaClient | undefined
};//dec. of global variable named 'prisma'

const prismadb = globalThis.prisma || new PrismaClient();
//Here, the code checks if there is already a prisma instance in the global scope (globalThis.prisma). If there isn't one, it creates a new instance of PrismaClient and assigns it to prismadb.

if(process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;
//check for the development environment

export default prismadb;