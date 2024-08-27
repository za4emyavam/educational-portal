import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {retrieveAllStudyGroups} from "../../api/MemberApi";
import AdminManageComponent from "./AdminManageComponent";

export default function StudyGroupsComponent() {
    const [studyGroups, setStudyGroups] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigator = useNavigate()

    useEffect(() => {
        refreshStudyGroups()
    }, [])

    function refreshStudyGroups() {
        setIsLoading(true)
        Promise.all([
            retrieveAllStudyGroups()
        ])
            .then((responses) => {
                setStudyGroups(responses[0].data)
            })
            .finally(() => setIsLoading(false))
    }

    function onClickHandle() {
        navigator('/admin/manage/study_groups/study_group')
    }

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (!isLoading && studyGroups.length === 0) {
        return (
            <div>Доки нема навчальної групи</div>
        )
    }

    return (
        <div className="flex">
            <AdminManageComponent/>
            <div className="p-4">
                <div className="flex flex-row mb-[10px]">
                    <h1 className="text-3xl font-bold mb-6">Список навчальних груп</h1>
                    <button className="left-[50px] relative btn btn-success text-center"
                            onClick={onClickHandle}>Створити нову навчальну групу
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                    {studyGroups.map(studyGroup => (
                        <Link to={`/admin/manage/study_groups/study_group/${studyGroup.groupId}`} key={studyGroup.groupId}
                              className="bg-white shadow-md rounded-lg p-6 no-underline text-black">
                            <h2 className="text-xl font-semibold mb-1">Курс: {studyGroup.yearOfStudy} ({studyGroup.major.majorId} {studyGroup.major.name})<br/>
                                Група: {studyGroup.name}</h2>
                            <p className="text-gray-700">ID: {studyGroup.groupId}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}