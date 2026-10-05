import {
  createReadOnlyConsumerDescriptor,
  validateReadOnlyConsumerDescriptor
} from "@thiepn/languages/consumer-contract";

export const JAPANESE_PLATFORM_SOURCE_BASELINE =
  "45d03f5b027bdb36fcf5a7f7df3c063e1ba09893";

export const languagePlatformCompatibility =
  createReadOnlyConsumerDescriptor({
    appId: "japanese",
    languageId: "japanese",
    consumerRevision: JAPANESE_PLATFORM_SOURCE_BASELINE
  });

const validation =
  validateReadOnlyConsumerDescriptor(languagePlatformCompatibility);

if (!validation.ok) {
  throw new Error(
    "INVALID_LANGUAGE_PLATFORM_COMPATIBILITY:" +
      validation.issues.join("|")
  );
}
