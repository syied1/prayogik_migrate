// app/api/vdocipher/route.ts

import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.VDOCIPHER_API_SECRET; 
  const API_URL = "https://dev.vdocipher.com/api/videos";

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Apisecret ${API_KEY}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching data from VdoCipher API:", error);
    return NextResponse.error();
  }
}
