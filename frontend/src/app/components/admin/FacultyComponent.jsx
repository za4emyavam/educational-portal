import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {deleteFaculty, retrieveFacultyById, saveFaculty, updateFaculty} from "../../api/MemberApi";
import NoContentComponent from "../NoContentComponent";
import AdminManageComponent from "./AdminManageComponent";
import {Field, Form, Formik} from "formik";

export default function FacultyComponent() {
    const {facultyId} = useParams()
    const [faculty, setFaculty] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalErrorOpen, setIsModalErrorOpen] = useState(false)
    const navigator = useNavigate()

    useEffect(() => {
        refreshFaculty()
    }, []);

    function refreshFaculty() {
        setIsLoading(true)
        if (facultyId != null) {
            Promise.all([
                retrieveFacultyById(facultyId)
            ])
                .then((responses) => {
                    setFaculty(responses[0].data)
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }

    const onDeleteHandle = (event) => {
        event.preventDefault();
        setIsModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        setIsLoading(true)
        setIsModalOpen(false)
        deleteFaculty(facultyId)
            .then(() => navigator('/admin/manage/faculties'))
            .catch(() => setIsModalErrorOpen(true))
            .finally(() => setIsLoading(false))
    }

    const onSubmit = (values) => {
        if (facultyId != null) {
            Promise.all([updateFaculty(facultyId, ({
                name: values.name
            }))])
                .then()
        } else {
            Promise.all([saveFaculty(({
                name: values.name
            }))])
                .then()
        }
        navigator('/admin/manage/faculties')
    }

    const validate = values => {
        if (values.name.length === 0) {
            setErrorMessage('Заповніть поле')
        }
    };

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (!isLoading && !faculty && facultyId != null) {
        return (<NoContentComponent/>)
    }

    return (
        <div className="flex">
            <AdminManageComponent/>
            <div className="w-[77vw] flex flex-col justify-center items-center mt-10">
                <h1 className="text-3xl font-bold mb-[10px]">{facultyId ? "Зміна назви факультета" : "Створення факультета"}</h1>
                {facultyId &&
                    <button className="btn btn-danger" onClick={onDeleteHandle}>
                    Видалити факультет
                    </button>
                }

                <Formik
                    initialValues={{name: ''}}
                    onSubmit={onSubmit}
                    validate={validate}
                >
                    {props => (
                        <Form className="flex flex-col p-8 bg-white shadow-md rounded">
                            <label htmlFor="textField" className="text-sm font-bold text-gray-700 mb-2">
                                Назва факультета
                            </label>
                            <Field
                                id="name"
                                name="name"
                                placeholder="Введіть назву"
                                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {errorMessage && (
                                <div className="flex items-center justify-between text-red-500 text-[17px]">
                                    {errorMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                                disabled={props.isSubmitting}
                            >
                                {facultyId ? 'Оновити' : 'Створити'}
                            </button>
                        </Form>
                    )}
                </Formik>
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
        </div>
    )
}

function DeleteConfirmationModal({isOpen, onClose, onConfirm}) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Підтвердження видалення</h2>
                        <p className="text-sm mb-4">Ви впевнені, що хочете видалити цей факультет?</p>
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
                </div>
            )}
        </>
    );
}

function DeleteErrorModal({isOpen, onClose}) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Сталися помилка</h2>
                        <p className="text-sm mb-4">Можливо деякі кафедри чи спеціальності ще пов'язані з цим факультетом. Спочатку видалити їх.</p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                onClick={onClose}>
                                Відміна
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}