import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    retrieveFileContent,
    retrieveFilesMetaByTask, retrieveMessages,
    retrieveScoreByTask, retrieveStudentInSubject,
    retrieveStudentTaskFileMeta,
    retrieveSubject,
    retrieveTask, saveMessage, saveScore
} from "../../api/MemberApi";
import {formDate} from "../../js/formDate";
import {fio, fioByPersonalData} from "../../js/fio";
import fileIcon from "../../resourses/word.png";
import {ErrorMessage, Field, Form, Formik} from "formik";
import NoContentComponent from "../NoContentComponent";

export default function TeachStudentTaskComponent() {
    const {subjectId, taskId, studentId} = useParams()
    const [student, setStudent] = useState(null)
    const [subject, setSubject] = useState(null)
    const [task, setTask] = useState(null)
    const [score, setScore] = useState(null)
    const [files, setFiles] = useState([])
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingFile, setIsLoadingFile] = useState(false)
    const [studentFiles, setStudentFiles] = useState([])
    const [newScore, setNewScore] = useState('')

    useEffect(() => refreshTask, [])

    function refreshTask() {
        setIsLoading(true)
        Promise.all([
            retrieveScoreByTask(subjectId, taskId, studentId),
            retrieveSubject(subjectId),
            retrieveTask(taskId),
            retrieveFilesMetaByTask(taskId),
            retrieveStudentTaskFileMeta(studentId, taskId),
            retrieveStudentInSubject(studentId, subjectId),
            retrieveMessages(taskId, studentId)
        ])
            .then((responses) => {
                setScore(responses[0].data === "" ? null : responses[0].data)
                setSubject(responses[1].data)
                setTask(responses[2].data)
                setFiles(responses[3].data)
                setStudentFiles(responses[4].data)
                setStudent(responses[5].data)
                setMessages(responses[6].data)
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setIsLoading(false)
            })
    }

    const fetchFile = (file) => {
        setIsLoadingFile(true)
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
                setIsLoadingFile(false)
            )
    }

    function handleSubmit(values) {
        const score = {
            studentId: studentId,
            teacherId: localStorage.getItem("uid"),
            value: values.newScore
        }
        saveScore(subjectId, taskId,studentId, score)
            .then((response) => setScore(response.data))
    }

    function handleSendMessage(message) {
        Promise.all([
            saveMessage(taskId, studentId, {
                sender: localStorage.getItem("uid"),
                message: message
            })
        ])
            .then(() => refreshTask())
    }

    function validate(values) {
        let errors = {}

        if (!Number.isInteger(values.newScore) || values.newScore < 0 || values.newScore > task.gradedTask.maxScore) {
            errors.newScore = 'Введіть коректну оцінку'
        }

        return errors
    }

    if (isLoading) {
        return <div></div>;
    }

    if (!isLoading && (!subject || !student)) {
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
                    <div className="w-[932px] h-[383px] left-[400px] top-[52px] absolute">
                        {/*Task block*/}
                        <div
                            className="w-[932px] h-auto left-0 top-[79px] absolute rounded-xl border border-stone-200 bg-red-100">
                            <div
                                className="w-[882px] min-h-[100px] left-[19px] top-[11px] relative mb-[20px] text-black text-xl font-semibold font-['Nunito Sans'] leading-[27px]">
                                {task.description}
                            </div>

                            {/*Task files*/}
                            <div className="flex flex-wrap">
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

                        {/*Top div with title*/}

                        <div className="w-[800px] h-[120px] left-[81px] absolute">
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
                    </div>


                    {/*Bottom info score*/}
                    {(task.task === "LAB" || task.task === "MODULAR") ? (
                        <div>
                            <div
                                className="w-[387px] h-auto left-0 top-[321px] absolute rounded-[40px] shadow bg-blue-100">
                                <div className="h-auto mt-[97px] relative">
                                    <div className="w-[387px]">
                                        <div className="relative left-[20px] text-neutral-600 text-[20px] font-black font-['Nunito Sans'] leading-[29px]">
                                            {student.lastname} {student.firstname}
                                        </div>
                                        <div className="relative left-[20px] mb-[10px] text-neutral-600 text-[18px] font-bold font-['Nunito Sans'] leading-[29px]">
                                            група {student.groupName}({student.major.majorId} {student.major.name})
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div
                                            className="left-[20px] relative text-neutral-500 text-lg font-black font-['Nunito Sans'] leading-[29px]">
                                            {score !== null ? 'Оцінено' : (studentFiles.length === 0 ? 'Не здано' : 'Не оцінено')}
                                        </div>
                                        <div
                                            className="left-[220px] relative text-center text-neutral-500 text-2xl font-extrabold font-['Nunito Sans']">
                                            {score !== null ? score.scoreValue : '-'}/{task.gradedTask.maxScore}
                                        </div>
                                    </div>

                                    {studentFiles && studentFiles.map((file) => (
                                            <div key={file.fileId} className="w-[275px] left-[55px] relative hover:shadow-2xl rounded-[15px]">
                                                <StudentTaskFileComponent className="relative" fetchFile={fetchFile}
                                                                          file={file}/>
                                            </div>
                                        )
                                    )}

                                    {
                                        (localStorage.getItem("role") === "TEACHER") && (
                                            <div
                                                className="w-52 h-[63px] left-[85px] top-[30px] mb-[60px] relative justify-center items-center inline-flex">
                                                <Formik initialValues={{newScore}}
                                                        onSubmit={handleSubmit}
                                                        validate={validate}
                                                        validateOnBlur={false}
                                                        validateOnChange={false}>
                                                    {(props) => (
                                                        <Form>
                                                            <Field type="number"
                                                                   className="ml-[37px] w-[142px] h-[42px] bg-blue-50 text-[25px] font-semibold rounded text-center"
                                                                   name="newScore"
                                                                   placeholder="Оцінка"/>
                                                            <ErrorMessage name="newScore"
                                                                          component="div"
                                                                          className="relative h-[20px] mb-[4px] text-red-500 text-[18px] left-[12px] alert-warning"/>
                                                            <button type="submit" className="w-52 h-[57px] ml-[5px] mt-[10px] mb-[30px] relative hover:shadow-2xl rounded-[2px]">
                                                                <div
                                                                    className="w-[72.56px] h-[8.75px] left-[67.72px] top-[54.25px] absolute opacity-50 bg-blue-500 rounded-sm blur-[16.31px]"/>
                                                                <div
                                                                    className="w-52 h-[59.50px] left-0 top-0 absolute bg-blue-500 rounded-md"/>
                                                                <div
                                                                    className="w-[163px] left-[22px] top-[16px] absolute text-center text-white text-xl font-bold font-['Nunito Sans']">
                                                                    {score ? 'Змінити оцінку' : 'Оцінити роботу'}
                                                                </div>
                                                            </button>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                        )
                                    }
                                </div>
                                <div>
                                    <ChatWindow messages={messages} sendMessage={handleSendMessage}/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-[387px] h-auto left-0 top-[390px] absolute">
                            <ChatWindow messages={messages} sendMessage={handleSendMessage}/>
                        </div>
                    )}


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
                </div>
            </div>
            {isLoadingFile && (
                <div className="fixed bottom-0 right-0 p-2 bg-gray-300 rounded-1 text-white">
                    Завантаження файлу
                </div>
            )}
        </div>

    )
}

const TaskFileComponent = ({fetchFile, file}) => {
    const handleButtonClick = () => {
        fetchFile(file);
    };

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
    );
};

