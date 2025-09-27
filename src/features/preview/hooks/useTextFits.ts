import { useEffect, useRef, useState } from "react";

export function useTextFits(text:string, width:number, maxHeight:number, font = "16px Arial") {
  const [fits, setFits] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!measureRef.current) {
      // create hidden element
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.visibility = "hidden";
      div.style.height = "auto";
      div.style.width = width + "px";
      div.style.whiteSpace = "normal";
      div.style.font = font;
      div.style.padding = "0";
      div.style.margin = "0";
      div.style.boxSizing = "border-box";
      div.innerText = text;

      document.body.appendChild(div);
      measureRef.current = div;

      const height = div.offsetHeight;
      setFits(height <= maxHeight);

      // clean up
      document.body.removeChild(div);
      measureRef.current = null;
    }
  }, [text, width, maxHeight, font]);

  return fits;
}