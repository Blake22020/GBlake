import path from "path";
import sharp from "sharp";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { buffer } from "stream/consumers";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function processAndSaveAvatar(buffer: Buffer) {
    const filename = `${uuidv4()}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    await sharp(buffer)
        .resize(256, 256, { fit: "cover", position: "center" })
        .webp({ quality: 80 })
        .toFile(outputPath);

    return outputPath;
}
