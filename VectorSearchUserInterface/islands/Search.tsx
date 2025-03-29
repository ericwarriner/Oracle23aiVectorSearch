import { useState, useEffect, useRef } from "preact/hooks";
import { h } from "preact";

// Removed UploadStatus type

interface EncodeFaceResponse {
  distance: number;
  id: number;
  image_base64: string;
  name: string;
}

export default function ImageGallery() {
  const [encodedFaces, setEncodedFaces] = useState<EncodeFaceResponse[]>([]);
  // Reverted state variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiCalled, setApiCalled] = useState(false); // Track if API has been called at least once
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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

  // Define fetchImages function separately
  async function fetchImages() {
    if (!uploadedImage) {
      console.warn("fetchImages called without an uploaded image.");
      // Clear previous results if image is gone
      setEncodedFaces([]);
      setApiCalled(false);
      setError(null);
      return;
    }
    setLoading(true); // Set loading true
    setApiCalled(false); // Reset apiCalled flag for new fetch
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
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }
      const data: EncodeFaceResponse[] = await response.json();
      setEncodedFaces(data);
      setApiCalled(true); // Set apiCalled true on success
    } catch (e) {
      setError((e as Error).message);
      setApiCalled(true); // Also set true on error to show error message instead of initial placeholder
      console.error("Failed to encode face:", e);
    } finally {
      setLoading(false); // Set loading false
    }
  }

  // Effect ONLY for fetching images when image or parameters change
  useEffect(() => {
    // Fetch whenever uploadedImage is set or parameters change while image is present
    if (uploadedImage) {
       fetchImages();
    } else {
       // Reset state if the image is cleared
       setEncodedFaces([]);
       setError(null);
       setApiCalled(false);
       setLoading(false); // Ensure loading is false if image is cleared
    }
  }, [uploadedImage, numRows, toleranceVar, minAge, maxAge]); // Keep dependencies

  const handleButtonClick = () => fileInputRef.current?.click();
  const handleNumRowsChange = (event: Event) =>
    setNumRows(Number((event.target as HTMLInputElement).value));
  const handleToleranceVarChange = (event: Event) =>
    setToleranceVar(Number((event.target as HTMLInputElement).value));
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <div class="min-h-screen container mx-auto p-4 sm:p-6 md:p-10 text-gray-900 dark:text-gray-100 transition-colors duration-200 drop-shadow-xl"> {/* Removed bg-zinc-200 dark:bg-zinc-700 */}
      {/* Dynamically Sticky Title Bar */}
      <header class={`px-4 py-2 mb-6 flex flex-col items-center border-b border-gray-300 dark:border-gray-600 ${isHeaderSticky ? 'sticky top-0 z-50' : ''}`}> {/* Conditional sticky classes */}
        <img src="/oracle.svg" alt="Logo" class="w-96 h-40" />
        {/* Removed gradient class, added text-white */}
        <h1 class="text-4xl font-bold text-center exo-regular text-white">
          Vector Search powered by a Oracle 23ai Converged Database
        </h1>
      </header>

      <div class="flex flex-col sm:flex-row items-start justify-between mb-6 space-y-4 sm:space-y-0"> {/* Changed items-center to items-start */}
        {/* Left Group: Upload and Dark Mode Buttons (Vertical) */}
        <div class="flex flex-col items-center space-y-4"> {/* Changed to flex-col and space-y-4 */}
          <button
            type="button"
            onClick={handleButtonClick}
            class="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-700 border border-red-800 shadow-md transition-all duration-200 ease-in-out hover:from-red-700 hover:to-red-900"
          >
            Upload Image
          </button>
          {/* Moved Dark Mode Button Here */}
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
              // Clear previous state immediately upon file selection
              setEncodedFaces([]);
              setUploadedImage(null); // Clear image first to trigger useEffect reset if needed
              setError(null);
              setApiCalled(false);
              setLoading(false); // Ensure loading stops if a new file is chosen mid-load

              if (file) {
                // No status setting here
                const reader = new FileReader();
                reader.onloadend = () => {
                  // Set the image state *after* reading is complete
                  const base64String = reader.result as string;
                  setUploadedImage(base64String); // This will trigger useEffect to fetch
                };
                reader.onerror = () => {
                  setError("Failed to read file.");
                  setUploadedImage(null); // Ensure image is null on error
                  setApiCalled(true); // Show error
                };
                reader.readAsDataURL(file);
              }
              // No else needed, clearing state above handles cancellation
            }}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
        </div>
        {/* Right Group: Sliders (Vertical) next to Age Inputs (Vertical) */}
        <div class="flex flex-row items-start space-x-6"> {/* Main container is now flex-row */}
          {/* Slider Group (Vertical) */}
          <div class="flex flex-col space-y-4"> {/* Adjusted vertical spacing */}
            {/* Number of Rows Slider - Using Grid */}
            <div class="grid grid-cols-[auto_1fr_auto] items-center gap-x-2"> {/* Grid layout */}
              <label htmlFor="numRows" class="text-right"> {/* Rely on grid column */}
                Num Rows:
              </label>
              <input
                type="range"
                id="numRows"
                min="1"
                max="20"
                value={numRows}
                onChange={handleNumRowsChange}
                class="" /* Grid handles sizing */
              />
              <span class="text-left">{numRows}</span> {/* Rely on grid column */}
            </div>
            {/* Distance Slider - Using Grid */}
            <div class="grid grid-cols-[auto_1fr_auto] items-center gap-x-2"> {/* Grid layout */}
              <label htmlFor="toleranceVar" class="text-right"> {/* Rely on grid column */}
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
                class="" /* Grid handles sizing */
              />
              <span class="text-left">{toleranceVar}</span> {/* Rely on grid column */}
            </div>
          </div>
          {/* Age Input Group (Vertical) */}
          <div class="flex flex-col space-y-4"> {/* Wrap age inputs in a flex-col div */}
            {/* Min Age Input */}
            <div class="flex items-center">
              <label htmlFor="minAge" class="mr-2 w-16 text-right shrink-0"> {/* Fixed width */}
                Min Age:
              </label>
              <input
                type="number"
                id="minAge"
                min="20"
                max="100"
                value={minAge}
                onChange={(e) => setMinAge(Number((e.target as HTMLInputElement).value))}
                class="w-16 text-center" /* Fixed width */
              />
            </div>
            {/* Max Age Input */}
            <div class="flex items-center">
              <label htmlFor="maxAge" class="mr-2 w-16 text-right shrink-0"> {/* Fixed width */}
                Max Age:
              </label>
              <input
                type="number"
                id="maxAge"
                min="20"
                max="100"
                value={maxAge}
                onChange={(e) => setMaxAge(Number((e.target as HTMLInputElement).value))}
                class="w-16 text-center" /* Fixed width */
              />
            </div>
          </div>
        </div>
      </div>

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

      {/* Reverted Results Area Logic */}
      <div class="mt-6 text-center">
        {loading ? (
          <div>Loading results...</div> // Simple loading message
        ) : error ? (
          <div class="text-red-500">Error: {error}</div> // Error message
        ) : apiCalled ? ( // Only show results/no results after API call attempt
          encodedFaces.length === 0 ? (
            <div>
              No similar faces found within the specified distance and age range. Try adjusting the parameters.
            </div> // No results message
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {encodedFaces.map((face) => (
                <div
                  key={face.id}
                  class="card p-3" // Use card class, removed bg-white dark:bg-gray-500
                >
                  <h2 class="text-lg font-bold mb-1">{face.name}</h2>
                  <p class="text-xs font-medium mb-2">Distance = {face.distance}</p>
                  <img
                    src={`data:image/png;base64,${face.image_base64}`}
                    alt={`Image ${face.id}`}
                    class="w-full h-auto"
                  />
                </div>
              ))}
            </div> // Results grid
          )
        ) : (
          // Initial placeholder only if no image is uploaded and API hasn't been called
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
