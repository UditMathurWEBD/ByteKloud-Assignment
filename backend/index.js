import express from "express";
import UserRoutes from "./Routes/userRoutes.js";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());
const port = 5100;

UserRoutes(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
