const isoCountryCodeToFlagEmoji = (isoAlpha2: string) => {
  const BASE = 0x1f1a5;
  return String.fromCodePoint(
    ...isoAlpha2
      .toUpperCase()
      .split("")
      .map(c => c.charCodeAt(0) + BASE)
  );
};

export default isoCountryCodeToFlagEmoji;