const StudentTaskFileComponent = ({fetchFile, file}) => {
    const handleButtonClick = () => {
        fetchFile(file)
    }

    return (
        <div className="w-[210px] h-[111px]" onClick={handleButtonClick}>
            <div className="w-[275px] h-[111px] mt-[10px] relative">
                <div
                    className="w-[275px] h-[111px] left-0 top-0 relative bg-white rounded-xl border border-stone-300"/>
                <div
                    className="w-[110px] h-[0px] left-[96px] top-[1px] absolute origin-top-left rotate-[89.48deg] border border-neutral-200"/>

                <div
                    className="w-[170px] left-[108px] top-[26px] absolute truncate text-black text-xl font-semibold font-['Nunito Sans'] leading-[27px]">
                    {file.filename}
                </div>
                <div
                    className="left-[108px] top-[56px] absolute text-black text-lg font-light font-['Nunito Sans'] leading-[27px]">{file.filetype.toUpperCase()}
                </div>
                <div
                    className="w-[95px] h-[95px] left-0 top-[7px] absolute justify-center items-center inline-flex">
                    <div className="w-[95px] h-[95px] relative">
                        <div
                            className="w-[95px] h-[95px] left-0 top-0 absolute opacity-0 bg-black"/>
                        <img className="w-[82px] h-[82px] left-[8px] top-[7.92px] absolute"
                             src={fileIcon} alt={file.filename}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

function ChatWindow ({messages, sendMessage}) {
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = (event) => {
        event.preventDefault()
        if (newMessage.trim()) {
            sendMessage(newMessage)
        }
    };

    function fioByPersonalData(name) {
        const patronymic = name.patronymic === null ? '' : name.patronymic.charAt(0) + '.'
        return name.firstname.charAt(0) + '.' + patronymic + name.lastname
    }

    return (
        <div className="flex flex-col h-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex-1 p-3 overflow-y-auto">
                {messages.map((message) => (
                    <div key={message.id} className="mb-3">
                        <div>
                            {message.sender == localStorage.getItem("uid") ? 'Ви' : fioByPersonalData(message)}
                            <span className="text-sm text-gray-700">
                                &nbsp;{formDate(message.sentDate)[0]}&nbsp;{formDate(message.sentDate)[1]}&nbsp;{formDate(message.sentDate)[2]}
                            </span>
                        </div>
                        <div className="bg-blue-500 text-white p-2 rounded-lg inline-block">
                            {message.message}
                        </div>
                    </div>
                ))}
            </div>
            {
                (localStorage.getItem("role") === "TEACHER") && (
                    <div className="border-t p-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Напишіть повідомлення"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                        >
                            Відправити
                        </button>
                    </div>
                )
            }
        </div>
    )
}