import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateTime = (datetime) => {
    if(!datetime){
        return null;
    }
    return dayjs(datetime).tz("UTC").format('YYYY-MM-DD HH:mm:ss');
};
  
export const formatDate = (datetime) => {
    return dayjs(datetime).format("DD-MMM-YYYY");
};
  
export const formatDateStandar = (datetime) => {
    return dayjs(datetime).format("YYYY-MM-DD");
};
  
export const dateTime = () => {
    return dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
};
  
export const dateOnly = () => {
    return dayjs(new Date()).format("YYYY-MM-DD");
};

export const ucWords = string => {
    return String(string).toLowerCase().replace(/\b[a-z]/g, (l) => l.toUpperCase())
}