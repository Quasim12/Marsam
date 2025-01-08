import Api_Url from './config.js';
const key = Api_Url // Replace with your actual key
const inputText = document.getElementById("textPrompt");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

let currentBlobUrl = null; // Store the current image blob URL

async function query() {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
    {
      headers: {
        Authorization: `Bearer ${key}`,
      },
      method: "POST",
      body: JSON.stringify({ inputs: inputText.value }),
    }
  );
  const result = await response.blob();
  return result;
}

async function generate() {
  if (inputText.value.trim() === "") {
    alert("Please enter a prompt to generate an image.");
    return; // Exit the function if input is empty
  }

  // Show the loading spinner
  load.style.display = "block";
  svg.style.display = "none";
  image.style.display = "none";

  try {
    const responseBlob = await query();
    const objectUrl = URL.createObjectURL(responseBlob);

    // Update the image
    image.src = objectUrl;
    image.style.display = "block";

    // Revoke the previous blob URL if exists
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
    }

    // Update the current blob URL
    currentBlobUrl = objectUrl;

    // Attach the new URL to the download button
    downloadBtn.onclick = () => downloadImage(objectUrl);

    // Hide the loading spinner
    load.style.display = "none";
  } catch (error) {
    console.error("Error generating image:", error);
    load.style.display = "none";
    alert("Failed to generate the image. Please try again.");
  }
}

function downloadImage(blobUrl) {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = `image_${Date.now()}.png`; // Unique filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

GenBtn.addEventListener("click", generate);

inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generate();
  }
});

ResetBtn.addEventListener("click", () => {
  inputText.value = "";
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl); // Clean up the current blob URL
  }
  currentBlobUrl = null;
  image.style.display = "none";
  svg.style.display = "block";
});
