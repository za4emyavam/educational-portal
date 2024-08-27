import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    deleteStudyGroup, retrieveMajors,
    retrieveStudyGroupByGroupId,
    saveStudyGroup,
    updateStudyGroup
} from "../../api/MemberApi";
import NoContentComponent from "../NoContentComponent";
import AdminManageComponent from "./AdminManageComponent";
import {useFormik} from "formik";

export default function StudyGroupComponent() {
    const {groupId} = useParams()
    const [studyGroup, setStudyGroup] = useState(null)
    const [majors, setMajors] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalErrorOpen, setIsModalErrorOpen] = useState(false)
    const navigator = useNavigate()

    useEffect(() => {
        refreshStudyGroup()
    }, []);

    function refreshStudyGroup() {
        setIsLoading(true)
        if (groupId != null) {
            Promise.all([
                retrieveStudyGroupByGroupId(groupId), retrieveMajors()
            ])
                .then((responses) => {
                    setStudyGroup(responses[0].data)
                    setMajors(responses[1].data)
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoading(false))
        } else {
            Promise.all([
                retrieveMajors()
            ])
                .then((responses) => {
                    setMajors(responses[0].data)
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
        deleteStudyGroup(groupId)
            .then(() => navigator('/admin/manage/study_groups'))
            .catch(() => setIsModalErrorOpen(true))
            .finally(() => setIsLoading(false))
    }

    const validate = values => {
        const errors = {};

        if (values.groupName.length === 0) {
            errors.name = 'Потрібна назва'
        }

        if (!Number.isInteger(values.yearOfStudy)) {
            errors.yearOfStudy = 'Потрібен номер курсу'
        } else {
            if (values.yearOfStudy <= 0 || values.yearOfStudy > 5) {
                errors.yearOfStudy = 'Потрібен валідний номер курсу'
            }
        }

        if (!values.majorId) {
            errors.majorId = 'Потрібен код спеціальності';
        } else if (values.majorId < 1) {
            errors.majorId = 'Код спеціальності не може бути менше 1';
        }
        return errors
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: studyGroup ? {
            groupName: studyGroup.name,
            majorId: studyGroup.major.majorId,
            yearOfStudy: studyGroup.yearOfStudy
        } : {
            groupName: '',
            majorId: '',
            yearOfStudy: ''
        }, validate, onSubmit: values => {
            if (groupId != null) {
                Promise.all([updateStudyGroup(groupId, ({
                    groupName: values.groupName,
                    majorId: values.majorId,
                    yearOfStudy: values.yearOfStudy
                }))])
                    .then(() => navigator('/admin/manage/study_groups'))
                    .catch(() => setErrorMessage('Група з такою комбінацією спеціальності, номером курсу і назвою вже існує'))
            } else {
                Promise.all([saveStudyGroup(({
                    groupName: values.groupName,
                    majorId: values.majorId,
                    yearOfStudy: values.yearOfStudy
                }))])
                    .then(() => navigator('/admin/manage/study_groups'))
                    .catch(() => setErrorMessage('Група з такою комбінацією спеціальності, номером курсу і назвою вже існує'))
            }
        }
    })

    if (isLoading) {
        return (<div></div>)
    }

    if (!isLoading && !studyGroup && groupId != null) {
        return (<NoContentComponent/>)
    }

    if (!isLoading && majors.length <= 0) {
        return (<div>
            Необхідно спочатку створити спеціальність
        </div>)
    }

    return (<div className="flex">
        <AdminManageComponent/>
        <div className="w-[77vw] flex flex-col justify-center items-center mt-10">
            <h1 className="text-3xl font-bold mb-[10px]">{studyGroup ? "Зміна навчальної групи" : "Створення навчальної групи"}</h1>
            {groupId && <button className="btn btn-danger" onClick={onDeleteHandle}>
                Видалити навчальну групу
            </button>}
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col p-8 bg-white shadow-md rounded"
            >
                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    Номер курсу
                </label>
                <input type="number" id="yearOfStudy"
                       name="yearOfStudy"
                       onChange={formik.handleChange}
                       value={formik.values.yearOfStudy}
                       placeholder="Введіть курс"
                       min={1}
                       max={5}
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.errors.yearOfStudy ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.yearOfStudy}</div>
                ) : null}
                <label htmlFor="textField" className="font-bold text-gray-700 mb-2">
                    Назва навчальної групи
                </label>
                <input type="text" id="groupName"
                       name="groupName"
                       onChange={formik.handleChange}
                       value={formik.values.groupName}
                       placeholder="Введіть назву"
                       className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {formik.touched.groupName && formik.errors.groupName ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.groupName}</div>
                ) : null}
                <label
                    htmlFor="majorId"
                    className="font-bold text-gray-700 mb-2"
                >
                    Спеціальність
                </label>
                <select
                    id="majorId"
                    name="majorId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.majorId}
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" label="Оберіть спеціальність"/>
                    {majors.map(major => (<option
                        key={major.majorId}
                        value={major.majorId}
                    >
                        {major.name}
                    </option>))}
                </select>
                {formik.touched.majorId && formik.errors.majorId ? (
                    <div className="mt-2 text-sm text-red-600">{formik.errors.majorId}</div>
                ) : null}
                {errorMessage && (
                    <div className="text-sm text-red-600">{errorMessage}</div>
                )}
                <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    {groupId ? 'Оновити' : 'Створити'}
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
                <p className="text-sm mb-4">Ви впевнені, що хочете видалити цю навчальну групу?</p>
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
                <p className="text-sm mb-4">Можливо деякі студенти ще пов'язані з цією навчальною групою. Спочатку
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