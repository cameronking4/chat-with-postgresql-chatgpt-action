import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { connectionString, table, fields, conditions } = body;
  const client = new Client({ connectionString });

  try {
    await client.connect();
    const query = `SELECT ${fields.join(", ")} FROM ${table} WHERE ${
      conditions || "1=1"
    }`;
    const result = await client.query(query);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Error querying table", details: error },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
