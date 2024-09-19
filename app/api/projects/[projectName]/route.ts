// app/api/projects/[projectName]/route.ts
import { db } from "@/drizzle/db";
import { projects } from "@/drizzle/schema";
import { eq } from "drizzle-orm"; // Import the comparison operator
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectName: string } }
) {
  const apiKey = request.headers.get("api-key");
  if (apiKey !== process.env.API_KEY) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const projectName = params.projectName;

  // Use 'eq' for comparison
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.projectName, projectName))
    .limit(1);

  if (project.length === 0) {
    return new NextResponse(JSON.stringify({ error: "Project not found" }), {
      status: 404,
    });
  }

  return new NextResponse(
    JSON.stringify({ connectionString: project[0].connectionString }),
    {
      status: 200,
    }
  );
}
