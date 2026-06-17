import { app } from "./app.js";

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`AI Interview Copilot backend running on http://localhost:${port}`);
});