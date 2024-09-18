import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { connectionString } = body;
  const client = new Client({ connectionString });

  try {
    await client.connect();
    const result = await client.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, column_name;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching schema", details: error },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
