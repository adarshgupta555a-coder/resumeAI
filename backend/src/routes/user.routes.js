import express from "express";
import multer from "multer";
import path from "path";
import { readFileSync } from "fs";
import pdf from "pdf-parse-new";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { pool } from "../db.js";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const router = express.Router();

const embedding = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-2-preview",
    apiKey: process.env.GEMINI_API_KEY
})

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    apiKey: process.env.GEMINI_API_KEY
})

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (_, file, cb) => {
        cb(
            file.mimetype === "application/pdf"
                ? null
                : new Error("Only PDF allowed"),

            file.mimetype === "application/pdf"
        );
    }
});

router.get("/verify/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            res.json({ message: "user id is not found." });
            return;
        }

        const fileData = await pool.query(
            `
                SELECT *
               FROM resume
               WHERE client_id = $1
             `,
            [id]
        );

        if (fileData.rows.length > 0) {
            res.send({message:true})
        } else{
            res.json({message:false})
        }



    } catch (error) {
        console.log(error)
    }
})

router.post("/query", async (req, res) => {
    const { query, userId } = req.body;

    try {


        console.log(userId)
        console.log(query)

        const fileData = await pool.query(
            `
    SELECT *
    FROM resume
    WHERE client_id = $1
  `,
            [userId]
        );
        // console.log(fileData.rows)
        // console.log(fileData.rows)
        const chunks = JSON.parse(fileData.rows[0].filedata)
        console.log(chunks)

        const documents = await chunks.map(
            chunk => new Document({ pageContent: chunk })
        );


        const vectorStore = await MemoryVectorStore.fromDocuments(
            documents,
            embedding
        );

        const retrieve = await vectorStore.asRetriever({
            k: 2
        })

        let result = await retrieve.invoke(query);
        result = result.map(item => item.pageContent).join("\n\n");
        // console.log(result[0]);
        console.log(result)
        const response = await model.invoke(`
      You are a helpful career assistant.

        Context:
        ${result}

        Question:
        ${query}

        Instructions:
        - Answer based only on context
        - If not found, say "Not available in resume"
        - Give short and clear answer (max 100 words)      
        - And you can give me career advice  
        `)

        res.send({ response })

    } catch (error) {
        console.log(error)
    }

})

router.post("/resume", upload.single("document"), async (req, res) => {
    try {

        if (!req.file) {
            return res
                .status(400)
                .json({
                    message:
                        "No file uploaded",
                });
        }

        // file directly buffer me milegi
        const pdfBuffer = req.file.buffer;
        const client_id = req.body.client_id;
        // Read pdf
        // const dataBuffer = readFileSync(req.file.path);

        // Extract text
        const pdfData = await pdf(pdfBuffer);

        // Split text
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        });


        const chunks = await splitter.splitText(
            pdfData.text
        );

        console.log(client_id);
        console.log(chunks)
        const result = await pool.query(
            `
            insert into resume(client_id, filedata) values($1, $2) returning *
            `,
            [client_id, JSON.stringify(chunks)]
        )

        // console.log(result)


        res.json({
            totalChunks:
                chunks.length,
            chunks:
                chunks.slice(0, 5),

            result
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            error:
                err.message,
        });
    }
}
);

export default router;