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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiCalled, setApiCalled] = useState(false);
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

  // Effect for fetching images
  useEffect(() => {
    async function fetchImages() {
      if (!uploadedImage) return;
      try {
        setLoading(true);
        setError(null);
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
        setApiCalled(true);
      } catch (e) {
        setError((e as Error).message);
        console.error("Failed to encode face:", e);
      } finally {
        setLoading(false);
      }
    }
    if (uploadedImage) fetchImages();
  }, [uploadedImage, numRows, toleranceVar, minAge, maxAge]);

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

      <div class="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
        {/* Left Group: Upload Button Only */}
        <div class="flex items-center space-x-4">
          <button // Updated hover effect to dark red gradient
            type="button"
            onClick={handleButtonClick}
            class="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-700 border border-red-800 shadow-md transition-all duration-200 ease-in-out hover:from-red-700 hover:to-red-900"
          >
            Upload Image
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => { // Reverted to original inline handler
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  setUploadedImage(base64String);
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
        </div>
        {/* Right Group: Sliders and Dark Mode Toggle - Added sm:ml-8 for spacing */}
        <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 sm:ml-8">
          <div class="flex items-center">
            <label htmlFor="numRows" class="mr-2">
              Number of Rows:
            </label>
            <input
              type="range"
              id="numRows"
              min="1"
              max="20"
              value={numRows}
              onChange={handleNumRowsChange}
              class="mr-2"
            />
            <span>{numRows}</span>
          </div>
          <div class="flex items-center">
            <label htmlFor="toleranceVar" class="mr-2">
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
              class="mr-2"
            />
            <span>{toleranceVar}</span>
          </div>
          {/* Min and Max Age Range */}
          <div class="flex items-center">
            <label htmlFor="minAge" class="mr-2">
              Min Age:
            </label>
            <input
              type="number"
              id="minAge"
              min="20"
              max="100"
              value={minAge}
              onChange={(e) => setMinAge(Number((e.target as HTMLInputElement).value))}
              class="mr-2" // Removed text-gray-900 dark:text-gray-900
            />
            <label htmlFor="maxAge" class="ml-4 mr-2">
              Max Age:
            </label>
            <input
              type="number"
              id="maxAge"
              min="20"
              max="100"
              value={maxAge}
              onChange={(e) => setMaxAge(Number((e.target as HTMLInputElement).value))}
              class="mr-2" // Removed text-gray-900 dark:text-gray-900
            />
          </div>
          <div class="flex items-center">
            <button // Updated hover effect to dark red gradient
              type="button"
              onClick={toggleDarkMode}
              class="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-700 border border-red-800 shadow-md transition-all duration-200 ease-in-out hover:from-red-700 hover:to-red-900"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
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

      {loading ? (
        <div class="text-center">Loading API Images...</div>
      ) : error ? (
        <div class="text-center text-red-500">Error: {error}</div>
      ) : apiCalled ? (
        encodedFaces.length === 0 ? (
          <div class="text-center">There are results that match your query within the specified vector distance. Please consider adjusting the parameters of the query</div>
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
          </div>
        )
      ) : (
        // Reverted to original placeholder
        <div class="text-center flex flex-col items-center">
          Upload an image to get started.
          <img class="mt-2" src="/23ai.png" alt="23ai" />
        </div>
      )}
    </div>
  );
}
