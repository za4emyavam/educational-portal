import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {retrieveScoreByStudentInSubject, retrieveSubject, retrieveTasksBySubject} from "../../api/MemberApi";
import {fio, fioByPersonalData} from "../../js/fio";
import {formDate} from "../../js/formDate";
import getDefRoutes from "../../js/getDefRoutes";
import NoContentComponent from "../NoContentComponent";

export default function SubjectComponent() {
    const {subjectId} = useParams()
    const [subject, setSubject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [isTask, setIsTask] = useState(true)
    const [scores, setScores] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigator = useNavigate()

    useEffect(() => refreshSubject, []);

    function refreshSubject() {
        Promise.all([
            retrieveSubject(subjectId),
            retrieveTasksBySubject(subjectId),
            retrieveScoreByStudentInSubject(subjectId, localStorage.getItem("uid"))
        ])
            .then((responses) => {
                if (responses[0].data === null)
                    navigator(getDefRoutes())
                setSubject(responses[0].data)
                setTasks(responses[1].data)
                setScores(responses[2].data)
                })
            .catch((error) => {
                    console.log(error)
            })
            .finally(() => setIsLoading(false))
    }


    if (isLoading) {
        return <div></div>
    }

    if (!isLoading && !subject) {
        return <NoContentComponent/>
    }

    function handleTaskClick() {
        setIsTask(true)
    }

    function handleInfoClick() {
        setIsTask(false)
    }

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-[1332px] h-[449px] relative">
                <div className="w-[1024px] h-[121px] left-[308px] top-0 absolute bg-gray-200 rounded-5">
                    <div
                        className="w-[377px] h-[35px] pr-[17px] pb-px left-[293px] top-[43px] absolute justify-start items-start gap-[63px] inline-flex">
                        <div className="text-black text-[25px] font-['Nunito Sans'] hover:text-blue-500">
                            <p className={isTask ? "font-extrabold hover:text-blue-500" : "font-bold hover:text-blue-500"}
                               onClick={handleTaskClick}>Завдання</p>
                        </div>
                        <div className="text-black text-[25px] font-['Nunito Sans'] hover:text-blue-500">
                            <p className={!isTask ? "font-extrabold hover:text-blue-500" : "font-bold hover:text-blue-500"}
                               onClick={handleInfoClick}>Повідомлення</p>
                        </div>
                    </div>
                </div>

                <div className="w-[386.65px] h-[397px] left-0 top-0 absolute">
                    <div className="w-[386.65px] h-[397px] left-0 top-0 absolute">
                        <div
                            className="w-[386.65px] h-[397px] left-0 top-0 absolute bg-blue-100 rounded-[40px] shadow"/>
                        <div className="w-[386.65px] h-[397px] left-0 top-0 absolute">
                            <div
                                className="w-[386.65px] h-[397px] left-0 top-0 absolute bg-stone-600 rounded-[40px] shadow"/>
                            <div className="w-[427.16px] h-[397.86px] left-[-20.71px] top-0 absolute"/>
                        </div>
                        <div
                            className="w-[386.65px] h-[397px] left-0 top-0 absolute opacity-10 bg-slate-900 rounded-[40px] shadow"/>
                        <div
                            className="w-[386.65px] h-[397px] left-0 top-0 absolute bg-slate-900 rounded-[40px] shadow"/>
                    </div>
                    <div
                        className="w-[243.96px] h-[41.25px] left-[71.35px] top-[177.88px] absolute text-center text-white text-[37px] font-black font-['Nunito Sans'] leading-[48px]">{subject.name}</div>
                    <div
                        className="w-[174px] h-[17px] left-[21px] top-[35px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">{fio(subject)}</div>
                </div>

                <div className="left-[400px] top-[120px] absolute">
                    {isTask ? <LabTasks tasks={tasks} scores={scores}/> : <InfoTasks tasks={tasks}/>}
                </div>
            </div>
        </div>
    )
}

