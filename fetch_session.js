const fs = require("fs");
const envContent = fs.readFileSync(".env.local", "utf-8");
let apiKey = "";
envContent.split("\n").forEach(line => {
  if (line.startsWith("WHATSAPP_API_KEY")) {
    apiKey = line.split("=")[1].replace(/['"]/g, "").trim();
  }
});

const baseUrl = "https://wa.ratehonk.com";

if (!apiKey) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

async function fetchSessions() {
  try {
    const response = await fetch(`${baseUrl}/api/project/v1/sessions`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch sessions", await response.text());
      return;
    }

    const data = await response.json();
    console.log("Sessions response:", JSON.stringify(data, null, 2));

    // If there is an array of sessions, get the first one's ID
    let sessionId = null;
    if (Array.isArray(data) && data.length > 0) {
      sessionId = data[0].id;
    } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      sessionId = data.data[0].id;
    }

    if (sessionId) {
      console.log(`\nFound Session ID: ${sessionId}`);
      // Append to .env.local
      const fs = require("fs");
      const envContent = fs.readFileSync(".env.local", "utf-8");
      if (!envContent.includes("WHATSAPP_SESSION_ID")) {
        fs.appendFileSync(".env.local", `\nWHATSAPP_SESSION_ID="${sessionId}"\n`);
        console.log("Successfully added WHATSAPP_SESSION_ID to .env.local!");
      } else {
        console.log("WHATSAPP_SESSION_ID already exists in .env.local");
      }
    } else {
      console.log("No active WhatsApp sessions found on this account.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

fetchSessions();
