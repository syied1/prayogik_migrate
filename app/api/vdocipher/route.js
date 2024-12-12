import axios from "axios";

export async function POST(request) {
  try {
    // Parse incoming JSON body
    const body = await request.json();
    const { title, folderId } = body;

    // Use environment variable for the API key
    const vdocipherApiKey = process.env.VDOCIPHER_API_SECRET;

    // Define the API request options
    const options = {
      method: "PUT",
      url: `https://dev.vdocipher.com/api/videos?title=${encodeURIComponent(
        title || "Untitled Video"
      )}&folderId=${folderId || "root"}`,
      headers: {
        Authorization: `Apisecret ${vdocipherApiKey}`,
      },
      timeout: 5000, // Set a timeout for the request
    };

    // Make the request to VdoCipher
    const response = await axios(options);

    // Return success response with data
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Return error response with message and status code
    return new Response(
      JSON.stringify({
        error: true,
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
