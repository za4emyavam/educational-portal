export function formDate(dateStr) {
    const date = new Date(dateStr)
    const options = { month: 'short' }; // Указываем, что нам нужно сокращенное название месяца

    const ukrainianMonths = new Intl.DateTimeFormat('uk-UA', options);
    return [date.getDate(), ukrainianMonths.format(date),
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())]
}