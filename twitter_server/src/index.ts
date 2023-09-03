import { initServer } from "./app";

async function init() {
    const app = await initServer();

    const PORT = 8080;

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

init();
