import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import i18n from "i18next";

dayjs.extend(relativeTime);

const getLocale = () => {
    const lang = i18n.language;
    if (["ru", "en"].includes(lang)) return lang;
    return "ru"; // fallback для "kz" или других
};


dayjs.locale(getLocale());

export const getRelativeTime = (date: string) => {
    return dayjs(date).fromNow();
};
