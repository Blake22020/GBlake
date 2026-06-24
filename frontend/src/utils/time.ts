export function plural(value: number, forms: [string, string, string]): string {
    const mod10 = value % 10;
    const mod100 = value % 100;

    if (mod100 >= 11 && mod100 <= 14) return forms[2];
    if (mod10 === 1) return forms[0];
    if (mod10 >= 2 && mod10 <= 4) return forms[1];
    return forms[2];
}

export function timeAgo(date: Date): string {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();

    if (diffMs < 0) return "только что";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return `${years} ${plural(years, ["год", "года", "лет"])} назад`;
    }

    if (months > 0) {
        return `${months} ${plural(months, ["месяц", "месяца", "месяцев"])} назад`;
    }

    if (days > 0) {
        return `${days} ${plural(days, ["день", "дня", "дней"])} назад`;
    }

    if (hours > 0) {
        return `${hours} ${plural(hours, ["час", "часа", "часов"])} назад`;
    }

    if (minutes > 0) {
        return `${minutes} ${plural(minutes, ["минута", "минуты", "минут"])} назад`;
    }

    return "только что";
}
