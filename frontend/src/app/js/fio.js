export function fioByPersonalData(name) {
    const patronymic = name.patronymic === null ? '' : name.patronymic.charAt(0) + '.'
    return name.firstName.charAt(0) + '.' + patronymic + name.lastName
}

export function fio(name) {
    const patronymic = name.teacherPatronymicName === null ? '' : name.teacherPatronymicName.charAt(0) + '.'
    return name.teacherFirstName.charAt(0) + '.' + patronymic + name.teacherLastName
}