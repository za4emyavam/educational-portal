import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import NoContentComponent from "../NoContentComponent";
import {
    deleteStudent,
    retrieveAllStudyGroups, retrieveMajors,
    retrieveStudentById, updateStudent
} from "../../api/MemberApi";
import {useFormik} from "formik";
import AdminManageComponent from "./AdminManageComponent";

export default function StudentComponent() {
    const {studentId} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [student, setStudent] = useState(null)
    const [initVal, setInitVal] = useState(null)
    const [studyGroups, setStudyGroups] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalErrorOpen, setIsModalErrorOpen] = useState(false)
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
    const navigator = useNavigate()
    const [formValues, setFormValues] = useState(null)


    useEffect(() => {
        refreshStudent()
    }, []);

    function refreshStudent() {
        setIsLoading(true)
        Promise.all([retrieveStudentById(studentId), retrieveAllStudyGroups()])
            .then((responses) => {
                if (responses[0].data != null) {
                    setStudent(responses[0].data)
                    setInitVal({
                        email: responses[0].data.email,
                        firstName: responses[0].data.firstname,
                        lastName: responses[0].data.lastname,
                        patronymic: responses[0].data.patronymic,
                        groupId: responses[0].data.groupId
                    })
                }
                setStudyGroups(responses[1].data)
            })
            .catch((error) => console.log)
            .finally(() => setIsLoading(false))
    }

    const onDeleteHandle = (event) => {
        event.preventDefault();
        setIsModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        setIsLoading(true)
        setIsModalOpen(false)
        deleteStudent(studentId)
            .then(() => navigator('/admin/manage/users'))
            .catch(() => setIsModalErrorOpen(true))
            .finally(() => setIsLoading(false))
    }

    const handleSubmitForm = () => {
        setIsLoading(true)
        setIsSubmitModalOpen(false)
        Promise.all([updateStudent(studentId, ({
            email: formValues.email,
            password: 'AspiNDkansdkjasduU3lakjdpa:xmaksmd',
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            patronymic: formValues.patronymic,
            groupId: formValues.groupId
        }))])
            .then(() => navigator('/admin/manage/users'))
            .catch(() => setErrorMessage('Користувач з такою поштою вже існує'))
    }

    const validate = values => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Потрібна пошта'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Потрібна валідна пошта'
        }

        if (!values.firstName) {
            errors.firstName = `Потрібне ім'я`
        }

        if (!values.lastName) {
            errors.lastName = `Потрібне прізвище`
        }

        if (!values.groupId) {
            errors.groupId = 'Потрібен код групи';
        } else if (values.groupId < 1) {
            errors.password = 'Код групи не може бути менше 1';
        }

        return errors
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initVal ? initVal : {
            email: '',
            firstName: '',
            lastName: '',
            patronymic: '',
            groupId: ''}
        , validate, onSubmit: values => {
            setFormValues(values)
            setIsSubmitModalOpen(true)
        }
    });

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (!isLoading && !student) {
        return <NoContentComponent/>
    }

    return (<div className="flex">
        <AdminManageComponent/>
        <div className="w-[77vw] flex flex-col justify-center items-center mt-10">
            <h1 className="text-3xl font-bold mb-[10px]">Зміна студента</h1>
            <button className="btn btn-danger" onClick={onDeleteHandle}>
                Видалити студента
            </button>
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col p-8flex p-8 bg-white shadow-md rounded"
            >
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
                {errorMessage && (
                    <div className="text-sm text-red-600">{errorMessage}</div>
                )}
                <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    Оновити
                </button>
            </form>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
            <SubmitConfirmationModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onConfirm={handleSubmitForm}
            />
            <DeleteErrorModal
                isOpen={isModalErrorOpen}
                onClose={() => setIsModalErrorOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    </div>)
}

function SubmitConfirmationModal({isOpen, onClose, onConfirm}) {
    return (<>
        {isOpen && (<div
            className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Підтвердження зміни</h2>
                <p className="text-sm mb-4">При зміні групи, автоматично видаляться всі оцінки студента. Ви впевнені?</p>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onConfirm}>
                        Змінити
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={onClose}>
                        Відміна
                    </button>
                </div>
            </div>
        </div>)}
    </>);
}

function DeleteConfirmationModal({isOpen, onClose, onConfirm}) {
    return (<>
        {isOpen && (<div
            className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Підтвердження видалення</h2>
                <p className="text-sm mb-4">Ви впевнені, що хочете видалити цього студента?</p>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onConfirm}>
                        Видалити
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={onClose}>
                        Відміна
                    </button>
                </div>
            </div>
        </div>)}
    </>);
}

function DeleteErrorModal({isOpen, onClose}) {
    return (<>
        {isOpen && (<div
            className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Сталися помилка</h2>
                <p className="text-sm mb-4">Можливо деякі курси ще пов'язані з цим викладачем. Спочатку видалити їх.</p>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={onClose}>
                        Відміна
                    </button>
                </div>
            </div>
        </div>)}
    </>);
}