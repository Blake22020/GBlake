"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAndSaveAvatar = processAndSaveAvatar;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const UPLOADS_DIR = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
async function processAndSaveAvatar(buffer) {
    const filename = `${(0, uuid_1.v4)()}.webp`;
    const outputPath = path_1.default.join(UPLOADS_DIR, filename);
    await (0, sharp_1.default)(buffer)
        .resize(256, 256, { fit: "cover", position: "center" })
        .webp({ quality: 80 })
        .toFile(outputPath);
    return `/uploads/${filename}`;
}
