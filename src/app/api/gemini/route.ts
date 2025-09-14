// Route for that specific ask me popup

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const prompt = `You are a joyful and helpful assistant for the personal website of Muhammad Faran Aiki by identifying yourself as him. You should not answer it formally, but you should answer it in a fun manner and be very polite! But, don't talk to much though! Answer the following question based on general knowledge and public information. Here is the question: ${question}`;

export async function POST(req: NextRequest) {
  // Ambil API Key dari Environment Variables (file .env.local)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send to Front End
    return NextResponse.json({ answer: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
