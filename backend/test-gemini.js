import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function testKey() {
    let log = "Testing API Key...\n";
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            log += "No API key found in .env\n";
            fs.writeFileSync('test-gemini-log.txt', log, 'utf8');
            process.exit(1);
        }

        log += "API Key loaded: " + (apiKey ? "Yes" : "No") + "\n";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent("Say 'API Key is working perfectly!'");
        log += "Success! Response from Gemini:\n";
        log += result.response.text();
        fs.writeFileSync('test-gemini-log.txt', log, 'utf8');
    } catch (error) {
        log += "Error testing API Key:\n";
        log += (error.message || error) + "\n";
        fs.writeFileSync('test-gemini-log.txt', log, 'utf8');
    }
}

testKey();
