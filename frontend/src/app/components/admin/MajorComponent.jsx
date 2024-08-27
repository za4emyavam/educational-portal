import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import NoContentComponent from "../NoContentComponent";
import AdminManageComponent from "./AdminManageComponent";
import {useFormik} from "formik";
import {deleteMajor, retrieveAllFaculties, retrieveMajorById, saveMajor, updateMajor} from "../../api/MemberApi";

export default function MajorComponent() {
    const {majorId} = useParams()
    const [major, setMajor] = useState(null)
    const [faculties, setFaculties] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalErrorOpen, setIsModalErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigator = useNavigate()

    useEffect(() => {
        refreshMajor()
    }, []);

    function refreshMajor() {
        setIsLoading(true)
        if (majorId != null) {
            Promise.all([retrieveMajorById(majorId), retrieveAllFaculties()])
                .then((responses) => {
                    setMajor(responses[0].data)
                    setFaculties(responses[1].data)
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false))
        } else {
            Promise.all([retrieveAllFaculties()])
                .then((responses) => setFaculties(responses[0].data))
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false))
        }
    }

    const onDeleteHandle = (event) => {
        event.preventDefault();
        setIsModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        setIsLoading(true)
        setIsModalOpen(false)
        deleteMajor(majorId)
            .then(() => navigator('/admin/manage/majors'))
            .catch(() => setIsModalErrorOpen(true))
            .finally(() => setIsLoading(false))
    }

    const validate = values => {
        const errors = {};

        if (values.name.length === 0) {
            errors.name = 'Потрібна назва'
        }

        if (values.faculty === '') {
            errors.faculty = 'Потрібен факультет'
        }

        if (majorId == null) {
            if (!Number.isInteger(values.createdMajorId)) {
                errors.createdMajorId = 'Потрібен код спеціальності'
            } else {
                if (values.createdMajorId < 0 || values.createdMajorId >= 1000) {
                    errors.createdMajorId = 'Потрібен валідний код спеціальності'
                }
            }
        }
        return errors
    }

    const formik = useFormik({
        initialValues: {
            createdMajorId: '', name: '', faculty: ''
        }, validate, onSubmit: values => {
            if (majorId != null) {
                Promise.all([updateMajor(majorId, ({
                    majorId: majorId,
                    name: values.name,
                    facultyId: values.faculty
                }))])
                    .then(() => navigator('/admin/manage/majors'))
                    .catch(() => setErrorMessage('Помилка'))
            } else {
                Promise.all([saveMajor(({
                    majorId: values.createdMajorId,
                    name: values.name,
                    facultyId: values.faculty
                }))])
                    .then(() => navigator('/admin/manage/majors'))
                    .catch(() => setErrorMessage('Спеціальність з таким кодом вже існує'))
            }

        }
    });

    if (isLoading) {
        return (<div></div>)
    }

    if (!isLoading && !major && majorId != null) {
        return (<NoContentComponent/>)
    }

    if (!isLoading && faculties.length <= 0) {
        return (<div>
            Необхідно спочатку створити факультет
        </div>)
    }

    return (<div className="flex">
        <AdminManageComponent/>
        <div className="w-[77vw] flex flex-col justify-center items-center mt-10">
            <h1 className="text-3xl font-bold mb-[10px]">{majorId ? "Зміна спеціальності" : "Створення спеціальності"}</h1>
            {majorId && <button className="btn btn-danger" onClick={onDeleteHandle}>
                Видалити спеціальність
            </button>}
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col p-8flex flex-col p-8 bg-white shadow-md rounded"
            >
                {majorId == null && (
                    <div className="flex flex-col">
                        <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                            Код спеціальності
                        </label>
                        <input type="number" id="createdMajorId"
                               name="createdMajorId"
                               onChange={formik.handleChange}
                               value={formik.values.createdMajorId}
                               placeholder="Введіть код нової спеціальності"
                               min={1}
                               max={1000}
                               className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                        {formik.errors.createdMajorId ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.createdMajorId}</div>
                        ) : null}
                    </div>
                )}
                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    Назва спеціальності
                </label>
                <input type="text" id="name"
                       name="name"
                       onChange={formik.handleChange}
                       value={formik.values.name}
                       placeholder="Введіть назву"
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.touched.name && formik.errors.name ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.name}</div>
                ) : null}
                <div className="mb-4">
                    <label
                        htmlFor="faculty"
                        className="font-bold text-gray-700 mb-2"
                    >
                        Факультет
                    </label>
                    <select
                        id="faculty"
                        name="faculty"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.faculty}
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" label="Оберіть факультет"/>
                        {faculties.map(faculty => (<option
                            key={faculty.facultyId}
                            value={faculty.facultyId}
                        >
                            {faculty.name}
                        </option>))}
                    </select>
                    {formik.touched.faculty && formik.errors.faculty ? (
                        <div className="mt-2 text-sm text-red-600">{formik.errors.faculty}</div>
                    ) : null}
                </div>
                {errorMessage && (
                    <div className="text-sm text-red-600">{errorMessage}</div>
                )}
                <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    {majorId ? 'Оновити' : 'Створити'}
                </button>
            </form>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
            <DeleteErrorModal
                isOpen={isModalErrorOpen}
                onClose={() => setIsModalErrorOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    </div>)
}

function DeleteConfirmationModal({isOpen, onClose, onConfirm}) {
    return (<>
        {isOpen && (<div
            className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Підтвердження видалення</h2>
                <p className="text-sm mb-4">Ви впевнені, що хочете видалити цю спеціальність?</p>
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
                <p className="text-sm mb-4">Можливо деякі студенти ще пов'язані з цією спеціальністю. Спочатку
                    видалити їх.</p>
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