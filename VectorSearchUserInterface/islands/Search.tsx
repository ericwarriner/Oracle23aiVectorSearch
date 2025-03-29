import { useState, useEffect, useRef } from "preact/hooks";
import { h } from "preact";

interface EncodeFaceResponse {
  distance: number;
  id: number;
  image_base64: string;
  name: string;
}

export default function ImageGallery() {
  const [encodedFaces, setEncodedFaces] = useState<EncodeFaceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>(""); // New state for status messages
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [numRows, setNumRows] = useState(10);
  const [toleranceVar, setToleranceVar] = useState(0.05);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [minAge, setMinAge] = useState(20);
  const [maxAge, setMaxAge] = useState(80);
  const [isHeaderSticky, setIsHeaderSticky] = useState(true); // State for dynamic sticky header

  // Effect for dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Effect for dynamic sticky header
  useEffect(() => {
    const handleScroll = () => {
      // Make header sticky only when scrolled near the top
      setIsHeaderSticky(window.scrollY < 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  async function fetchImages() {
    if (!uploadedImage) {
      console.warn("fetchImages called without an uploaded image.");
      setEncodedFaces([]);
      setApiCalled(false);
      setError(null);
      return;
    }
    setLoading(true);
    setUploadStatus("Processing image and fetching results...");
    setApiCalled(false);
    setError(null);
    try {
      const response = await fetch(
        `/api/encode_face?num_rows=${numRows}&tolerance_var=${toleranceVar}&min_age=${minAge}&max_age=${maxAge}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: uploadedImage }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const data: EncodeFaceResponse[] = await response.json();
      setEncodedFaces(data);
      setApiCalled(true);
      setUploadStatus(data.length === 0 ? "No results found." : "Results loaded successfully.");
    } catch (e) {
      setError((e as Error).message);
      setApiCalled(true);
      setUploadStatus("An error occurred while processing the image.");
      console.error("Failed to encode face:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (uploadedImage) {
      fetchImages();
    } else {
      setEncodedFaces([]);
      setError(null);
      setApiCalled(false);
      setLoading(false);
      setUploadStatus("");
    }
  }, [uploadedImage, numRows, toleranceVar, minAge, maxAge]);

  const handleButtonClick = () => fileInputRef.current?.click();
  const handleNumRowsChange = (event: Event) =>
    setNumRows(Number((event.target as HTMLInputElement).value));
  const handleToleranceVarChange = (event: Event) =>
    setToleranceVar(Number((event.target as HTMLInputElement).value));
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <div class="min-h-screen container mx-auto p-4 sm:p-6 md:p-10 text-gray-900 dark:text-gray-100 transition-colors duration-200 drop-shadow-xl">
      {/* Dynamically Sticky Title Bar */}
      <header class={`px-4 py-2 mb-6 flex flex-col items-center border-b border-gray-300 dark:border-gray-600 ${isHeaderSticky ? 'sticky top-0 z-50' : ''}`}>
        <img src="/oracle.svg" alt="Logo" class="w-96 h-40" />
        <h1 class="text-4xl font-bold text-center exo-regular text-white">
          Vector Search powered by a Oracle 23ai Converged Database
        </h1>
      </header>

      <div class="flex flex-col sm:flex-row items-start justify-between mb-6 space-y-4 sm:space-y-0">
        <div class="flex flex-col items-center space-y-4">
          <button
            type="button"
            onClick={handleButtonClick}
            class="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-700 border border-red-800 shadow-md transition-all duration-200 ease-in-out hover:from-red-700 hover:to-red-900"
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            class="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-700 border border-red-800 shadow-md transition-all duration-200 ease-in-out hover:from-red-700 hover:to-red-900"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              setUploadStatus("Uploading image...");
              setEncodedFaces([]);
              setUploadedImage(null);
              setError(null);
              setApiCalled(false);
              setLoading(false);

              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  setUploadedImage(base64String);
                  setUploadStatus("Image uploaded successfully.");
                };
                reader.onerror = () => {
                  setError("Failed to read file.");
                  setUploadStatus("Upload failed.");
                  setUploadedImage(null);
                  setApiCalled(true);
                };
                reader.readAsDataURL(file);
              } else {
                setUploadStatus("");
              }
            }}
            style={{ display: "none" }}
            ref={fileInputRef}
          />

        </div>
        <div class="flex flex-row items-start space-x-6">
          <div class="flex flex-col space-y-4">
            <div class="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
              <label htmlFor="numRows" class="text-right">
                Num Rows:
              </label>
              <input
                type="range"
                id="numRows"
                min="1"
                max="20"
                value={numRows}
                onChange={handleNumRowsChange}
                class=""
              />
              <span class="text-left">{numRows}</span>
            </div>
            <div class="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
              <label htmlFor="toleranceVar" class="text-right">
                Distance:
              </label>
              <input
                type="range"
                id="toleranceVar"
                min="0.00"
                max=".8"
                step="0.03"
                value={toleranceVar}
                onChange={handleToleranceVarChange}
                class=""
              />
              <span class="text-left">{toleranceVar}</span>
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <div class="flex items-center">
              <label htmlFor="minAge" class="mr-2 w-16 text-right shrink-0">
                Min Age:
              </label>
              <input
                type="number"
                id="minAge"
                min="20"
                max="100"
                value={minAge}
                onChange={(e) => setMinAge(Number((e.target as HTMLInputElement).value))}
                class="w-16 text-center"
              />
            </div>
            <div class="flex items-center">
              <label htmlFor="maxAge" class="mr-2 w-16 text-right shrink-0">
                Max Age:
              </label>
              <input
                type="number"
                id="maxAge"
                min="20"
                max="100"
                value={maxAge}
                onChange={(e) => setMaxAge(Number((e.target as HTMLInputElement).value))}
                class="w-16 text-center"
              />
            </div>
          </div>
        </div>
      </div>
      {uploadStatus && (
            <div class="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
              {uploadStatus}
            </div>
          )}
      {uploadedImage && (
        <div class="mb-6 flex flex-col items-center">
          <h2 class="text-xl font-bold mb-3 text-center">Uploaded Image:</h2>
          <img
            src={uploadedImage}
            alt="Uploaded"
            class="w-64 sm:w-80 md:w-96 h-auto rounded-lg border border-gray-300 dark:border-gray-600 mx-auto shadow-lg"
          />
        </div>
      )}

      <div class="mt-6 text-center">
        {loading ? (
          <div>Loading results...</div>
        ) : error ? (
          <div class="text-red-500">Error: {error}</div>
        ) : apiCalled ? (
          encodedFaces.length === 0 ? (
            <div>No similar faces found. Try adjusting the parameters.</div>
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {encodedFaces.map((face) => (
                <div key={face.id} class="card p-3">
                  <h2 class="text-lg font-bold mb-1">{face.name}</h2>
                  <p class="text-xs font-medium mb-2">Distance = {face.distance}</p>
                  <img
                    src={`data:image/png;base64,${face.image_base64}`}
                    alt={`Image ${face.id}`}
                    class="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          !uploadedImage && (
            <div class="flex flex-col items-center">
              Upload an image to get started.
              <img class="mt-2" src="/23ai.png" alt="23ai" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
