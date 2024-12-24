//@ts-nocheck

"use client";

import React, { forwardRef } from "react";
import JoditEditor from "jodit-react";

// Define the props interface
interface JoditProps {
  textContent: string;
  onChange: (html: string) => void;
  className?: string;
}

// Create the component
const JoditTextContent = forwardRef<HTMLElement, JoditProps>(
  ({ textContent, onChange, className }, ref) => {
    const handleChange = (newContent) => {
      onChange(newContent); // Call the onChange callback with the updated HTML content
    };

    return (
      <div
        className={`flex min-h-[250px] flex-col justify-stretch ${className}`}
      >
        <JoditEditor
          value={textContent}
          //   tabIndex={1} // For focus management
          onChange={handleChange}
          config={{
            toolbar: [
              "bold",
              "italic",
              "underline",
              "font",
              "fontsize",
              "paragraph",
              "ol",
              "ul",
              "table",
              "|",
              "image",
              "link",
              "|",
              "undo",
              "redo",
            ],
            placeholder: "Type here...", // Placeholder when the editor is empty
            // events: {
            //   // Maintain focus after changes
            //   afterCommand: (editor, command) => {
            //     editor.s.focus(); // Set focus back to the editor after a command
            //   },
            // },
          }}
        />
      </div>
    );
  }
);

JoditTextContent.displayName = "JoditTextContent";

export default JoditTextContent;
