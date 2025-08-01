export const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);

        return date.toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch (e) {
        console.error("Помилка форматування дати:", e);
        return "Невалідна дата";
    }
};