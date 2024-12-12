//@ts-nocheck
import Image from "next/image";

export default function Logo({ theme, ...props }) {
  const logoSrc = theme === "dark" ? "/logo-light.svg" : "/logo.svg";
  const altText =
    theme === "dark" ? "Prayogik light Logo" : "Prayogik dark Logo";

  return (
    <Image
      src={logoSrc}
      alt={altText}
      width={200} 
      height={100} 
      {...props} 
    />
  );
}
