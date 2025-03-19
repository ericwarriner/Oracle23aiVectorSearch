import { FreshContext } from "$fresh/server.ts";

export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(req.url);
    const numRows = url.searchParams.get("num_rows");
    const toleranceVar = url.searchParams.get("tolerance_var");
    const min_age = url.searchParams.get("min_age");
    const max_age = url.searchParams.get("max_age");
    const requestBody = await req.json();
    let base64Image = requestBody.image;

    // Remove any data:image/...;base64, prefix
    const prefixRegex = /^data:image\/(png|jpeg|gif|webp);base64,/;
    const match = base64Image.match(prefixRegex);
    if (match) {
      base64Image = base64Image.substring(match[0].length);
    }


    if (!base64Image) {
      return new Response("Missing image in request body", { status: 400 });
    }

    // Externalize the apiUrl using Deno.env.get
    let apiUrl = Deno.env.get("API_URL") || "http://129.80.96.10:8080/encode_face" // Provide a default value
    //let apiUrl = "http://129.80.96.10:8080/encode_face";
    //let apiUrl = "http://localhost:8080/encode_face";
    const urlParams = new URLSearchParams();
    if (numRows) {
      urlParams.append("num_rows", numRows);
    }
    if (toleranceVar) {
      urlParams.append("tolerance_var", toleranceVar);
    }
    if (min_age) {
      urlParams.append("min_age", min_age);
    }
    if (max_age) {
      urlParams.append("max_age", max_age);
    }

    if (urlParams.toString() !== "") {
      apiUrl += `?${urlParams.toString()}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_base64: base64Image }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status1: ${response.json}`);
      return new Response("Failed to encode a face", { status: 500 });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error encoding face3:", error);
    return new Response("Failed to encode face2", { status: 500 });
  }
};
