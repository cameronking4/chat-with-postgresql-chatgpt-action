// app/api/projects/route.ts
import { db } from "@/drizzle/db";
import { projects } from "@/drizzle/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("api-key");
  if (apiKey !== process.env.API_KEY) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { projectName, connectionString } = await request.json();

  if (!projectName || !connectionString) {
    return new NextResponse(
      JSON.stringify({
        error: "Project name and connection string are required",
      }),
      { status: 400 }
    );
  }

  await db.insert(projects).values({ projectName, connectionString });

  return new NextResponse(
    JSON.stringify({ message: "Project added successfully" }),
    {
      status: 201,
    }
  );
}
