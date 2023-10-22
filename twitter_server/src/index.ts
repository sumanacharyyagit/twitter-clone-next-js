import dotenv from "dotenv";
import { initServer } from "./app";

dotenv.config();
async function init() {
    const app = await initServer();
    const PORT = process.env.PORT ?? "8080";

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

init();
