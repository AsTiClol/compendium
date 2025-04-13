// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const FirecrawlApp = require('@mendable/firecrawl-js').default; // Note the .default for CommonJS require
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod'); // Using Zod for basic input validation

// --- Configuration ---
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 8000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY;

// Basic logging setup (can replace with Winston/Pino for production)
const logger = {
    info: (message) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
    error: (message, error) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || ''),
    warn: (message) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
};

// --- Input Schemas (using Zod for validation) ---
const SummarizeSchema = z.object({
    url: z.string().url({ message: "Invalid URL provided" }),
});

const SearchSchema = z.object({
    query: z.string().min(1, { message: "Search query cannot be empty" }),
    k: z.number().int().positive().optional().default(3),
});


// --- Input Validation Middleware ---
// Helper function to create validation middleware
const validateBody = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next(); // Validation successful
    } catch (error) {
        // Send validation errors back to the client
        res.status(400).json({
            detail: "Validation Error",
            errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
    }
};


// --- Initialize SDK Clients ---
if (!GOOGLE_API_KEY || !FIRECRAWL_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    logger.error("Missing required environment variables. Please check your .env file.");
    process.exit(1); // Exit if essential keys are missing
}

const fcapp = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configure Gemini Model for Summarization
const summaryModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Use a known stable model like 1.5 Flash
});
const summaryGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
const summarySystemInstruction = "You are a helpful assistant that generates concise summaries. Based on the following extracted markdown from a website, generate a concise summary in 2-3 sentences. JUST GIVE THE SUMMARY NOTHING ELSE, do not start with 'Here is the summary' or anything like that.";

// Configure Gemini Model for Embeddings
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });


// --- Helper Functions ---

/**
 * Extract content from URL using Firecrawl
 * @param {string} url - The URL to scrape
 * @returns {Promise<string>} - The extracted markdown content or empty string on failure
 */
