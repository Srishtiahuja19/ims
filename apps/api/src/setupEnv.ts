import * as dotenv from "dotenv";
import path from "path";

// Load from root .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
