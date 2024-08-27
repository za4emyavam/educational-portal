import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    deleteTask,
    retrieveAllScoreByTask, retrieveAllStudentTaskFilesByTask,
    retrieveFileContent,
    retrieveFilesMetaByTask, retrieveStudentsByGroup,
    retrieveSubject,
    retrieveTask
} from "../../api/MemberApi";
import {formDate} from "../../js/formDate";
import {fio, fioByPersonalData} from "../../js/fio";
import fileIcon from "../../resourses/word.png";
import NoContentComponent from "../NoContentComponent";

export default function TeachTaskComponent() {
    const {subjectId, taskId} = useParams()
    const [subject, setSubject] = useState(null)
    const [task, setTask] = useState(null)
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFileLoading, setIsFileLoading] = useState(false)
    const navigator = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => refreshTask, [])

    function refreshTask() {
        setIsLoading(true)
        Promise.all([
            retrieveSubject(subjectId),
            retrieveTask(taskId),
            retrieveFilesMetaByTask(taskId)
        ])
            .then((response) => {
                setSubject(response[0].data)
                setTask(response[1].data)
                setFiles(response[2].data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
            .finally(() => setIsLoading(false))
    }

    const fetchFile = (file) => {
        setIsFileLoading(true)
        retrieveFileContent(file.fileId)
            .then(response => {
                const fileUrl = URL.createObjectURL(response.data)
                const downloadLink = document.createElement('a')
                downloadLink.href = fileUrl
                downloadLink.download = file.filename
                downloadLink.click();
            })
            .catch(error => {
                console.error('Failed to fetch file:', error)
            })
            .finally(() =>
                setIsFileLoading(false)
            )
    }

    const deleteTaskClick = (event) => {
        event.preventDefault();
        setIsModalOpen(true)
    }

    function handleDeleteConfirm() {
        setIsLoading(true)
        deleteTask(taskId)
            .then((reps) => navigator('/teach/courses/' + subjectId))
    }

    if (isLoading) {
        return <div></div>
    }

    if (!isLoading && !subject) {
        return <NoContentComponent/>
    }

    if (!isLoading && task && subject) {
        if (task.subjectId.subjectId != subjectId) {
            return <NoContentComponent/>
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-center items-center mt-10">
                <div className="w-[1332px] h-auto relative">
                    <div className="w-[932px] h-[383px] left-[400px] top-[52px] relative">
                        <div className="w-[800px] h-[120px] left-[81px] relative">
                            <div
                                className="w-[930px] h-[120px] -left-[81px] -top-[51px] rounded-tl-[5px] rounded-tr-[40px] rounded-bl-[5px] rounded-br-[40px] absolute bg-gray-100"/>
                            <div
                                className="w-[124px] h-[121px] left-[-143px] top-[-52px] absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-slate-400"/>
                            {(task.task === "LAB" || task.task === "MODULAR") && (
                                <div>
                                    <div
                                        className="w-[183px] h-[121px] left-[668px] top-[-52px] absolute bg-blue-400/opacity-40 rounded-tl-[5px] rounded-tr-[40px] rounded-bl-[5px] rounded-br-[40px] border border-stone-200 bg-blue-300"/>
                                    <div
                                        className="w-[150px] left-[700px] top-[-5px] absolute text-black text-[22px] font-bold font-['Nunito Sans'] leading-[27px]">До: {formDate(task.gradedTask.dateTo)[0]} {formDate(task.gradedTask.dateTo)[1]}
                                    </div>
                                </div>
                            )}
                            <div
                                className="left-[-81px] top-[-19px] absolute text-center text-black text-xl font-bold font-['Nunito Sans'] leading-[27px]">{formDate(task.createDate)[0]}<br/>{formDate(task.createDate)[1]}
                            </div>
                            <div
                                className="left-[15px] top-[-19px] absolute text-zinc-800 text-[28px] font-extrabold font-['Nunito Sans'] leading-[27px]">{task.title}
                            </div>
                            <div
                                className="w-[126px] h-[27px] left-[15px] top-[21px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">{fioByPersonalData(task.subjectId.mainTeacher.personalData)}<br/>
                            </div>
                        </div>
                        <div
                            className="w-[932px] h-auto left-0 -top-[30px] relative rounded-xl border border-stone-200 bg-red-100">
                            <div
                                className="w-[882px] min-h-[100px] left-[19px] top-[11px] relative mb-[20px] text-black text-xl font-semibold font-['Nunito Sans'] leading-[27px]">
                                {task.description}
                            </div>

                            {/*Task files*/}
                            <div className="flex flex-wrap relative">
                                {files && files.map((file) => (
                                    <div key={file.fileId}
                                         className="w-[275px] h-[111px] mb-[20px] ml-[20px] relative hover:shadow-2xl rounded-[15px]">
                                        <TaskFileComponent className="w-[275px] h-[111px] relative"
                                                           fetchFile={fetchFile}
                                                           file={file}/>
                                    </div>
                                ))}

                            </div>

                        </div>
                        {/*Bottom info score*/}
                        {(task.task === "LAB" || task.task === "MODULAR") && (
                            <div className="relative">
                                <StudentTasks subject={subject} taskId={taskId} maxScore={task.gradedTask.maxScore}/>
                            </div>
                        )}
                    </div>


                    {/*Block of Subject */}
                    <Link to={(localStorage.getItem("role") === "TEACHER") ? ('/teach/courses/' + subjectId) : ('/admin/courses/' + subjectId)}>
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
                    </Link>
                    {(localStorage.getItem("role") === "TEACHER") && (<form className="left-[65px] w-[250px] top-[30px] h-16 relative hover:shadow-2xl rounded-[25px]"
                                                                            onSubmit={deleteTaskClick}>
                        <div className="w-[250px] h-16 left-0 top-0 absolute bg-red-800 rounded-[25px] shadow"/>
                        <button type="submit"
                                className="w-[213px] h-[17px] left-[20px] top-[18px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">Видалити
                            завдання
                        </button>
                    </form>)

                    }


                    <DeleteConfirmationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                    />
                </div>
            </div>
        </div>

    )
}

const TaskFileComponent = ({fetchFile, file}) => {
    const handleButtonClick = () => {
        fetchFile(file);
    }

    return (
        <div onClick={handleButtonClick}>
            <div className="w-[275px] h-[111px] left-0 top-0 absolute bg-rose-50 rounded-xl border border-stone-300"/>
            <div
                className="w-[110px] h-[0px] left-[96px] top-[1px] absolute origin-top-left rotate-[89.48deg] border border-stone-300"></div>
            <div
                className="left-[108px] w-[170px] top-[26px] truncate absolute text-black text-xl font-semibold font-['Nunito Sans'] leading-[27px]">{file.filename}
            </div>
            <div
                className="left-[108px] top-[56px] absolute text-black text-lg font-light font-['Nunito Sans'] leading-[27px]">{file.filetype.toUpperCase()}
            </div>
            <div
                className="w-[95px] h-[95px] left-0 top-[7px] absolute justify-center items-center inline-flex">
                <div className="w-[95px] h-[95px] relative">
                    <div className="w-[95px] h-[95px] left-0 top-0 absolute opacity-0 bg-black"/>
                    <img className="w-[82px] h-[82px] left-[8px] top-[7.92px] absolute"
                         src={fileIcon} alt={file.filename}/>
                </div>
            </div>
        </div>
    )
}

const StudentTasks = ({subject, taskId, maxScore}) => {

    const [students, setStudents] = useState([])
    const [scores, setScores] = useState([])
    const [studFiles, setStudFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        refreshStudentList()
    }, []);

    function refreshStudentList() {
        setIsLoading(true);

        Promise.all([
            ...subject.groupsList.map((group) => {
                return retrieveStudentsByGroup(group.groupId)
                    .then((response) => response.data)
                    .catch((error) => {
                        return []; // Возвращаем пустой массив в случае ошибки
                    });
            }),
            retrieveAllScoreByTask(subject.subjectId, taskId)
                .then((response) => response.data)
                .catch((error) => {
                    return []; // Возвращаем пустой массив в случае ошибки
                }),
            retrieveAllStudentTaskFilesByTask(taskId)
                .then((response) => response.data)
                .catch((error) => {
                    return []; // Возвращаем пустой массив в случае ошибки
                })
        ])
            .then((responses) => {
                const studentsData = responses.slice(0, -2).flat()
                const scoreData = responses[responses.length - 2]
                const files = responses[responses.length - 1]
                setScores(scoreData)
                setStudFiles(files)
                const filteredStudents = studentsData.filter((student) =>
                    scoreData.find((score) => score.scoreId.studentId === student.studentId) ||
                    files.find((file) => file.studentId === student.studentId)
                )
                setStudents(filteredStudents)
            })
            .catch()
            .finally(() => {
                setIsLoading(false);
            });
    }

    if (isLoading)
        return (
            <div>Loading</div>
        )

    return (
        <div>
            {students.map((student) =>
                <Link key={student.studentId}
                      to={(localStorage.getItem("role") === "TEACHER") ? ('/teach/courses/' + subject.subjectId + '/task/' + taskId + '/student/' + student.studentId) : ('/admin/courses/' + subject.subjectId + '/task/' + taskId + '/student/' + student.studentId)}>
                    {scores.find((score) => score.scoreId.studentId === student.studentId) ? (
                        <div>
                            <div className="w-[916px] h-[93px] mt-[10px] position-relative">
                                <div
                                    className="w-[916px] h-[93px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-green-100"/>
                                <div
                                    className="w-[381px] h-[25px] left-[182px] top-[22px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px]">{student.lastname} {student.firstname} {student.patronymic}
                                </div>
                                <div
                                    className="w-[326px] h-[27px] left-[182px] top-[52px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                    <span>Оцінена {formDate(scores.find((score) => score.scoreId.studentId === student.studentId).evaluationDate)[0]} {formDate(scores.find((score) => score.scoreId.studentId === student.studentId).evaluationDate)[1]}</span>
                                </div>

                                <div
                                    className="w-[175px] h-[93px] left-0 top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-green-200"/>
                                <div
                                    className="left-[8px] top-[33px] absolute text-center text-black text-[22px] font-bold font-['Nunito Sans'] leading-[27px]">
                                    Оцінено: {scores.find((score) => score.scoreId.studentId === student.studentId).scoreValue}/{maxScore}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <div className="w-[916px] h-[93px] mt-[10px] position-relative">
                                    <div
                                        className="w-[916px] h-[93px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-red-100"/>
                                    <div
                                        className="w-[481px] h-[25px] left-[182px] top-[22px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px]">{student.lastname} {student.firstname} {student.patronymic}
                                    </div>
                                    <div
                                        className="w-[326px] h-[27px] left-[182px] top-[52px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                        <span>
                                            Файл(и) додані {formDate(studFiles.find((file) => file.studentId === student.studentId).uploadedDate)[0]} {formDate(studFiles.find((file) => file.studentId === student.studentId).uploadedDate)[1]}
                                        </span>
                                    </div>
                                    <div
                                        className="w-[175px] h-[93px] left-0 top-0 absolute  rounded-xl border border-stone-200 bg-red-200"/>
                                    <div
                                        className="left-[30px] top-[31px] absolute text-center text-black text-[22px] font-bold font-['Nunito Sans'] leading-[27px]">
                                        Не оцінено
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Link>
            )}
        </div>
    )
}

function DeleteConfirmationModal({isOpen, onClose, onConfirm}) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Підтвердження видалення</h2>
                        <p className="text-sm mb-4">Ви впевнені, що хочете видалити це завдання та пов'язані з ним бали
                            та файли?</p>
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
                </div>
            )}
        </>
    );
}


