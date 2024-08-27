import AdminManageComponent from "./AdminManageComponent";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {retrieveMajors} from "../../api/MemberApi";

export default function MajorsComponent() {
    const [isLoading, setIsLoading] = useState(true)
    const [majors, setMajors] = useState([])
    const navigator = useNavigate()

    useEffect(() => {
        refreshMajors()
    }, []);

    function refreshMajors() {
        setIsLoading(true)
        Promise.all([
            retrieveMajors()
        ])
            .then((responses) => setMajors(responses[0].data))
            .finally(() => setIsLoading(false))
    }

    function onClickHandle() {
        navigator('/admin/manage/majors/major')
    }

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (!isLoading && majors.length === 0) {
        return (
            <div>Доки нема жодної спеціальності</div>
        )
    }

    return (
        <div className="flex">
            <AdminManageComponent/>
            <div className="p-4">
                <div className="flex flex-row mb-[10px]">
                    <h1 className="text-3xl font-bold mb-6">Список спеціальностей</h1>
                    <button className="left-[50px] relative btn btn-success text-center" onClick={onClickHandle}>Додати нову спеціальність</button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                    {majors.map(major => (
                        <Link to={`/admin/manage/majors/major/${major.majorId}`} key={major.majorId}
                              className="bg-white shadow-md rounded-lg p-6 no-underline text-black">
                            <h2 className="text-xl font-semibold mb-1">{major.name} ({major.majorId})</h2>
                            <p className="text-gray-700">{major.facultyName}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    )
}