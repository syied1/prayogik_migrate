"use client";

import React from "react";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a placeholder
  }

  return (
    <div className="inline-block" dangerouslySetInnerHTML={{ __html: value }} />
  );
};
