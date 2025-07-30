import { NextResponse } from "next/server";

export async function POST(req){
    const {email,name} = await req.json()

        // user already exist 

        // if user alrecy exist?
const users=await db.select().from(usersTable)
.where (eq(usersTabIe. email,email));


        // if not them insert new user

        if(users?.length == 0){
            const result =await db.insert(userTable).values({
                name:name,
                email:email

            }).returning(usersTable);
            console.log(result);
            return NextResponse.json(result)
        }


    return NextResponse.json(users[0])
}