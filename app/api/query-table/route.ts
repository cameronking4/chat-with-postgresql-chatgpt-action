import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { connectionString, table, fields, conditions } = body;
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // If no fields are provided, select all fields
    const selectedFields =
      fields && fields.length > 0
        ? fields.map((field: any) => `"${field}"`).join(", ")
        : "*";

    // Construct conditions if provided
    let conditionString = "1=1"; // Default to no condition
    if (conditions && Object.keys(conditions).length > 0) {
      conditionString = Object.keys(conditions)
        .map((key) => `"${key}" = '${conditions[key]}'`)
        .join(" AND ");
    }

    // Build and execute the query
    const query = `SELECT ${selectedFields} FROM "${table}" WHERE ${conditionString}`;
    const result = await client.query(query);

    // Dynamically format rows for better readability
    const formattedRows = result.rows.map((row: any) => {
      const formattedRow: any = {};

      Object.keys(row).forEach((key) => {
        const value = row[key];
        // Truncate long text fields for readability
        formattedRow[key] =
          typeof value === "string" && value.length > 100
            ? value.slice(0, 100) + "..."
            : value;
      });

      return formattedRow;
    });

    return NextResponse.json(formattedRows);
  } catch (error) {
    return NextResponse.json(
      { error: "Error querying table", details: error },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
