import {useEffect, useState} from "react";
import {
    retrieveAllFilesByStudent,
    retrieveAllScoresByStudent,
    retrieveAllTaskByStudentWithPag
} from "../../api/MemberApi";
import {fioByPersonalData} from "../../js/fio";
import {formDate} from "../../js/formDate";
import {useNavigate} from "react-router-dom";

export default function TasksComponent() {
    const [tasks, setTasks] = useState([])
    const [scores, setScores] = useState([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [sort, setSort] = useState("createDate")
    const [direction, setDirection] = useState("desc")
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => refreshTasks(), [page, sort, direction]);

    function refreshTasks() {
        setIsLoading(true)
        Promise.all([
            retrieveAllScoresByStudent(localStorage.getItem("uid")),
            retrieveAllTaskByStudentWithPag(localStorage.getItem("uid"), page, 5, sort, direction),
            retrieveAllFilesByStudent(localStorage.getItem("uid"))
        ])
            .then((responses) => {
                setScores(responses[0].data)
                setTasks(responses[1].data.content)
                setTotalPages(responses[2].data.totalPages)
                setFiles(responses[3].data)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => setIsLoading(false))

    }

    const handleNextPage = () => {
        setPage(prevPage => Math.min(prevPage + 1, totalPages - 1)); // Увеличение номера страницы на 1, но не больше общего количества страниц
    }

    const handlePrevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 0)); // Уменьшение номера страницы на 1, но не меньше 0
    }

    const subjectNameSortHandle = () => {
        if (sort === "subjectId.name") {
            setDirection(direction === "desc" ? "asc" : "desc")
        }
        else {
            setSort("subjectId.name")
            setDirection("asc")
        }
    }

    const taskNameSortHandle = () => {
        if (sort === "title") {
            setDirection(direction === "desc" ? "asc" : "desc")
        }
        else {
            setSort("title")
            setDirection("asc")
        }
    }

    const mainTeacherSortHandle = () => {
        if (sort === "subjectId.mainTeacher") {
            setDirection(direction === "desc" ? "asc" : "desc")
        }
        else {
            setSort("subjectId.mainTeacher")
            setDirection("asc")
        }
    }

    const createDateSortHandle = () => {
        if (sort === "createData") {
            setDirection(direction === "desc" ? "asc" : "desc")
        }
        else {
            setSort("createData")
            setDirection("asc")
        }
    }

    const taskTypeSortHandle = () => {
        if (sort === "task") {
            setDirection(direction === "desc" ? "asc" : "desc")
        }
        else {
            setSort("task")
            setDirection("asc")
        }
    }

    const dateToSortHandle = () => {
        if (sort === "gradedTask.dateTo") {
            setDirection(direction === "desc" ? "asc" : "desc")
        } else {
            setSort("gradedTask.dateTo")
            setDirection("asc")
        }
    }

    if (isLoading) {
        return <div></div>
    }

    return (
        <div className="flex flex-col justify-center items-center mt-10">
            <div className="w-[1263px] h-auto relative bg-white rounded-[14px] border border-zinc-400">
                <div className="w-[1263px] h-[49px] left-0 top-0 relative">
                    <div
                        className="w-[1261px] h-[49px] left-0 top-0 absolute bg-neutral-50 rounded-tl-[14px] border border-neutral-300 rounded-tr-[14px] "/>
                    <button className="w-[80px] h-[20px] left-[31px] top-[15px] absolute text-sm hover:text-[20px]" onClick={subjectNameSortHandle}>
                        <div
                            className="opacity-90 text-neutral-800 font-extrabold font-['Nunito Sans']">Предмет
                        </div>
                    </button>
                    <button className="w-[75.33px] left-[176px] top-[15px] absolute text-sm hover:text-[20px]" onClick={taskNameSortHandle}>
                        <div
                            className=" opacity-90 text-neutral-800 font-extrabold font-['Nunito Sans']">Завдання
                        </div>
                    </button>
                    <button className="w-[76.44px] left-[431px] top-[15px] absolute text-sm hover:text-[20px]" onClick={mainTeacherSortHandle}>
                        <div
                            className="opacity-90 text-neutral-800 font-extrabold font-['Nunito Sans']">Викладач
                        </div>
                    </button>
                    <button className="w-[162.97px] left-[575px] top-[15px] absolute text-sm hover:text-[20px]" onClick={createDateSortHandle}>
                        <div
                            className="opacity-90 text-neutral-800 font-extrabold font-['Nunito Sans']">Дата
                            створення
                        </div>
                    </button>
                    <button className="w-[28.80px] left-[790px] top-[15px] absolute text-sm hover:text-[20px]" onClick={taskTypeSortHandle}>
                        <div
                            className="opacity-90 text-neutral-800 font-extrabold font-['Nunito Sans']">Тип
                        </div>
                    </button>
                    <div
                        className="w-[50.96px] left-[1070px] top-[15px] absolute text-sm opacity-90 text-neutral-800 font-extrabold font-['Nunito Sans']">Статус
                    </div>
                    <button className="w-[120px] left-[855px] top-[15px] absolute text-sm hover:text-[20px]" onClick={dateToSortHandle}>
                        <div
                            className="opacity-90 text-neutral-800 font-extrabold font-['Nunito Sans']">Дата
                            здачі
                        </div>
                    </button>
                </div>
                <TaskListComponent className="top-0 relative" tasks={tasks} scores={scores} files={files}/>
            </div>
            {totalPages > 1 && (
                <div className="left-[570px] relative mt-10">
                    <button className="btn btn-success" onClick={handlePrevPage} disabled={page === 0}>&lt;</button>
                    <button className="btn btn-success ml-2" onClick={handleNextPage} disabled={page === totalPages - 1}>&gt;</button>
                </div>
            )}
        </div>
    )
}

