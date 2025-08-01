export const formatDateToTime = (dateString: string) => {
    try {
        const date = new Date(dateString);

        return date.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24-годинний формат
        });
    } catch (e) {
        console.error("Помилка форматування часу:", e);
        return "Невалідний час";
    }
};