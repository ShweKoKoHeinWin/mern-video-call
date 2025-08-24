import { LANGUAGE_TO_FLAG } from "../constants";

const LocalStorage = (key, fallback, parse = true) => {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : (parse && typeof value !== 'string' ? JSON.parse(value) : value);
    } catch (error) {
        console.error('error in utils LocalStorage get()', error);
        return fallback
    }
};

LocalStorage.set = (key, value) => {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
        console.error('error in utils LocalStorage get()', error);
    }
}

const getLanguageFlag = (lang) => {
    if(!lang) return null;
    const countryCode = LANGUAGE_TO_FLAG[lang.toLowerCase()];
    if(!countryCode) return null;
    return `https://flagcdn.com/16x12/${countryCode}.png`;
}

const Str = {
    capitalize: (str) => str[0]?.toUpperCase() + str?.slice(1),
}

export default { LocalStorage, getLanguageFlag, Str }