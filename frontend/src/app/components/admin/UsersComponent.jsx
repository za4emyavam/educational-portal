import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {retrieveAllStudents, retrieveAllTeachers} from "../../api/MemberApi";
import AdminManageComponent from "./AdminManageComponent";

export default function UsersComponent() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigator = useNavigate()
    const [isStudents, setIsStudents] = useState(true)

    useEffect(() => {
        refreshUsers()
    }, [isStudents])

    function refreshUsers() {
        setIsLoading(true)
        if (isStudents) {
            Promise.all([
                retrieveAllStudents()
            ])
                .then((responses) => {
                    setUsers(responses[0].data)
                })
                .finally(() => setIsLoading(false))
        } else {
            Promise.all([
                retrieveAllTeachers()
            ])
                .then((responses) => {
                    setUsers(responses[0].data)
                })
                .finally(() => setIsLoading(false))
        }

    }

    function onClickHandle() {
        navigator('/admin/manage/users/user')
    }

    function onStudentClick() {
        setIsLoading(true)
        setIsStudents(true)
    }

    function onTeacherClick() {
        setIsLoading(true)
        setIsStudents(false)
    }

    function fio(name) {
        const patronymic = name.patronymic === null ? '' : name.patronymic.charAt(0) + '.'
        return name.firstname.charAt(0) + '.' + patronymic + name.lastname
    }

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (!isLoading && users.length === 0) {
        if (isStudents) {
            return (
                <div>Доки нема жодного студента</div>
            )
        } else {
            return (
                <div>Доки нема жодного викладача</div>
            )
        }
    }

    return (
        <div className="flex">
            <AdminManageComponent/>
            <div className="p-4 relative">
                <div className="flex flex-row">
                    <h1 className="text-3xl font-bold mb-6">
                        Список <button className={isStudents ? "text-blue underline" : ""} onClick={onStudentClick}>
                        студентів
                    </button>/<button className={!isStudents ? "text-blue underline" : ""} onClick={onTeacherClick}>
                        викладачів
                    </button>
                    </h1>
                    <button className="left-[50px] relative btn btn-success text-center" onClick={onClickHandle}>Створити нового користувача</button>
                </div>
                {isStudents ? (
                    <div className="p-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                            {users.map(user => (
                                <Link to={`/admin/manage/users/student/${user.studentId}`} key={user.studentId}
                                      className="bg-white shadow-md rounded-lg p-4 no-underline text-black">
                                    <h2 className="text-xl font-semibold mb-1"><span className="text-sm">{user.studentId}</span> {fio(user)}</h2>
                                    <p className="text-gray-700"> {user.major.majorId} ({user.major.name})</p>
                                    <p className="text-gray-700">Курс: {user.yearOfStudy} Група: {user.groupName}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                            {users.map(user => (
                                <Link to={`/admin/manage/users/teacher/${user.teacherId}`} key={user.teacherId}
                                      className="bg-white shadow-md rounded-lg p-4 no-underline text-black">
                                    <h2 className="text-xl font-semibold mb-1"><span className="text-sm">{user.teacherId}</span> {fio(user)}</h2>
                                    <p className="text-gray-700"> {user.email}</p>
                                </Link>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}