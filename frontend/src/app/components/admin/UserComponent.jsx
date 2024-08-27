import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    retrieveAllStudyGroups, retrieveMajors, saveStudent, saveTeacher,
} from "../../api/MemberApi";
import {useFormik} from "formik";
import AdminManageComponent from "./AdminManageComponent";

export default function UserComponent() {
    const [studyGroups, setStudyGroups] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [role, setRole] = useState("STUDENT")
    const navigator = useNavigate()

    useEffect(() => {
        refreshMajor()
    }, []);

    function refreshMajor() {
        setIsLoading(true)
        Promise.all([retrieveAllStudyGroups(), retrieveMajors()])
            .then((responses) => {
                setStudyGroups(responses[0].data)
            })
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false))
    }

    function handleRoleStudent() {
        setRole("STUDENT")
    }

    function handleRoleTeacher() {
        setRole("TEACHER")
    }

    const validate = values => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Потрібна пошта'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Потрібна валідна пошта'
        }

        if (!values.password) {
            errors.password = 'Потрібен новий пароль';
        } else if (values.password.length < 8) {
            errors.password = 'Пароль має бути не менше 8 символів';
        }

        if (!values.firstName) {
            errors.firstName = `Потрібне ім'я`
        }

        if (!values.lastName) {
            errors.lastName = `Потрібне прізвище`
        }

        if (role === "STUDENT") {
            if (!values.groupId) {
                errors.groupId = 'Потрібен код групи';
            } else if (values.groupId < 1) {
                errors.password = 'Код групи не може бути менше 1';
            }
        }

        return errors
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            patronymic: '',
            groupId: '',
            yearOfEntry: new Date().toISOString().split('T')[0]
        }, validate, onSubmit: values => {
            switch (role) {
                case "TEACHER":
                    Promise.all([saveTeacher(({
                        email: values.email,
                        password: values.password,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        patronymic: values.patronymic
                    }))])
                        .then(() => navigator('/admin/manage/users'))
                        .catch(() => setErrorMessage('Користувач з такою поштою вже існує'))
                    break
                case "STUDENT":
                    Promise.all([saveStudent(({
                        email: values.email,
                        password: values.password,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        patronymic: values.patronymic,
                        groupId: values.groupId,
                        yearOfEntry: values.yearOfEntry
                    }))])
                        .then(() => navigator('/admin/manage/users'))
                        .catch(() => setErrorMessage('Користувач з такою поштою вже існує'))
                    break
                default:
                    console.log()
                    break
            }
        }
    });

    if (isLoading) {
        return (
            <div></div>
        )
    }

    return (<div className="flex">
        <AdminManageComponent/>
        <div className="w-[77vw] flex flex-col justify-center items-center mt-10">
            <h1 className="text-3xl font-bold mb-[10px]">{role === "STUDENT" ? "Створення студента" : "Створення викладача"}</h1>
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col p-8flex flex-col p-8 bg-white shadow-md rounded"
            >
                <div className="flex flex-row gap-3">
                    <p className="font-bold text-gray-700 mb-2 mt-[7px]">Роль:</p>
                    <div
                        className={role === "STUDENT" ? "font-bold text-gray-500 mb-2 btn btn-outline-dark" : " btn font-bold text-gray-700 mb-2"}
                        onClick={handleRoleStudent}>
                        Студент
                    </div>
                    <div
                        className={role === "TEACHER" ? "font-bold text-gray-500 mb-2 btn btn-outline-dark" : " btn font-bold text-gray-700 mb-2"}
                        onClick={handleRoleTeacher}>
                        Викладач
                    </div>
                </div>
                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    Пошта
                </label>
                <input type="email" id="email"
                       name="email"
                       onChange={formik.handleChange}
                       value={formik.values.email}
                       placeholder="Введіть email"
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.touched.email && formik.errors.email ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.email}</div>
                ) : null}

                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    Пароль
                </label>
                <input type="password" id="password"
                       name="password"
                       onChange={formik.handleChange}
                       value={formik.values.password}
                       placeholder="Введіть пароль"
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.touched.password && formik.errors.password ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.password}</div>
                ) : null}

                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    Ім'я
                </label>
                <input type="text" id="firstName"
                       name="firstName"
                       onChange={formik.handleChange}
                       value={formik.values.firstName}
                       placeholder="Введіть ім'я"
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.firstName}</div>
                ) : null}

                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    Прізвище
                </label>
                <input type="text" id="lastName"
                       name="lastName"
                       onChange={formik.handleChange}
                       value={formik.values.lastName}
                       placeholder="Введіть прізвище"
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.lastName}</div>
                ) : null}

                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    По батькові (опціонально)
                </label>
                <input type="text" id="patronymic"
                       name="patronymic"
                       onChange={formik.handleChange}
                       value={formik.values.patronymic}
                       placeholder="Введіть по батькові"
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.touched.patronymic && formik.errors.patronymic ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.patronymic}</div>
                ) : null}
                {role === "STUDENT" && (
                    <div>
                        <div className="mb-4">
                            <label
                                htmlFor="groupId"
                                className="font-bold text-gray-700 mb-2"
                            >
                                Навчальна група
                            </label>
                            <select
                                id="groupId"
                                name="groupId"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.groupId}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" label="Оберіть спеціальність"/>
                                {studyGroups.map(group => (<option
                                    key={group.groupId}
                                    value={group.groupId}
                                >
                                    Курс: {group.yearOfStudy} ({group.major.majorId} {group.major.name}) Група: {group.name}
                                </option>))}
                            </select>
                            {formik.touched.groupId && formik.errors.groupId ? (
                                <div className="mt-2 text-sm text-red-600">{formik.errors.groupId}</div>
                            ) : null}
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="text-sm text-red-600">{errorMessage}</div>
                )}
                <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    Створити
                </button>
            </form>
        </div>
    </div>)
}