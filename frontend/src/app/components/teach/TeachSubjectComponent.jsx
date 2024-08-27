import {fio, fioByPersonalData} from "../../js/fio";
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {formDate} from "../../js/formDate";
import {
    retrieveRenewInfoBySubject,
    retrieveStudentsByGroup,
    retrieveSubject,
    retrieveTasksBySubject,
    saveInfoTask,
    saveLabTask,
    uploadTaskFileContent
} from "../../api/MemberApi";
import {Field, Form, Formik} from "formik";
import NoContentComponent from "../NoContentComponent";

export default function TeachSubjectComponent() {
    const [pageStatus, setPageStatus] = useState('task')
    const {subjectId} = useParams()
    const [subject, setSubject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => refreshSubject, []);

    function refreshSubject() {
        setIsLoading(true)
        Promise.all([
            retrieveSubject(subjectId),
            retrieveTasksBySubject(subjectId)
        ])
            .then((responses) => {
                setSubject(responses[0].data)
                setTasks(responses[1].data)
            })
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false))
    }


    if (isLoading) {
        return <div></div>
    }

    if (!isLoading && !subject) {
        return <NoContentComponent/>
    }

    function handleTaskClick() {
        setPageStatus('task')
    }

    function handleInfoClick() {
        setPageStatus('info')
    }

    function handleStudClick() {
        setPageStatus('stud')
    }

    function handleRenewClick() {
        setPageStatus('renew')
    }

    function handleCreateClick() {
        setPageStatus('create')
    }

    function getUniqueValues(list) {
        const uniqueValues = new Set();
        list.forEach(item => {
            uniqueValues.add(item.yearOfStudy);
        });
        return Array.from(uniqueValues);
    }

    const addTask = (newTask) => {
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-[1332px] h-[449px] relative">
                <div className="w-[1124px] h-[121px] left-[190px] top-0 absolute bg-gray-200 rounded-5">
                    <div
                        className="w-[677px] h-[35px] pr-[17px] pb-px left-[293px] top-[43px] absolute justify-start items-start gap-[39px] inline-flex">
                        <div className="text-black text-[25px] font-['Nunito Sans'] hover:text-blue-500">
                            <p className={pageStatus === 'task' ? "font-extrabold hover:text-blue-500" : "font-bold hover:text-blue-500"}
                               onClick={handleTaskClick}>Завдання</p>
                        </div>
                        <div className="text-black text-[25px] font-['Nunito Sans'] hover:text-blue-500">
                            <p className={pageStatus === 'info' ? "font-extrabold hover:text-blue-500" : "font-bold hover:text-blue-500"}
                               onClick={handleInfoClick}>Повідомлення</p>
                        </div>
                        <div className="text-black text-[25px] font-['Nunito Sans'] hover:text-blue-500">
                            <p className={pageStatus === 'stud' ? "font-extrabold hover:text-blue-500" : "font-bold hover:text-blue-500"}
                               onClick={handleStudClick}>Студенти</p>
                        </div>
                        <div className="text-black text-[25px] font-['Nunito Sans'] hover:text-blue-500">
                            <p className={pageStatus === 'renew' ? "font-extrabold hover:text-blue-500" : "font-bold hover:text-blue-500"}
                               onClick={handleRenewClick}>Оновлення</p>
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
                    <div
                        className="w-[103px] h-[17px] left-[25px] top-[300px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">
                        {subject.groupsList.length === 1 ? ('Курс: ' + subject.groupsList[0].yearOfStudy) : ('Курси:' + getUniqueValues(subject.groupsList).map((item) => ' ' + item))}
                    </div>
                    <div
                        className="w-[303px] h-[17px] left-[25px] top-[330px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">
                        {subject.groupsList.length === 1 ?
                            ('Група: ' + subject.groupsList[0].groupName + '(' + subject.groupsList[0].major.majorId + ' ' + subject.groupsList[0].major.name + ')')
                            :
                            ('Групи:' + subject.groupsList.map((group) =>
                                ' ' + group.groupName + '(' + group.major.majorId + ' ' + group.major.name + ')'
                            ))
                        }
                    </div>
                </div>
                {((localStorage.getItem("role") === "TEACHER") && (pageStatus === 'task' || pageStatus === 'info')) &&
                    <div className="w-[250px] left-[65px] top-[420px] relative">
                        <div className="w-[250px] h-16 relative hover:shadow-2xl rounded-[25px]"
                             onClick={handleCreateClick}>
                            <div className="w-[250px] h-16 left-0 top-0 absolute bg-lime-600 rounded-[25px] shadow"/>
                            <div
                                className="w-[190px] h-[17px] left-[30px] top-[18px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">Створити
                                завдання
                            </div>
                        </div>
                    </div>
                }


                <div className="left-[400px] top-[120px] absolute">
                    {pageStatus === 'task' ? <LabTasks tasks={tasks}/> : (
                        pageStatus === 'info' ? <InfoTasks tasks={tasks}/> : (
                            pageStatus === 'create' ?
                                <CreateTask subjectId={subjectId} setPageStatus={setPageStatus} addTask={addTask}/> : (
                                    pageStatus === 'stud' ?
                                        <StudContent subject={subject}/> : (
                                            <RenewComponent subjectId={subjectId}/>
                                        )
                                )
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

function LabTasks({tasks}) {
    return (
        <div>
            {tasks.map((task) =>
                ((task.task === "LAB" || task.task === "MODULAR") && (
                    <Link key={task.taskId} to={(localStorage.getItem("role") === "TEACHER") ? ('/teach/courses/' + task.subjectId.subjectId + '/task/' + task.taskId) : ('/admin/courses/' + task.subjectId.subjectId + '/task/' + task.taskId)}>
                        <div>

                            <div className="w-[916px] h-[93px] mt-[10px] position-relative">
                                <div
                                    className="w-[916px] h-[93px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-green-100"/>
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
                                    className="left-[792px] top-[33px] absolute text-black text-lg font-bold font-['Nunito Sans'] leading-[27px]">
                                    До:&nbsp;
                                    <span
                                        className="text-black text-lg font-extrabold font-['Nunito Sans'] leading-[27px]">
                                         {formDate(task.gradedTask.dateTo)[0]} {formDate(task.gradedTask.dateTo)[1]}
                                    </span>
                                </div>
                                <div
                                    className="w-[62px] h-[93px] left-0 top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-green-200"/>
                                <div
                                    className="left-[16px] top-[22px] absolute text-center text-black text-base font-bold font-['Nunito Sans'] leading-[27px]">
                                    {formDate(task.createDate)[0]}<br/>{formDate(task.createDate)[1]}
                                </div>
                            </div>

                        </div>
                    </Link>
                ))
            )}
        </div>
    )
}

function InfoTasks({tasks}) {
    return (
        <div>
            {tasks.map((task) =>
                (task.task === "INFO" && (
                    <Link key={task.taskId} to={(localStorage.getItem("role") === "TEACHER") ? ('/teach/courses/' + task.subjectId.subjectId + '/task/' + task.taskId) : ('/admin/courses/' + task.subjectId.subjectId + '/task/' + task.taskId)}>
                        <div className="w-[916px] h-[93px] mt-[10px] position-relative ">
                            <div
                                className="w-[916px] h-[93px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-green-100"/>
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
                                className="left-[18px] top-[22px] absolute text-center text-black text-base font-bold font-['Nunito Sans'] leading-[27px]">
                                {formDate(task.createDate)[0]}<br/>{formDate(task.createDate)[1]}
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    )
}

function CreateTask({subjectId, setPageStatus, addTask}) {
    const [type, setType] = useState('LAB')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState([])
    const [maxScore, setMaxScore] = useState(0)
    const [targetDate, setTargetDate] = useState('')

    function handleTaskClick() {
        setType('LAB')
    }

    function handleInfoClick() {
        setType('INFO')
    }

    function handleModClick() {
        setType('MODULAR')
    }

    function onSubmit(values) {
        if (type === 'LAB' || type === 'MODULAR') {
            const task = {
                subjectId: subjectId,
                type: type,
                title: values.title,
                description: values.description,
                maxScore: values.maxScore,
                dateTo: values.targetDate
            }
            createLabTask(task)
        } else {

            const task = {
                subjectId: subjectId,
                title: values.title,
                description: values.description
            }
            createInfoTask(task)
        }
    }

    function createInfoTask(task) {
        saveInfoTask(subjectId, task)
            .then((response) => {
                if (files.length !== 0) {
                    for (let i = 0; i < files.length; i++) {
                        const formData = new FormData();
                        formData.append('file', files[i]);

                        uploadTaskFileContent(response.data.taskId, formData)
                            .then((rr) => {

                            })
                            .catch((error) => console.error(error))
                    }
                }
                addTask(response.data)
                setPageStatus('task')
            })

            .catch((error) => console.log(error))
    }

    function createLabTask(task) {
        saveLabTask(subjectId, task)
            .then((response) => {
                if (files.length !== 0) {
                    for (let i = 0; i < files.length; i++) {
                        const formData = new FormData();
                        formData.append('file', files[i]);

                        uploadTaskFileContent(response.data.taskId, formData)
                            .then((rr) => {

                            })
                            .catch((error) => console.error(error))
                    }
                }
                addTask(response.data)
                setPageStatus('task')
            })
            .catch((error) => console.log(error))
    }

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    return (
        <div>
            <div className="w-[934px] h-[577px] relative">
                <Formik initialValues={{title, description, maxScore, targetDate}}
                        onSubmit={onSubmit}>
                    {
                        (props) => (
                            <Form>
                                <div className="h-[50px] top-[10px] relative">
                                    <div
                                        className="left-[12px] top-0 relative text-black text-[27px] font-bold font-['Nunito Sans']">
                                        Створення нового завдання:
                                    </div>
                                </div>
                                <div className="top-[10px] relative">
                                    <div className="inline-flex gap-[30px] relative">
                                        <div
                                            className="left-[12px] top-0 relative text-black text-[23px] font-bold font-['Nunito Sans']">Тип:
                                        </div>
                                        <div
                                            className="left-[12px] top-0 relative text-[23px] font-['Nunito Sans'] hover:underline font-semibold underline-offset-8"
                                            onClick={handleTaskClick}>
                                            <span
                                                className={type === 'LAB' ? "text-blue-500 font-bold" : "text-black text-[23px]"}>Завдання</span>
                                        </div>
                                        <div
                                            className="left-[12px] top-0 relative text-[23px] font-bold font-['Nunito Sans'] underline-offset-8 hover:underline font-semibold"
                                            onClick={handleModClick}>
                                            <span
                                                className={type === 'MODULAR' ? "text-blue-500 font-bold" : "text-black text-[23px]"}>Модульна</span>
                                        </div>
                                        <div
                                            className="left-[12px] top-0 relative text-[23px] font-bold font-['Nunito Sans'] underline-offset-8 hover:underline font-semibold"
                                            onClick={handleInfoClick}>
                                            <span
                                                className={type === 'INFO' ? "text-blue-500 font-bold" : "text-black text-[23px]"}>Повідомлення</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[768px] h-[103px] left-[2px] mt-[4px] top-[14px] relative">
                                    <div
                                        className="w-[768px] h-[66px] left-0 top-[37px] absolute bg-red-100 rounded-xl border border-stone-200"/>
                                    <div
                                        className="left-[12px] top-0 absolute text-black text-[23px] font-bold font-['Nunito Sans']">Заголовок:
                                    </div>
                                    <div
                                        className="w-[725px] h-[29px] left-[19px] top-[53px] absolute text-black text-2xl font-bold font-['Nunito Sans'] leading-[27px]">
                                        <fieldset className="form-group">
                                            <Field type="text"
                                                   className="w-[680px] form-text bg-red-100 text-[23px] font-['Nunito Sans'] text-black font-semibold"
                                                   name="title"
                                                   placeholder={type === 'TASK' ? 'Лабораторна робота' : 'Навчальні матеріали'}/>
                                        </fieldset>
                                    </div>
                                </div>
                                <div
                                    className="left-[12px] top-[15px] relative text-black text-[23px] font-bold font-['Nunito Sans']">Опис:
                                </div>
                                <div
                                    className="w-[932px] min-h-[150px] h-auto left-0 top-[20px] relative rounded-xl border border-stone-200 bg-red-100">

                                    <Field as="textarea"
                                           className="w-[882px] left-[19px] top-[11px] h-auto min-h-[150px] relative mb-[20px] text-[20px] bg-red-100 leading-[27px] font-['Nunito Sans'] text-black"
                                           name="description"
                                           placeholder="Приклад опису завдання"/>
                                    <div
                                        className="w-[300px] h-[63px] top-[20px] mb-[40px] relative justify-center items-center inline-flex">
                                        <form>
                                            <input type="file" id="fileInput" onChange={handleFileChange}
                                                   multiple={true} className="hidden"/>

                                            <label htmlFor="fileInput"
                                                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                                Вибрати файли
                                            </label>
                                            {files.length > 0 && (
                                                <div
                                                    className="relative text-center text-xl font-bold font-['Nunito Sans']">
                                                    Обрано {files.length} {files.length === 1 ? 'файл' : (files.length >= 5 ? 'файлів' : 'файла')}
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </div>
                                {type !== 'INFO' && (
                                    <div className="flex flex-row relative">
                                        <div className="w-[209px] h-[103px] left-0 top-[22px] relative">
                                            <div
                                                className="w-[209px] h-[66px] left-0 top-[37px] bg-red-100 absolute rounded-xl border border-stone-200"/>
                                            <div
                                                className="left-[12px] top-0 absolute text-black text-[23px] font-bold font-['Nunito Sans']">
                                                Кількість балів:
                                            </div>
                                            <div
                                                className="w-[82px] h-[29px] left-[84px] top-[55px] relative text-center text-black text-2xl font-bold font-['Nunito Sans'] leading-[27px] bg-red-200">
                                                <Field type="number"
                                                       className="w-[82px] h-[29px] bg-red-100"
                                                       name="maxScore"
                                                       placeholder="Максимальний бал"/>
                                            </div>
                                        </div>
                                        <div className="w-[280px] h-[103px] left-[181px] top-[22px] relative">
                                            <div
                                                className="w-[280px] h-[66px] left-0 top-[37px] relative bg-red-100 rounded-xl border border-stone-200"/>
                                            <div
                                                className="left-[12px] top-0 absolute text-black text-[23px] font-bold font-['Nunito Sans']">
                                                Зробити до:
                                            </div>
                                            <div
                                                className="w-[137px] h-[29px] left-[53px] top-[55px] absolute text-center text-black text-2xl font-bold font-['Nunito Sans'] leading-[27px]">
                                                <Field type="date"
                                                       className="w-[200px] h-[29px] bg-red-100 form-date"
                                                       name="targetDate"/>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button type="submit"
                                        className="left-[250px] top-[50px] w-[250px] h-16 relative hover:shadow-2xl rounded-[25px]">
                                    <div
                                        className="w-[250px] h-16 left-0 top-0 absolute bg-lime-600 rounded-[25px] shadow"/>
                                    <div
                                        className="w-[190px] h-[17px] left-[30px] top-[18px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">Створити
                                        завдання
                                    </div>
                                </button>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}

function StudContent({subject}) {
    const [students, setStudents] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        refreshStudents()
    }, []);

    function refreshStudents() {
        setIsLoading(true)
        Promise.all(
            subject.groupsList.map((group) => {
                    return retrieveStudentsByGroup(group.groupId)
                        .then((response) => {
                            setStudents((prevStudentsByGroup) => ({
                                ...prevStudentsByGroup,
                                [group.groupId]: response.data,
                            }));
                        })
                        .catch((error) => console.log(error))
                }
            )
        ).then(() => setIsLoading(false))

    }

    if (isLoading) {
        return <div>Loading</div>
    }

    return (
        <div className="left-[20px] relative">
            {subject.groupsList.map((group) => (
                <div key={group.groupId} className="mt-[20px]">
                    <div className="text-black text-[23px] font-bold font-['Nunito Sans']">
                        Група {group.groupName}({group.major.majorId} {group.major.name}).
                        Курс {group.yearOfStudy}й. <Link
                        to={(localStorage.getItem("role") === "TEACHER") ? (`/teach/courses/${subject.subjectId}/group/${group.groupId}/scores`) : (`/admin/courses/${subject.subjectId}/group/${group.groupId}/scores`)}
                        className="text-[21px] no-underline">
                        <span className="">
                            Успішність групи
                        </span>
                    </Link>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>ПІБ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students[group.groupId].map((student) => (
                            <tr key={student.studentId}>
                                <td>
                                    {student.email}
                                </td>
                                <td>
                                    {student.lastname} {student.firstname} {student.patronymic}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    )
}

function RenewComponent({subjectId}) {
    const [renews, setRenews] = useState([])

    useEffect(() => {
        refreshRenews()
    }, []);

    function refreshRenews() {
        Promise.all([
            retrieveRenewInfoBySubject(subjectId)
        ])
            .then((responses) =>
                setRenews(responses[0].data)
            )
    }

    return (
        <div>
            {renews.map((renew) =>
                (
                    <Link key={renew.taskId + '_' + renew.studentId} to={(localStorage.getItem("role") === "TEACHER") ? (`/teach/courses/${subjectId}/task/${renew.taskId}/student/${renew.studentId}`) : (`/admin/courses/${subjectId}/task/${renew.taskId}/student/${renew.studentId}`)}>
                        {renew.scoreDTO ? (
                            <div className="w-[916px] h-[93px] mt-[10px] position-relative">
                                <div
                                    className="w-[916px] h-[93px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-green-100"/>
                                <div
                                    className="w-[581px] h-[25px] left-[182px] top-[22px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                                    {renew.studentSurname} {renew.studentFirstname} {renew.studentPatronymic}
                                    <span className="ml-[10px] text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                    {renew.type === "TASK" ? "прикріпив(-ла) відповідь" : "додав коментар"}
                                </span>
                                </div>
                                <div
                                    className="w-[326px] h-[27px] left-[182px] top-[52px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                    {renew.taskTitle}
                                </div>
                                <div
                                    className="w-[155px] h-[93px] left-0 top-0 absolute  rounded-xl border border-stone-200 bg-green-200"/>
                                <div
                                    className="w-[80px] left-[37px] top-[20px] absolute text-center text-black text-[22px] font-bold font-['Nunito Sans'] leading-[27px]">
                                    {formDate(renew.lastUpdated)[2]} {formDate(renew.lastUpdated)[0]} {formDate(renew.lastUpdated)[1]}
                                </div>
                                <div
                                    className="w-[159px] h-[93px] left-[757px] top-0 absolute rounded-xl border border-stone-200 bg-green-200"/>
                                <div
                                    className="left-[773px] top-[33px] absolute text-black text-lg font-bold font-['Nunito Sans'] leading-[27px]">
                                    Оцінено: {renew.scoreDTO.value}/{renew.maxScore}
                                </div>
                            </div>
                        ) : (
                            <div className="w-[916px] h-[93px] mt-[10px] position-relative">
                                <div
                                    className="w-[916px] h-[93px] left-0 top-0 absolute rounded-xl border border-stone-200 bg-red-100"/>
                                <div
                                    className="w-[581px] h-[25px] left-[182px] top-[22px] absolute text-zinc-800 text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                                    {renew.studentSurname} {renew.studentFirstname} {renew.studentPatronymic}
                                    <span className="ml-[10px] text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                    {renew.type === "TASK" ? "прикріпив(-ла) відповідь" : "додав коментар"}
                                </span>
                                </div>
                                <div
                                    className="w-[326px] h-[27px] left-[182px] top-[52px] absolute text-black text-lg font-semibold font-['Nunito Sans'] leading-[27px]">
                                    {renew.taskTitle}
                                </div>
                                <div
                                    className="w-[155px] h-[93px] left-0 top-0 absolute  rounded-xl border border-stone-200 bg-red-200"/>
                                <div
                                    className="w-[80px] left-[37px] top-[20px] absolute text-center text-black text-[22px] font-bold font-['Nunito Sans'] leading-[27px]">
                                    {formDate(renew.lastUpdated)[2]} {formDate(renew.lastUpdated)[0]} {formDate(renew.lastUpdated)[1]}
                                </div>
                                <div
                                    className="w-[159px] h-[93px] left-[757px] top-0 absolute bg-sky-200/opacity-30 rounded-xl border border-stone-200 bg-red-200"/>
                                <div
                                    className="left-[784px] top-[33px] absolute text-black text-[19px] font-extrabold font-['Nunito Sans'] leading-[27px]">
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