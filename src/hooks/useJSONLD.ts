import { useEffect } from "react";

/**
 * Hook to inject dynamic JSON-LD structured data into the document head for SEO.
 * Automatically cleans up the script tag on unmount.
 * 
 * @param schemaData Object representing the structured schema data.
 */
export const useJSONLD = (schemaData: Record<string, any> | null) => {
  const schemaString = schemaData ? JSON.stringify(schemaData) : "";

  useEffect(() => {
    if (typeof document === "undefined" || !schemaString) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = schemaString;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [schemaString]);
};
