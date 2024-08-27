import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {retrieveAllSubjects} from "../../api/MemberApi";
import AdminManageComponent from "./AdminManageComponent";
import {fio} from "../../js/fio";

export default function AdminCoursesComponent() {
    const [isLoading, setIsLoading] = useState(true)
    const [courses, setCourses] = useState([])
    const navigator = useNavigate()

    useEffect(() => {
        refreshCourses()
    }, [])

    function refreshCourses() {
        setIsLoading(true)
        Promise.all([
            retrieveAllSubjects()
        ])
            .then((responses) => {
                setCourses(responses[0].data)
            })
            .finally(() => setIsLoading(false))
    }

    function onClickHandle() {
        navigator('/admin/manage/courses/course')
    }

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (!isLoading && courses.length === 0) {
        return (
            <div>Доки нема навчальної групи</div>
        )
    }

    return (
        <div className="flex">
            <AdminManageComponent/>
            <div className="p-4">
                <div className="flex flex-row mb-[10px]">
                    <h1 className="text-3xl font-bold mb-6">Список предметів</h1>
                    <button className="left-[50px] relative btn btn-success text-center"
                            onClick={onClickHandle}>Створити новий предмет
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                    {courses.map(course => (
                        <Link to={`/admin/manage/courses/course/${course.subjectId}`} key={course.subjectId}
                              className="bg-white shadow-md rounded-lg p-6 no-underline text-black">
                            <h2 className="text-xl font-semibold mb-1"><span className="text-sm">{course.subjectId}</span> {course.name}</h2>
                            <h1 className="text-xl font-semibold mb-1">{fio(course)}</h1>
                            {course.groupsList.map((group) => (
                                <p key={group.groupId} className="text-gray-700 mb-1">
                                    Курс: {group.yearOfStudy} ({group.major.majorId} {group.major.name}) Група: {group.groupName}
                                </p>
                            ))}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}