# Sharp WebP Image Optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Интегрировать `sharp` в маршрут загрузки аватара, чтобы каждое входящее изображение автоматически сжималось и конвертировалось в WebP перед сохранением на диск.

**Architecture:** Multer переводится на `memoryStorage` (файл попадает в `req.file.buffer`), после чего отдельная утилита `src/utils/processImage.ts` обрабатывает буфер через `sharp` (resize + WebP) и сохраняет результат в `/uploads`. Маршрут `POST /api/users/me/avatar` в `userRoutes.ts` вызывает утилиту вместо прямой записи Multer-файла.

**Tech Stack:** Node.js/Express/TypeScript, `sharp` ^0.33, `multer` (memoryStorage), `uuid` для имён файлов.

---

## Карта изменяемых файлов

| Действие | Путь |
|---|---|
| Создать | `src/utils/processImage.ts` |
| Изменить | `src/routes/userRoutes.ts` |
| Установить | `sharp`, `@types/sharp`, `uuid`, `@types/uuid` |

---

### Задача 1: Установка зависимостей

**Files:**
- Modify: `package.json` (автоматически через npm)

- [ ] **Шаг 1: Установить пакеты**

```bash
npm install sharp uuid
npm install --save-dev @types/sharp @types/uuid
```

- [ ] **Шаг 2: Проверить, что пакеты появились в `package.json`**

```bash
grep -E '"sharp"|"uuid"' package.json
```

Ожидаемый вывод — строки с версиями обоих пакетов.

- [ ] **Шаг 3: Убедиться, что TypeScript видит типы**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Ожидаемый вывод: пустой (нет ошибок) или только уже существующие предупреждения.

- [ ] **Шаг 4: Коммит**

```bash
git add package.json package-lock.json
git commit -m "chore: install sharp and uuid for image processing"
```

---

### Задача 2: Утилита обработки изображений

**Files:**
- Create: `src/utils/processImage.ts`

- [ ] **Шаг 1: Создать файл `src/utils/processImage.ts`**

```typescript
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function processAndSaveAvatar(buffer: Buffer): Promise<string> {
    const filename = `${uuidv4()}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    await sharp(buffer)
        .resize(256, 256, { fit: "cover", position: "center" })
        .webp({ quality: 80 })
        .toFile(outputPath);

    return `/uploads/${filename}`;
}
```

- [ ] **Шаг 2: Убедиться, что TypeScript компилирует файл без ошибок**

```bash
npx tsc --noEmit 2>&1 | grep processImage
```

Ожидаемый вывод: пустой (ошибок нет).

- [ ] **Шаг 3: Коммит**

```bash
git add src/utils/processImage.ts
git commit -m "feat(utils): add processAndSaveAvatar with sharp WebP conversion"
```

---

### Задача 3: Переключение Multer на memoryStorage и использование утилиты

**Files:**
- Modify: `src/routes/userRoutes.ts`

Текущее состояние (строки 17–19):
```typescript
const upload = multer({
    dest: uploadsDir,
});
```

Текущий обработчик аватара сохраняет файл напрямую через Multer (`fileData.filename`) и строит путь как `/uploads/<filename>`.

- [ ] **Шаг 1: Заменить конфигурацию Multer на memoryStorage**

Удалить строки создания `uploadsDir` и инициализации `upload` (строки 12–19), заменить на:

```typescript
import { processAndSaveAvatar } from "../utils/processImage";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Разрешены только изображения"));
        }
    },
});
```

Также убрать неиспользуемые импорты `path` и `fs` из верхней части файла, если они больше не нужны (они по-прежнему нужны для удаления старого аватара — оставить).

- [ ] **Шаг 2: Обновить обработчик `POST /me/avatar`**

Заменить тело обработчика (строки 194–230) на:

```typescript
router.post(
    "/me/avatar",
    auth,
    upload.single("file"),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file?.buffer) return next(new AppError(400, "Файл не загружен"));

            const user = await User.findById(req.user?.id);
            if (!user) return next(new AppError(404, "Пользователь не найден"));

            if (user.avatar && !user.avatar.startsWith("http")) {
                const oldPath = path.join(
                    process.cwd(),
                    "uploads",
                    path.basename(user.avatar),
                );
                fs.unlink(oldPath, (err) => {
                    if (err)
                        console.log("Не удалось удалить старую аватарку:", err.message);
                });
            }

            const newAvatarPath = await processAndSaveAvatar(req.file.buffer);

            user.avatar = newAvatarPath;
            await user.save();

            res.json({
                message: "Аватар обновлён!",
                avatar: newAvatarPath,
            });
        } catch (err) {
            next(err);
        }
    },
);
```

- [ ] **Шаг 3: Убедиться, что весь файл компилируется**

```bash
npx tsc --noEmit 2>&1
```

Ожидаемый вывод: пустой.

- [ ] **Шаг 4: Коммит**

```bash
git add src/routes/userRoutes.ts
git commit -m "feat(avatar): use sharp + WebP via memoryStorage, add file type/size validation"
```

---

### Задача 4: Ручная проверка (smoke test)

**Files:** нет новых файлов.

- [ ] **Шаг 1: Запустить бэкенд**

```bash
npm run dev
```

Подождать строки `Server listening on 3000` в `backend-dev.log`.

- [ ] **Шаг 2: Загрузить тестовый аватар через curl**

```bash
# Сначала получить JWT (подставить реальный email/пароль)
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  | grep -oP '"token":"\K[^"]+')

# Загрузить любое изображение
curl -s -X POST http://localhost:3000/api/users/me/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/test.jpg"
```

Ожидаемый ответ:
```json
{ "message": "Аватар обновлён!", "avatar": "/uploads/<uuid>.webp" }
```

- [ ] **Шаг 3: Убедиться, что файл сохранён в WebP**

```bash
file uploads/*.webp | tail -1
```

Ожидаемый вывод: `... WebP image data ...`

- [ ] **Шаг 4: Убедиться, что файл меньше оригинала**

```bash
ls -lh uploads/*.webp | tail -1
```

Ожидаемый результат: размер значительно меньше исходного JPEG/PNG.

- [ ] **Шаг 5: Финальный коммит (если нужна правка по итогам smoke-теста)**

```bash
git add -p
git commit -m "fix(avatar): <описание правки>"
```

---

## Итог изменений

| Файл | Что изменилось |
|---|---|
| `src/utils/processImage.ts` | **Новый.** Resize 256×256 + WebP 80% качество через sharp |
| `src/routes/userRoutes.ts` | Multer → memoryStorage; вызов `processAndSaveAvatar`; валидация типа/размера |
| `package.json` | Добавлены `sharp`, `uuid` и их `@types` |
