# Chat with Database - Supabase / Vercel Storage
Use natural language to retrieve database values realtime and have ChatGPT analyze data from storage options from Supabase or Vercel - KV or Postgres DB. Host your own Next14 Admin API to securely browse your DB through ChatGPT

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) for storing database connection strings for various side projects.

This API using Next14 enables me to have a custom GPT in ChatGPT where I can query data from various side project. I can now ask ChatGPT how many users do I have and other SQL queries using natural language.

![Screenshot 2024-09-18 at 10 41 29 PM](https://github.com/user-attachments/assets/ab1e1342-828a-485e-a034-ed181520a4d0)

You could extend this API to build a frontend application to manage your side projects.

Get connection string for my project BuyMyRepo, then use it to understand my database. Once understood, show me a table of my users with their app profile details in a nice table.


## Deploy on Vercel

Deploy this project in one click:

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcameronking4%2FPostgreSQL-Databse-Viewer-Action&env=API_KEY,DATABASE_URL&envDescription=API%20KEY%20is%20your%20secure%20password%20for%20retrieving%20the%20contents%20of%20this%20database.%20Database%20URL%20is%20a%20PostgreSQL%20database%20connection%20string%20for%20storing%20your%20projects%20and%20their%20database%20strings%20(meta%20right%3F).&project-name=sideprojects-api&redirect-url=https%3A%2F%2Fgpteezy.com&demo-title=Database%20Viewer%20%26%20Query%20API&demo-description=Next14%20API%20to%20store%20databse%20credentials%20for%20projects%20and%20query%20tables%2C%20enabling%20us%20to%20ask%20Q%26A%20in%20ChatGPT%20for%20one%20or%20more%20projects.&demo-url=https%3A%2F%2Fchatgpt.com%2Fg%2Fg-Sc8RilbI3-chat-with-database-supabase-vercel-storage&demo-image=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2Fv2%2FD4D12AQESn_xZF0JVNw%2Farticle-cover_image-shrink_720_1280%2Farticle-cover_image-shrink_720_1280%2F0%2F1680352010620%3Fe%3D2147483647%26v%3Dbeta%26t%3DsDIgL_YHFIZ_Vg7-yCcmu8PjoPQLTNOfK45Lb36NTHM>)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Create a Custom GPT in ChatGPT
1. Deploy this project to Vercel with your .env values for a PostgresQL DATABASE_URL and your own API_KEY password
2. Click Actions
3. ***Choose API KEY option for Authorization and select the option "Custom" header
4. Set the custom header value to "api-key"*** & set your API_KEY value here
5. Copy & Paste the following YAML spec into the "Schema":
```yaml
openapi: 3.1.0
info:
  title: PostgreSQL Database Viewer API
  description: API for interacting with PostgreSQL databases to retrieve schema, query tables dynamically, and manage project connection strings.
  version: "1.0.0"
servers:
  - url: https://postgre-sql-databse-viewer-action.vercel.app
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: api-key
  schemas:
    Project:
      type: object
      properties:
        projectName:
          type: string
          description: The name of the project.
        connectionString:
          type: string
          description: The connection string for the PostgreSQL database.
    ErrorResponse:
      type: object
      properties:
        error:
          type: string
        details:
          type: object
security:
  - ApiKeyAuth: []
paths:
  /api/get-db-schema:
    post:
      operationId: getDbSchema
      summary: Get Database Schema
      description: Retrieve the schema (table names and column details) from the specified PostgreSQL database.
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Project'
      responses:
        '200':
          description: Schema information retrieved successfully.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    table_name:
                      type: string
                    column_name:
                      type: string
                    data_type:
                      type: string
        '401':
          description: Unauthorized. API key is missing or invalid.
        '500':
          description: Error querying the database schema.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
  /api/query-table:
    post:
      operationId: queryTable
      summary: Query Table
      description: Query a specified table in the PostgreSQL database and retrieve records based on optional conditions.
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                connectionString:
                  type: string
                  description: Connection string for the PostgreSQL database.
                table:
                  type: string
                  description: The name of the table to query.
                fields:
                  type: array
                  items:
                    type: string
                  description: Optional array of fields to retrieve.
                conditions:
                  type: object
                  description: Optional conditions for querying records.
      responses:
        '200':
          description: Records retrieved successfully.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  additionalProperties:
                    type: string
        '401':
          description: Unauthorized. API key is missing or invalid.
        '500':
          description: Error querying the table.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
  /api/projects:
    post:
      operationId: createProject
      summary: Create Project
      description: Add a new project with its corresponding connection string to the system.
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Project'
      responses:
        '201':
          description: Project added successfully.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
        '401':
          description: Unauthorized. API key is missing or invalid.
        '500':
          description: Error adding project.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
  /api/projects/{projectName}:
    get:
      operationId: getProjectConnectionString
      summary: Get Project Connection String
      description: Retrieve the connection string for a project by its name.
      security:
        - ApiKeyAuth: []
      parameters:
        - name: projectName
          in: path
          required: true
          schema:
            type: string
          description: The name of the project.
      responses:
        '200':
          description: Connection string retrieved successfully.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
        '401':
          description: Unauthorized. API key is missing or invalid.
        '404':
          description: Project not found.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Error retrieving project connection string.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
```

## API Endpoints

1. POST: Add Project and Connection String

```bash
curl -X POST http://localhost:3000/api/projects \
-H "api-key: MOCHA1233" \
-H "Content-Type: application/json" \
-d '{"projectName": "MyProject", "connectionString": "postgres://your_db_user:your_db_password@localhost:5432/your_db_name"}'
```

2. GET: Retrieve Connection String by Project Name

```bash
curl -X GET http://localhost:3000/api/projects/MyProject \
-H "api-key: API-KEY-HERE"
```

3. POST: Fetch Schema Information from a Database

```bash
curl -X POST http://localhost:3000/api/fetch-schema \
-H "api-key: API-KEY-HERE" \
-H "Content-Type: application/json" \
-d '{"connectionString": "postgres://your_db_user:your_db_password@localhost:5432/your_db_name"}'
```

4. POST: Query a Table with Fields and Conditions

```bash
curl -X POST http://localhost:3000/api/query-table \
-H "api-key: API-KEY-HERE" \
-H "Content-Type: application/json" \
-d '{"connectionString": "postgres://your_db_user:your_db_password@localhost:5432/your_db_name", "table": "your_table", "fields": ["field1", "field2"], "conditions": {"field1": "value1"}}'
```

## Get started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


