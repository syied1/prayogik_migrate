export function convertNumberToBangla(input: number | string): string {
  const banglaNumeralMap = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const inputStr = input?.toString() || "0";
  const convertedToBangla = inputStr
    .split("")
    .map((char) => {
      return /\d/.test(char) ? banglaNumeralMap[parseInt(char)] : char;
    })
    .join("");
  return convertedToBangla;
}
