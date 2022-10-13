import config from "config";
import mongoose from "mongoose";
import log from "../utils/logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    log.info("Connected to DB");
  } catch (err) {
    log.error("Couldn't connect to DB");
    process.exit(1);
  }
}

export default connect;
