const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const FirecrawlApp = require('@mendable/firecrawl-js').default;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require('@supabase/supabase-js');

// Load envs
dotenv.config();

// env vars
const PORT = process.env.PORT || 8000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY;

// validate env vars
if (!GOOGLE_API_KEY || !FIRECRAWL_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing required environment variables");
    process.exit(1);
}

// clients initialization
const fcapp = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// models setup
const summaryModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});
const summaryGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
const summarySystemInstruction = "You are a helpful assistant that generates concise summaries. Based on the following extracted markdown from a website, generate a concise summary in 2-3 sentences. JUST GIVE THE SUMMARY NOTHING ELSE, do not start with 'Here is the summary' or anything like that.";

const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// extract content helper func  
async function extractContent(url) {
    try {
        const scrapeResult = await fcapp.scrapeUrl(url, { formats: ['markdown'] });
        if (scrapeResult && typeof scrapeResult.markdown === 'string') {
            return scrapeResult.markdown;
        } else {
            return "";
        }
    } catch (error) {
        return "";
    }
}

// generate summary
async function generateSummary(data) {
    if (!data || data.trim().length === 0) {
        return "";
    }
    try {
        const result = await summaryModel.generateContent({
            contents: [{ role: "user", parts: [{ text: `Extracted markdown data: ${data}` }] }],
            generationConfig: summaryGenerationConfig,
            systemInstruction: { role: "system", parts: [{ text: summarySystemInstruction }] },
        });

        if (result && result.response && typeof result.response.text === 'function') {
             return result.response.text().trim();
        } else {
             throw new Error("Could not parse summary from Gemini response.");
        }
    } catch (error) {
        throw new Error(`Error generating summary: ${error.message}`);
    }
}

// generate embeddings
async function generateEmbedding(text, taskType, title) {
    if (!text || text.trim().length === 0) {
        throw new Error("Cannot generate embedding for empty text.");
    }
    try {
        const embedContentRequest = {
             content: { parts: [{ text }] },
             taskType: taskType,
        };

        if (title && (taskType === 'RETRIEVAL_DOCUMENT' || taskType === 'DOCUMENT')) {
           embedContentRequest.title = title;
        }

        const result = await embeddingModel.embedContent(embedContentRequest);

        if (result && result.embedding && Array.isArray(result.embedding.values)) {
             const embedding = result.embedding.values;
             if (embedding.length === 0) {
                  throw new Error("Gemini API returned an empty embedding vector.");
             }
             return embedding;
        } else {
             throw new Error("Could not parse embedding vector from Gemini response.");
        }
    } catch (error) {
        throw new Error(`Error generating embedding: ${error.message}`);
    }
}

// knn stuff
function euclideanDistance(vec1, vec2) {
    if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length || vec1.length === 0) {
        return Infinity;
    }
    let sumOfSquares = 0;
    for (let i = 0; i < vec1.length; i++) {
        if (typeof vec1[i] !== 'number' || typeof vec2[i] !== 'number') {
             return Infinity;
        }
        sumOfSquares += (vec1[i] - vec2[i]) ** 2;
    }
    return Math.sqrt(sumOfSquares);
}

const app = express();

// more middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Status endpoint
app.get("/status", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Summarize endpoint
app.post("/summarize", async (req, res) => {
    const { url } = req.body;

    try {
        const { data: existing, error: selectError } = await supabase
            .from('links')
            .select('id, summary')
            .eq('url', url)
            .maybeSingle();

        if (selectError) {
            return res.status(500).json({ detail: "Database error checking for existing URL." });
        }

        if (existing) {
            return res.status(200).json({ summary: existing.summary });
        }

        const content = await extractContent(url);
        const summary = await generateSummary(content);

        let embedding;
        try {
            embedding = await generateEmbedding(summary, 'RETRIEVAL_DOCUMENT', `Summary for ${url}`);
        } catch (embeddingError) {
            return res.status(500).json({ detail: `Failed to generate embedding: ${embeddingError.message}` });
        }

        const vectorData = JSON.stringify(embedding);

        const { data: insertData, error: insertError } = await supabase
            .from('links')
            .insert({
                url: url,
                summary: summary,
                vector: vectorData
            })
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ detail: "Failed to insert data into database." });
        }

        res.status(200).json({ summary: summary });

    } catch (error) {
        res.status(500).json({ detail: "Error during summarization." });
    }
});

// Search endpoint
app.post("/search", async (req, res) => {
    const { query, k = 3 } = req.body;

    try {
        let queryEmbedding;
        try {
            queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
        } catch (embeddingError) {
            return res.status(500).json({ detail: `Failed to generate query embedding: ${embeddingError.message}` });
        }

        const { data: links, error: fetchError } = await supabase
            .from('links')
            .select('id, url, summary, vector');

        if (fetchError) {
            return res.status(500).json({ detail: "Database error fetching links." });
        }

        if (!links || links.length === 0) {
            return res.status(200).json({ matches: [] });
        }

        const distances = [];
        for (const link of links) {
            if (link.vector && typeof link.vector === 'string') {
                const dbVector = JSON.parse(link.vector);
                if (Array.isArray(dbVector) && dbVector.length > 0) {
                    const dist = euclideanDistance(queryEmbedding, dbVector);
                    if (Number.isFinite(dist)) {
                        distances.push({ id: link.id, url: link.url, summary: link.summary, distance: dist });
                    }
                }
            }
        }

        distances.sort((a, b) => a.distance - b.distance);

        const topMatches = distances.slice(0, k).map(match => ({
            id: match.id,
            url: match.url,
            summary: match.summary
        }));
        
        const matchIds = topMatches.map(match => match.id);
        
        res.status(200).json({ 
            matches: matchIds
        });

    } catch (error) {
        res.status(500).json({ detail: "Error during search." });
    }
});

// middleware
app.use((err, req, res, next) => {
    res.status(500).json({ detail: "An error occurred." });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});