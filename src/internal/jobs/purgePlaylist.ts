import { logger } from "../../logger";

async function purgePlaylist() {
  // todo implement me
}

purgePlaylist()
  .then(() => {
    logger.info("Finished purging dynamic playlist");
    process.exit(0);
  })
  .catch((error) => {
    logger.error("Failed to purge dynamic playlist", error);
    process.exit(1);
  })
  .finally(() => {
    // disconnect from redis and spotify clients here
  });