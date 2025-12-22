"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const __dirname__ = process.cwd();
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const feedRoutes_1 = __importDefault(require("./routes/feedRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname__, 'uploads')));
app.use("/api/users", userRoutes_1.default);
app.use("/api", authRoutes_1.default);
app.use("/api/posts", postRoutes_1.default);
app.use("/api/feed", feedRoutes_1.default);
app.use("/api/users/", adminRoutes_1.default);
app.use("/api/search", searchRoutes_1.default);
const clientPath = path_1.default.join(__dirname, 'frontend/build');
app.use(express_1.default.static(clientPath));
app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.sendStatus(404);
    }
    res.sendFile(path_1.default.join(clientPath, 'index.html'));
});
const PORT = env_1.env.port || 3000;
app.listen(PORT, async () => {
    await (0, db_1.connectDB)();
    console.log(`Server listening on ${PORT}`);
});
