import {useEffect, useState} from "react";
import {retrieveRenewInfoByTeacher} from "../../api/MemberApi";
import {Link} from "react-router-dom";
import {formDate} from "../../js/formDate";

export default function TeachRenewComponent() {
    const [renews, setRenews] = useState([])

    useEffect(() => {
        refreshRenews()
    }, []);

    function refreshRenews() {
        Promise.all([
            retrieveRenewInfoByTeacher(localStorage.getItem("uid"))
        ])
            .then((responses) =>
                setRenews(responses[0].data)
            )
    }

    return (
        <div className="flex flex-column justify-center items-center mt-10">
            <div className="relative text-[20px] font-semibold font-['Nunito Sans'] leading-[27px]">
                Оновлення за всі курси
            </div>
            {renews.map((renew) =>
                (
                    <Link key={renew.taskId + '_' + renew.studentId}
                          to={`/teach/courses/${renew.subjectId}/task/${renew.taskId}/student/${renew.studentId}`}>
                        {renew.scoreDTO ? (
                            <div className="w-[916px] h-[103px] mt-[10px] position-relative">
                                <div
                                    className="w-[916px] h-[103px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-green-100"/>
                                <div
                                    className="w-[581px] h-[25px] left-[182px] top-[12px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                                    {renew.studentSurname} {renew.studentFirstname} {renew.studentPatronymic}
                                    <span
                                        className="ml-[10px] text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                        {renew.type === "TASK" ? "прикріпив(-ла) відповідь" : "додав коментар"}
                                </span>
                                </div>
                                <div
                                    className="w-[326px] h-[27px] left-[182px] top-[40px] absolute text-black text-lg font-bold font-['Nunito Sans'] leading-[27px]">
                                    {renew.subjectName}
                                </div>
                                <div
                                    className="w-[326px] h-[27px] left-[182px] top-[68px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                    {renew.taskTitle}
                                </div>
                                <div
                                    className="w-[155px] h-[103px] left-0 top-0 absolute  rounded-xl border border-stone-200 bg-green-200"/>
                                <div
                                    className="w-[80px] left-[37px] top-[25px] absolute text-center text-black text-[22px] font-bold font-['Nunito Sans'] leading-[27px]">
                                    {formDate(renew.lastUpdated)[2]} {formDate(renew.lastUpdated)[0]} {formDate(renew.lastUpdated)[1]}
                                </div>
                                <div
                                    className="w-[159px] h-[103px] left-[757px] top-0 absolute rounded-xl border border-stone-200 bg-green-200"/>
                                <div
                                    className="left-[773px] top-[38px] absolute text-black text-lg font-bold font-['Nunito Sans'] leading-[27px]">
                                    Оцінено: {renew.scoreDTO.value}/{renew.maxScore}
                                </div>
                            </div>
                        ) : (
                            <div className="w-[916px] h-[103px] mt-[10px] position-relative">
                                <div
                                    className="w-[916px] h-[103px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-red-100"/>
                                <div
                                    className="w-[581px] h-[25px] left-[182px] top-[12px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                                    {renew.studentSurname} {renew.studentFirstname} {renew.studentPatronymic}
                                    <span
                                        className="ml-[10px] text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                        {renew.type === "TASK" ? "прикріпив(-ла) відповідь": "додав коментар"}

                                </span>
                                </div>
                                <div
                                    className="w-[326px] h-[27px] left-[182px] top-[40px] absolute text-black text-lg font-bold font-['Nunito Sans'] leading-[27px]">
                                    {renew.subjectName}
                                </div>
                                <div
                                    className="w-[326px] h-[27px] left-[182px] top-[68px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                    {renew.taskTitle}
                                </div>
                                <div
                                    className="w-[155px] h-[103px] left-0 top-0 absolute  rounded-xl border border-stone-200 bg-red-200"/>
                                <div
                                    className="w-[80px] left-[37px] top-[25px] absolute text-center text-black text-[22px] font-bold font-['Nunito Sans'] leading-[27px]">
                                    {formDate(renew.lastUpdated)[2]} {formDate(renew.lastUpdated)[0]} {formDate(renew.lastUpdated)[1]}
                                </div>
                                <div
                                    className="w-[159px] h-[103px] left-[757px] top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-red-200"/>
                                <div
                                    className="left-[784px] top-[38px] absolute text-black text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px]">
                                    Не оцінено
                                </div>
                            </div>
                        )}
                    </Link>
                )
            )}
        </div>
    )
}