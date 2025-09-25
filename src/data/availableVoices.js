// Available ElevenLabs voice IDs for the application
export const AVAILABLE_VOICE_IDS = [
  "hEKEQC93QpOYMa6WuwWp",
  "kq2txNbA7gDo4YxPud8y",
  "4Psp2B39ggIi4zVk97ES",
  "2UMI2FME0FFUFMlUoRER",
  "YjlcD3XHztjJEo2wNszv",
  "NVp9wQor3NDIWcxYoZiW",
  "ekDwQFJTC9rHJqe3iEN7",
  "4AgX6Piqqh5KT4pSisZQ",
  "aMdQCEO9kwP77QH1DiFy",
  "kENkNtk0xyzG09WW40xE",
  "YwEKgPNrswweXodAZi29",
  "gGjaVIGkCSfKUIBYtNT2",
  "NkhHdPbLqYzmdIaSUuIy",
  "fehqjfT0R2fGKeUX2YeE",
  "ogi2DyUAKJb7CEdqqvlU",
  "5p9IbzcK4R8rN1fpGdMF",
  "83Nae6GFQiNslSbuzmE7",
  "9Gv9jd4TDwlmfGxF4Mwp",
  "7lu3ze7orhWaNeSPowWx",
  "kd1lRcSdRGIfyKxQKjmH",
  "fUvGSEaJxwAISe7Lwyh4",
  "xHUwLsLfyqiYOIVTzLRW",
  "aLFUti4k8YKvtQGXv0UO",
  "FbFkkfp4Iv6U5Q1WC4C2",
  "cFvQm3lZl5miSWHxawFj",
  "1SM7GgM6IMuvQlz2BwM3",
  "sla02gCKN0hNfNn9ORJN",
  "SMQKgThKQvXmuAzjIP2x"
];

// Helper function to check if a voice ID is valid
export const isValidVoiceId = (voiceId) => {
  return AVAILABLE_VOICE_IDS.includes(voiceId);
};
