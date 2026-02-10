import swaggerJSDoc from "swagger-jsdoc"

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "API documentation",
        },
        servers: [
            {
                url: "http://localhost:6060",
            },
        ],

        //     components: {
        //         securitySchemes: {
        //             bearerAuth: {
        //                 type: "http",
        //                 scheme: "bearer",
        //                 bearerFormat: "JWT",
        //             },
        //         },
        //     },

        //     // 👇 ใส่ตรงนี้ (global)
        //     security: [{ bearerAuth: [] }],

    },
    apis: ["./src/routes/*.ts"], // ไฟล์ที่มี comment swagger
}



export const swaggerSpec = swaggerJSDoc(options)
