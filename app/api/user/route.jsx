import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { usersTable } from "../../../config/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const { email, name } = await req.json();

        // Check if user already exists
        const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        // If user doesn't exist, create a new one
        if (users?.length === 0) {
            const [newUser] = await db
                .insert(usersTable)
                .values({
                    name: name,
                    email: email
                })
                .returning();
            
            return NextResponse.json(newUser, { status: 201 });
        }

        return NextResponse.json(users[0]);
    } catch (error) {
        console.error('Error in user API route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}