import type { FileDatesClasification, Select } from "../types/UITypes";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR

const MONTHS_NAME: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];
const DAYS_NAME: string[] = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
];

export function setDateFormatStr(dateStr: string = '', format: string = ""): string {
    try {
        return setDateFormat(new Date(dateStr), format);
    } catch (e) {
        return null;
    }
}

export function groupByDateClasification(date: Date): FileDatesClasification {
    let today = new Date();
    let difDAYS_NAME = today.getDate() - date.getDate();
    switch (true) {
        case difDAYS_NAME === 0 &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear():
            return "Hoy";
        case difDAYS_NAME < 7 &&
            today.getDay() > date.getDay() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear():
            return "Esta Semana";
        case today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear():
            return "Este Mes";
        case today.getMonth() - 1 === date.getMonth() &&
            today.getFullYear() === date.getFullYear():
            return "Mes Previo";
        case today.getFullYear() === date.getFullYear():
            return "Este año";
        default:
            return "Hace mucho tiempo";
    }
}

export function setDateFormat(date = new Date(), format = "dd/mm/yyyy"): string {
    const currentMonth: number = date.getMonth();
    const currentHour: number = date.getHours();

    const keys: Select[] = [
        { label: "YYYY", value: date.getFullYear().toString() },
        { label: "yyyy", value: date.getFullYear().toString() },
        { label: "YY", value: String(date.getFullYear()).substring(0, 2) },
        { label: "yy", value: String(date.getFullYear()).substring(0, 2) },
        { label: "MONTH", value: MONTHS_NAME[currentMonth].toUpperCase() },
        { label: "month", value: MONTHS_NAME[currentMonth] },
        {
            label: "MMM",
            value: MONTHS_NAME[currentMonth].toUpperCase().substring(0, 3),
        },
        { label: "mmm", value: MONTHS_NAME[currentMonth].substring(0, 3) },
        { label: "MM", value: String(currentMonth + 1).padStart(2, "0") },
        { label: "mm", value: String(currentMonth + 1).padStart(2, "0") },
        { label: "DAY", value: DAYS_NAME[date.getDay()] },
        { label: "DD", value: String(date.getDate()).padStart(2, "0") },
        { label: "dd", value: String(date.getDate()).padStart(2, "0") },
        { label: "HH24", value: String(currentHour).padStart(2, "0") },
        {
            label: "HH",
            value: String(
                currentHour > 12 ? currentHour - 12 : currentHour
            ).padStart(2, "0"),
        },
        {
            label: "AMPM",
            value: String(currentHour > 12 ? "PM" : "AM").padStart(2, "0"),
        },
        {
            label: "ampm",
            value: String(currentHour > 12 ? "pm" : "am").padStart(2, "0"),
        },
        { label: "MI", value: String(date.getMinutes()).padStart(2, "0") },
        { label: "SS", value: String(date.getSeconds()).padStart(2, "0") },
    ];
    keys.forEach((key) => {
        format = format.replace(key.label, key.value);
    });
    return format;
}

export function secondsStrToTime(seconds: string): string {
    if (Number(seconds)) {
        return secondsToTime(Number(seconds))
    }
    return "00:00"
}

export function secondsToTime(seconds: number): string {
    switch (true) {
        case seconds < MINUTE:
            return `00:${Math.round(seconds).toString().padStart(2, "0")}`
        case seconds < HOUR:
            return `${Math.trunc(seconds / MINUTE).toString().padStart(2, "0")}:${Math.round(seconds % MINUTE).toString().padStart(2, "0")}`
        case seconds < DAY:
            return `${Math.trunc(seconds / HOUR).toString().padStart(2, "0")}:${secondsToTime(seconds % HOUR)}`
        default:
            return `${Math.trunc(seconds / DAY).toString().padStart(2, "0")} Days ${secondsToTime(seconds % DAY)}`
    }
}