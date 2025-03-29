import { type PageProps } from "$fresh/server.ts";
import { useEffect } from "preact/hooks";

export default function App({ Component }: PageProps) {
  // Client-side effect to handle mouse movement for background
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      // Update CSS variables on the body
      document.body.style.setProperty('--x', `${clientX}px`);
      document.body.style.setProperty('--y', `${clientY}px`);
    };

    // Add listener only on the client
    if (typeof window !== 'undefined') {
      document.body.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup listener on component unmount
    return () => {
      if (typeof window !== 'undefined') {
        document.body.removeEventListener('mousemove', handleMouseMove);
        // Optional: Reset variables on unmount if desired
        // document.body.style.removeProperty('--x');
        // document.body.style.removeProperty('--y');
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>app</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