function TaskListComponent({tasks, scores, files}) {
    const navigator = useNavigate()

    return (
        <div className="-top-1.5 relative">
            {tasks.map((task) =>
                (
                    (task.task === "LAB" || task.task === "MODULAR") && (
                        <div key={task.taskId} className="w-[1263px] h-[63px] left-0 mt-[20px] relative">
                            <div className="w-[1262px] h-[1px] -top-[15px] absolute bg-zinc-300"/>
                            <div
                                className="left-[32px] top-[15px] absolute opacity-90 text-neutral-800 text-sm font-semibold font-['Nunito Sans']">
                                {task.subjectId.name}
                            </div>
                            <div
                                className="left-[176px] top-[15px] absolute opacity-90 text-neutral-800 text-sm font-semibold font-['Nunito Sans']">
                                {task.title}
                            </div>
                            <div
                                className="left-[431px] top-[15px] absolute opacity-90 text-neutral-800 text-sm font-semibold font-['Nunito Sans']">
                                {fioByPersonalData(task.subjectId.mainTeacher.personalData)}
                            </div>
                            <div
                                className="left-[627px] top-[15px] absolute opacity-90 text-neutral-800 text-sm font-semibold font-['Nunito Sans']">
                                {formDate(task.createDate)[0]} {formDate(task.createDate)[1]}
                            </div>
                            <div
                                className="left-[893px] top-[15px] absolute opacity-90 text-neutral-800 text-sm font-semibold font-['Nunito Sans']">
                                {formDate(task.gradedTask.dateTo)[0]} {formDate(task.gradedTask.dateTo)[1]}
                            </div>
                            <div
                                className="left-[790px] top-[15px] absolute opacity-90 text-neutral-800 text-sm font-semibold font-['Nunito Sans']">
                                {task.task === "LAB" ? "Лаб" : "Мод"}
                            </div>
                            <button onClick={() => navigator(`/stud/courses/${task.subjectId.subjectId}/task/${task.taskId}`)}>
                                {scores.some(score => score.scoreId.taskId === task.taskId) ? (
                                    <div className="w-[150px] h-[50px] left-[1026px] top-0 absolute">
                                        <div className="w-[150px] h-[50px] left-0 top-0 absolute opacity-20 bg-teal-500 rounded" />
                                        <div className="left-[20px] top-[15px] absolute text-teal-500 text-[15px] font-bold font-['Nunito Sans']">Оцінено: </div>
                                        <div className="left-[94px] top-[15px] absolute text-teal-500 text-[15px] font-extrabold font-['Nunito Sans']">
                                            {scores.find((score) => score.scoreId.taskId === task.taskId).scoreValue}/{task.gradedTask.maxScore}
                                        </div>
                                    </div>
                                ) : (
                                    files.some(file => file.taskId === task.taskId) ? (
                                        <div>
                                            <div
                                                className="w-[150px] h-[50px] left-[1026px] top-0 absolute bg-white justify-center items-center inline-flex">
                                                <div className="w-[150px] h-[50px] relative">
                                                    <div
                                                        className="w-[150px] h-[50px] left-0 top-0 absolute opacity-20 bg-violet-700 rounded"/>
                                                    <div
                                                        className="left-[37px] top-[15px] absolute text-center text-violet-700 text-[15px] font-bold font-['Nunito Sans']">
                                                        Не оцінено
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div
                                                className="w-[150px] h-[50px] left-[1026px] top-0 absolute bg-white justify-center items-center inline-flex">
                                                <div className="w-[150px] h-[50px] relative">
                                                    <div
                                                        className="w-[150px] h-[50px] left-0 top-0 absolute opacity-20 bg-red-600 rounded"/>
                                                    <div
                                                        className="left-[41px] top-[15px] absolute text-center text-red-600 text-[15px] font-bold font-['Nunito Sans']">Не
                                                        здано
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                )}
                            </button>


                        </div>
                    )
                )
            )}
        </div>
    )
}