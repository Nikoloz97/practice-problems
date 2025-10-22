import { Logging } from "@google-cloud/logging";

const logging = new Logging({
  projectId: process.env.GCLOUD_PROJECT,
});

const log = logging.log("express-app-logs");

export async function logInfo(
  message: string,
  metadata: Record<string, any> = {}
) {
  const entry = log.entry(
    { resource: { type: "global" } },
    { severity: "INFO", message, ...metadata }
  );
  await log.write(entry);
  console.log(`INFO: ${message}`, metadata);
}

export async function logError(
  message: string,
  metadata: Record<string, any> = {}
) {
  const entry = log.entry(
    { resource: { type: "global" } },
    { severity: "ERROR", message, ...metadata }
  );
  await log.write(entry);
  console.error(`ERROR: ${message}`, metadata);
}
