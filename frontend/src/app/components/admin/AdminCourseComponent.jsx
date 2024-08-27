import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    deleteSubject, retrieveAllStudyGroups, retrieveAllTeachers,retrieveSubject,
    saveSubject, updateSubject
} from "../../api/MemberApi";

import {useFormik} from "formik";
import NoContentComponent from "../NoContentComponent";
import AdminManageComponent from "./AdminManageComponent";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

export default function AdminCourseComponent() {
    const {courseId} = useParams()
    const [subject, setSubject] = useState(null)
    const [studyGroups, setStudyGroups] = useState([])
    const [teachers, setTeachers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalErrorOpen, setIsModalErrorOpen] = useState(false)
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
    const [formValues, setFormValues] = useState(null)
    const [initVal, setInitVal] = useState(null)
    const navigator = useNavigate()
    const animatedComponents = makeAnimated();

    useEffect(() => {
        refreshStudyGroup()
    }, []);

    function refreshStudyGroup() {
        setIsLoading(true)
        if (courseId != null) {
            Promise.all([
                retrieveSubject(courseId),
                retrieveAllStudyGroups(), retrieveAllTeachers()
            ])
                .then((responses) => {
                    setSubject(responses[0].data)
                    setStudyGroups(responses[1].data)
                    setTeachers(responses[2].data)
                    const groups = responses[0].data.groupsList.map(group => group.groupId)
                    const groupsId = groups.map(id => responses[1].data.findIndex(group => group.groupId === id))
                    setInitVal({
                        name: responses[0].data.name,
                        teacher: responses[0].data.teacherId,
                        groups: groupsId
                    })
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false))
        } else {
            Promise.all([
                retrieveAllStudyGroups(), retrieveAllTeachers()
            ])
                .then((responses) => {
                    setStudyGroups(responses[0].data)
                    setTeachers(responses[1].data)
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false))
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
        deleteSubject(courseId)
            .then(() => navigator('/admin/manage/courses'))
            .catch(() => setIsModalErrorOpen(true))
            .finally(() => setIsLoading(false))
    }

    const handleSubmitForm = () => {
        setIsLoading(true)
        setIsSubmitModalOpen(false)
        Promise.all([updateSubject(courseId, ({
            name: formValues.name,
            teacherId: formValues.teacher,
            groups: formValues.groups
        }))])
            .then(() => navigator('/admin/manage/courses'))
            .catch(() => setErrorMessage('Помилка'))
    }

    const validate = values => {
        const errors = {};

        if (values.name.length === 0) {
            errors.name = 'Потрібна назва'
        }

        if (values.teacher === '') {
            errors.teacher = 'Потрібен викладач'
        }

        if (values.groups.length === 0) {
            errors.groups = 'Потрібно вказати групи'
        } else {
            const yearOfStudy = studyGroups.find(group => group.groupId === values.groups[0]).yearOfStudy
            values.groups.map((groupV) => {
                if (studyGroups.find(group => group.groupId === groupV).yearOfStudy !== yearOfStudy) {
                    errors.groups = 'Групи повинні бути одного курсу'
                }
            })
        }
        return errors
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initVal !== null ? initVal : {
            name: '',
            teacher: '',
            groups: []
        }, validate, onSubmit: values => {
            if (subject != null) {
                setFormValues(values)
                setIsSubmitModalOpen(true)
            } else {
                Promise.all([saveSubject(({
                    name: values.name,
                    teacherId: values.teacher,
                    groups: values.groups
                }))])
                    .then(() => navigator('/admin/manage/courses'))
                    .catch(() => setErrorMessage('Помилка'))
            }
            console.log(values)
        }
    });

    if (isLoading) {
        return (<div></div>)
    }

    if (!isLoading && !subject && courseId != null) {
        return (<NoContentComponent/>)
    }

    if (!isLoading && studyGroups.length <= 0) {
        return (<div>
            Необхідно спочатку навчальні групи
        </div>)
    }

    return (<div className="flex">
        <AdminManageComponent/>
        <div className="w-[77vw] flex flex-col justify-center items-center mt-10">
            <div className="w-[500px]">
                <h1 className="text-3xl font-bold mb-[10px] text-center">{courseId ? "Зміна предмету" : "Створення предмету"}</h1>
                {courseId && <button className="btn btn-danger relative left-[150px]" onClick={onDeleteHandle}>
                    Видалити предмет
                </button>}
                <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col p-8 bg-white shadow-md rounded"
                >
                    <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                        Назва предмету
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
                    <div className="mt-4">
                        <label
                            htmlFor="teacher"
                            className="font-bold text-gray-700 mb-2"
                        >
                            Викладач
                        </label>
                        <Select
                            id="teacher"
                            name="teacher"
                            options={teachers.map((teacher) => ({
                                value: teacher.teacherId,
                                label: (teacher.lastname + ' ' + teacher.firstname + ' ' + (teacher.patronymic ? teacher.patronymic : ''))
                            }))}
                            components={animatedComponents}
                            onChange={(selectedOption) => {
                                formik.values.teacher = selectedOption ? selectedOption.value : ''
                            }}
                            classNamePrefix="select"
                            placeholder="Обрати..."
                        />
                        {formik.touched.teacher && formik.errors.teacher ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.teacher}</div>
                        ) : null}
                    </div>
                    <div className="mt-4 mb-4">
                        <label
                            htmlFor="groups"
                            className="font-bold text-gray-700 mb-2"
                        >
                            Навчальні групи
                        </label>
                        <Select
                            id="groups"
                            name="groups"
                            closeMenuOnSelect={false}
                            isMulti
                            options={studyGroups.map((group) => ({
                                value: group.groupId,
                                label: (`Курс: ${group.yearOfStudy} (${group.major.majorId} ${group.major.name}) Група: ${group.name}`),
                            }))}
                            components={animatedComponents}
                            onChange={(selectedOptions) => {
                                formik.values.groups = selectedOptions ? selectedOptions.map(option => option.value) : []
                            }}
                            defaultValue={initVal && initVal.groups.map(id => studyGroups.map((group) => ({
                                value: group.groupId,
                                label: (`Курс: ${group.yearOfStudy} (${group.major.majorId} ${group.major.name}) Група: ${group.name}`),
                            }))[id])}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Обрати..."
                        />
                        {formik.touched.groups && formik.errors.groups ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.groups}</div>
                        ) : null}
                    </div>
                    {errorMessage && (
                        <div className="text-sm text-red-600">{errorMessage}</div>
                    )}
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        {courseId ? 'Оновити' : 'Створити'}
                    </button>
                </form>
            </div>
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
            <SubmitConfirmationModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onConfirm={handleSubmitForm}
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
                <p className="text-sm mb-4">Ви впевнені, що хочете видалити цей предмет зі всіма оцінками?</p>
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
                <p className="text-sm mb-4"></p>
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

function SubmitConfirmationModal({isOpen, onClose, onConfirm}) {
    return (<>
        {isOpen && (<div
            className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Підтвердження зміни</h2>
                <p className="text-sm mb-4">При зміні груп або вчителя, автоматично видаляться всі оцінки студента. Ви впевнені?</p>
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