async function extractContent(url) {
    logger.info(`Attempting to extract content from: ${url}`);
    try {
        // Scrape the URL for markdown content
        // *** CORRECTED LINE: Removed pageOptions based on the API error ***
        const scrapeResult = await fcapp.scrapeUrl(url, { formats: ['markdown'] });

        // Check specifically for the markdown property in the response
        if (scrapeResult && typeof scrapeResult.markdown === 'string') {
            logger.info(`Successfully extracted markdown from ${url}`);
            return scrapeResult.markdown;
        } else {
            // Log more details if scraping didn't return expected markdown
            const errorDetail = scrapeResult?.error || 'Unknown reason (markdown property missing or not a string)';
            logger.error(`Failed to fetch or extract markdown content from ${url} using Firecrawl. Detail: ${errorDetail}. Response: ${JSON.stringify(scrapeResult)}`);
            return "";
        }
    } catch (error) {
        // Catch errors thrown by the scrapeUrl call itself
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error during Firecrawl scrape operation for ${url}: ${errorMessage}`, error); // Log the full error object too
        return "";
    }
}


/**
 * Generate summary using Gemini
 * @param {string} data - The markdown data to summarize
 * @returns {Promise<string>} - The generated summary
 * @throws {Error} - If summary generation fails
 */
async function generateSummary(data) {
    if (!data || data.trim().length === 0) {
        logger.warn("Cannot generate summary from empty data.");
        return ""; // Return empty summary for empty input
    }
    logger.info("Generating summary...");
    try {
        const result = await summaryModel.generateContent({
            contents: [{ role: "user", parts: [{ text: `Extracted markdown data: ${data}` }] }],
            generationConfig: summaryGenerationConfig,
            systemInstruction: { role: "system", parts: [{ text: summarySystemInstruction }] },
        });

        // Check response structure (may vary slightly based on model/SDK version)
        if (result && result.response && typeof result.response.text === 'function') {
             const summary = result.response.text();
             logger.info(`Successfully generated summary.`);
             return summary.trim();
        } else {
             logger.error("Unexpected response structure from Gemini summary generation.", result);
             throw new Error("Could not parse summary from Gemini response.");
        }
    } catch (error) {
        logger.error("Error generating summary with Gemini:", error);
        throw new Error(`Error generating summary: ${error.message}`); // Re-throw for endpoint handler
    }
}

/**
 * Generate embedding using Gemini Embedding model
 * @param {string} text - The text to embed
 * @param {string} taskType - The type of embedding task (e.g., 'RETRIEVAL_DOCUMENT', 'RETRIEVAL_QUERY')
 * @param {string} [title] - Optional title for document embedding
 * @returns {Promise<number[]>} - The generated embedding vector
 * @throws {Error} - If embedding generation fails
 */
async function generateEmbedding(text, taskType, title) {
    if (!text || text.trim().length === 0) {
        logger.warn(`Cannot generate embedding for empty text (task: ${taskType}).`);
        throw new Error("Cannot generate embedding for empty text.");
    }
    logger.info(`Generating embedding for task type: ${taskType}`);
    try {
        // Prepare the content object according to the expected structure for embedContent
        const embedContentRequest = {
             content: { parts: [{ text }] },
             taskType: taskType, // Use the specific task type string
        };

        // Add title only if provided and relevant for the task type
        if (title && (taskType === 'RETRIEVAL_DOCUMENT' || taskType === 'DOCUMENT')) {
           embedContentRequest.title = title;
        }

        const result = await embeddingModel.embedContent(embedContentRequest);

        // Check the response structure for the embedding values
        if (result && result.embedding && Array.isArray(result.embedding.values)) {
             const embedding = result.embedding.values;
             if (embedding.length === 0) {
                  throw new Error("Gemini API returned an empty embedding vector.");
             }
             logger.info(`Successfully generated embedding (vector length: ${embedding.length}).`);
             return embedding;
        } else {
             logger.error("Unexpected response structure from Gemini embedding generation.", result);
             throw new Error("Could not parse embedding vector from Gemini response.");
        }

    } catch (error) {
        logger.error(`Error generating embedding with Gemini (task: ${taskType}):`, error);
        throw new Error(`Error generating embedding: ${error.message}`); // Re-throw
    }
}


/**
 * Calculates the Euclidean distance between two vectors (arrays of numbers).
 * @param {number[]} vec1
 * @param {number[]} vec2
 * @returns {number} The Euclidean distance, or Infinity if vectors are invalid/mismatched.
 */
function euclideanDistance(vec1, vec2) {
    if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length || vec1.length === 0) {
        logger.warn(`Invalid vectors for distance calculation: vec1 length ${vec1?.length}, vec2 length ${vec2?.length}`);
        return Infinity; // Return Infinity for invalid input to ensure they rank last
    }
    let sumOfSquares = 0;
    for (let i = 0; i < vec1.length; i++) {
        // Ensure elements are numbers
        if (typeof vec1[i] !== 'number' || typeof vec2[i] !== 'number') {
             logger.warn(`Non-numeric value encountered in vectors at index ${i}.`);
             return Infinity;
        }
        sumOfSquares += (vec1[i] - vec2[i]) ** 2;
    }
    return Math.sqrt(sumOfSquares);
}

// --- Express Application Setup ---
const app = express();

// CORS Middleware Configuration - Allow all origins
app.use(cors({
    origin: '*', // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// --- API Routes ---

// Health Check Endpoint
app.get("/status", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Summarize URL Endpoint
app.post("/summarize", validateBody(SummarizeSchema), async (req, res) => {
    const { url } = req.body;
    logger.info(`Received request to summarize URL: ${url}`);

    try {
        // 1. Check if URL already exists in Supabase
        const { data: existing, error: selectError } = await supabase
            .from('links')
            .select('id, summary')
            .eq('url', url)
            .maybeSingle();

        if (selectError) {
            logger.error("Supabase select error checking existence:", selectError);
            return res.status(500).json({ detail: "Database error checking for existing URL." });
        }

        if (existing) {
            logger.info(`URL already exists in database: ${url}`);
            return res.status(200).json({ summary: existing.summary || "Summary not found for existing URL." });
        }

        // 2. Extract Content
        const content = await extractContent(url);
        if (!content) {
            logger.warn(`Could not extract content for URL: ${url}`);
            // Decide on response: 200 ok with message, or an error status?
            // Returning 200 with a message seems reasonable as the request format was valid.
            return res.status(200).json({ summary: "", message: "Could not extract content from the URL." });
        }

        // 3. Generate Summary
        const summary = await generateSummary(content);
         if (!summary) {
            logger.warn(`Could not generate summary for URL: ${url} (content might be empty or unsuitable)`);
            return res.status(200).json({ summary: "", message: "Could not generate summary for the extracted content." });
        }

        // 4. Generate Embedding
        let embedding;
        try {
            // Use RETRIEVAL_DOCUMENT type for storing searchable documents
            embedding = await generateEmbedding(summary, 'RETRIEVAL_DOCUMENT', `Summary for ${url}`);
        } catch (embeddingError) {
            logger.error(`Failed to generate embedding for URL ${url}:`, embeddingError);
            // Critical decision: Fail request or insert without vector? Failing is safer.
            return res.status(500).json({ detail: `Failed to generate embedding: ${embeddingError.message}` });
        }

        // 5. Insert into Supabase
        // Ensure embedding is stringified if column type is text/jsonb
        const vectorData = JSON.stringify(embedding);

        const { data: insertData, error: insertError } = await supabase
            .from('links')
            .insert({
                url: url,
                summary: summary,
                vector: vectorData // Store the stringified JSON embedding
            })
            .select() // Return the inserted row
            .single();

        if (insertError) {
            logger.error(`Supabase insertion error for URL ${url}:`, insertError);
            if (insertError.code === '23505') { // Handle unique constraint violation (race condition)
                 logger.warn(`Race condition likely: URL ${url} was inserted concurrently.`);
                 // Re-fetch or just return the summary we generated
                 return res.status(200).json({ summary: summary, message: "URL processed concurrently." });
            }
            return res.status(500).json({ detail: `Failed to insert data into database: ${insertError.message}` });
        }

        logger.info(`Successfully inserted data for URL: ${url}`);
        res.status(200).json({ summary: summary });

    } catch (error) {
        // Catch errors from helper functions re-throws or unexpected issues
        logger.error(`Error processing summarize request for ${url}:`, error);
        res.status(500).json({ detail: error.message || "An unexpected error occurred during summarization." });
    }
});

// Search Endpoint
app.post("/search", validateBody(SearchSchema), async (req, res) => {
    const { query, k } = req.body;
    logger.info(`Received search query: "${query}", k=${k}`);

    try {
        // 1. Generate embedding for the query
        let queryEmbedding;
        try {
             // Use RETRIEVAL_QUERY type for search queries
            queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');
        } catch (embeddingError) {
            logger.error(`Failed to generate embedding for query "${query}":`, embeddingError);
            return res.status(500).json({ detail: `Failed to generate query embedding: ${embeddingError.message}` });
        }

        // --- Manual KNN Implementation ---
        // Fetch all vectors for comparison. *Inefficient for large scale*.
        logger.info("Fetching all link vectors from database for manual KNN...");
        const { data: links, error: fetchError } = await supabase
            .from('links')
            .select('id, url, vector'); // Select the vector column

        if (fetchError) {
            logger.error("Supabase fetch error during search:", fetchError);
            return res.status(500).json({ detail: "Database error fetching links." });
        }

        if (!links || links.length === 0) {
            logger.info("No links found in database for search.");
            return res.status(200).json({ matches: [] });
        }

        logger.info(`Calculating distances against ${links.length} stored vectors...`);
        const distances = [];
        for (const link of links) {
            if (link.vector && typeof link.vector === 'string') { // Ensure vector exists and is a string
                try {
                    // Parse the JSON string vector back into an array
                    const dbVector = JSON.parse(link.vector);
                    // Add robust check for valid array structure
                    if (Array.isArray(dbVector) && dbVector.length > 0) {
                         const dist = euclideanDistance(queryEmbedding, dbVector);
                         // Only add if distance is a finite number (not Infinity from errors)
                         if (Number.isFinite(dist)) {
                            distances.push({ id: link.id, url: link.url, distance: dist });
                         } else {
                             logger.warn(`Invalid distance calculated for link ${link.id}. Skipping.`);
                         }
                    } else {
                         logger.warn(`Parsed vector for link ${link.id} is not a valid array or is empty. Skipping.`);
                    }
                } catch (parseError) {
                    logger.error(`Error parsing JSON vector for link ${link.id}:`, parseError);
                    // Skip this link if its vector is corrupted
                }
            } else {
                 // Log if vector is missing or not a string
                 logger.warn(`Skipping link ${link.id} due to missing or invalid vector format (expected string).`);
            }
        }

        // Sort by distance (ascending - smallest distance is most similar)
        distances.sort((a, b) => a.distance - b.distance);

        // Get the top k matches
        const topMatches = distances.slice(0, k).map(match => ({
            id: match.id,
            url: match.url,
            // distance: match.distance // Optionally include distance for debugging/ranking info
        }));

        logger.info(`Search completed. Found ${topMatches.length} matches for query "${query}".`);
        res.status(200).json({ matches: topMatches });

    } catch (error) {
        logger.error(`Error during search for query "${query}":`, error);
        res.status(500).json({ detail: error.message || "An unexpected error occurred during search." });
    }
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    logger.error('Unhandled Error:', err);
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ detail: 'Not allowed by CORS' });
    } else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // Handle JSON parsing errors
        res.status(400).json({ detail: 'Bad Request: Malformed JSON.' });
    }
    else {
        res.status(500).json({ detail: 'An internal server error occurred.' });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});