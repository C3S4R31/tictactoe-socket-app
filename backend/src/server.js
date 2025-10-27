import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { PORT } from "./config/env.js";

connectDB();

const { httpServer } = createApp();

httpServer.listen(PORT, () => {
  console.log(`🚀 Server listo en http://localhost:${PORT}`);
});
