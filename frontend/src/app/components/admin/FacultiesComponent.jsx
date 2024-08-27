import {useEffect, useState} from "react";
import {retrieveAllFaculties} from "../../api/MemberApi";
import {Link, useNavigate} from "react-router-dom";
import AdminManageComponent from "./AdminManageComponent";

export function FacultiesComponent() {
    const [faculties, setFaculties] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigator = useNavigate()

    useEffect(() => {
        refreshFaculties()
    }, [])

    function refreshFaculties() {
        setIsLoading(true)
        Promise.all([
            retrieveAllFaculties()
        ])
            .then((responses) => {
                setFaculties(responses[0].data)
            })
            .finally(() => setIsLoading(false))
    }

    function onClickHandle() {
        navigator('/admin/manage/faculties/faculty')
    }

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (!isLoading && faculties.length === 0) {
        return (
            <div>Доки нема жодного факультету</div>
        )
    }

    return (
        <div className="flex">
            <AdminManageComponent/>
            <div className="p-4">
                <div className="flex flex-row mb-[10px]">
                    <h1 className="text-3xl font-bold mb-6">Список факультетів</h1>
                    <button className="left-[50px] relative btn btn-success text-center" onClick={onClickHandle}>Створити новий факультет</button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                    {faculties.map(faculty => (
                        <Link to={`/admin/manage/faculties/faculty/${faculty.facultyId}`} key={faculty.facultyId}
                              className="bg-white shadow-md rounded-lg p-6 no-underline text-black">
                            <h2 className="text-xl font-semibold mb-1">{faculty.name}</h2>
                            <p className="text-gray-700">ID: {faculty.facultyId}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    )
}