function LabTasks({tasks, scores}) {
    return (
        <div>
            {tasks.map((task) =>
                ((task.task === "LAB" || task.task === "MODULAR") && (
                    <Link key={task.taskId} to={'/stud/courses/' + task.subjectId.subjectId + '/task/' + task.taskId}>
                        <div>
                            {scores.some(score => score.scoreId.taskId === task.taskId) ? (
                                <div className="w-[916px] h-[93px] mt-[10px] position-relative">

                                    <div
                                        className="w-[916px] h-[93px] left-0 top-0 absolute bg-red-200/opacity-30 rounded-xl border border-stone-200 bg-green-100"/>
                                    <div
                                        className="w-[159px] h-[93px] left-[757px] top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-green-200"/>
                                    <div
                                        className="w-[381px] h-[25px] left-[82px] top-[22px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px]">{task.title}
                                    </div>
                                    <div
                                        className="w-[126px] h-[27px] left-[82px] top-[52px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                        {fioByPersonalData(task.subjectId.mainTeacher.personalData)}<br/>
                                    </div>
                                    <div
                                        className="left-[773px] top-[33px] absolute text-black text-lg font-bold font-['Nunito Sans'] leading-[27px]">
                                        Оцінено: {scores.find((score) => score.scoreId.taskId === task.taskId).scoreValue}/{task.gradedTask.maxScore}
                                    </div>
                                    <div
                                        className="w-[62px] h-[93px] left-0 top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-green-200"/>
                                    <div
                                        className="left-[16px] top-[22px] absolute text-center text-black text-base font-bold font-['Nunito Sans'] leading-[27px]">
                                        {formDate(task.createDate)[0]}<br/>{formDate(task.createDate)[1]}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-[916px] h-[93px] mt-[10px] position-relative">
                                    <div
                                        className="w-[916px] h-[93px] left-0 top-0 absolute bg-red-200/opacity-30 rounded-xl border border-stone-200 bg-red-100"/>
                                    <div
                                        className="w-[159px] h-[93px] left-[757px] top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-red-200"/>

                                    <div
                                        className="w-[381px] h-[25px] left-[82px] top-[22px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px]">{task.title}
                                    </div>
                                    <div
                                        className="w-[126px] h-[27px] left-[82px] top-[52px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                        {fioByPersonalData(task.subjectId.mainTeacher.personalData)}<br/>
                                    </div>
                                    <div
                                        className="left-[792px] top-[33px] absolute text-black text-lg font-bold font-['Nunito Sans'] leading-[27px]">До:&nbsp;
                                        <span
                                            className="text-black text-lg font-extrabold font-['Nunito Sans'] leading-[27px]">
                                        {formDate(task.gradedTask.dateTo)[0]} {formDate(task.gradedTask.dateTo)[1]}
                                    </span>
                                    </div>
                                    <div
                                        className="w-[62px] h-[93px] left-0 top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-red-200"/>
                                    <div
                                        className="left-[17px] top-[22px] absolute text-center text-black text-base font-bold font-['Nunito Sans'] leading-[27px]">
                                        {formDate(task.createDate)[0]}<br/>{formDate(task.createDate)[1]}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>
                ))
            )}
        </div>
    )
}

function InfoTasks(tasks) {
    return (
        <div>
            {tasks.tasks.map((task) =>
                (task.task === "INFO" && (
                    <Link key={task.taskId} to={'/stud/courses/' + task.subjectId.subjectId + '/task/' + task.taskId}>
                        <div className="w-[916px] h-[93px] mt-[10px] position-relative ">
                            <div
                                className="w-[916px] h-[93px] left-0 top-0 absolute bg-red-200/opacity-30 rounded-xl border border-stone-200 bg-green-100"/>
                            <div
                                className="w-[381px] h-[25px] left-[82px] top-[22px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px]">{task.title}
                            </div>
                            <div
                                className="w-[126px] h-[27px] left-[82px] top-[52px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                {fioByPersonalData(task.subjectId.mainTeacher.personalData)}<br/>
                            </div>
                            <div
                                className="w-[62px] h-[93px] left-0 top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-green-200"/>
                            <div
                                className="left-[16px] top-[22px] absolute text-center text-black text-base font-bold font-['Nunito Sans'] leading-[27px]">
                                {formDate(task.createDate)[0]}<br/>{formDate(task.createDate)[1]}
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    )
}