import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    retrieveAllScoresInSubject,
    retrieveStudentsByGroup,
    retrieveSubject,
    retrieveTasksBySubject
} from "../../api/MemberApi";
import NoContentComponent from "../NoContentComponent";

export default function TeachScoreListComponent() {
    const {subjectId, groupId} = useParams()
    const [subject, setSubject] = useState(null)
    const [students, setStudents] = useState([])
    const [tasks, setTasks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [scores, setScores] = useState([])
    const [hasModular, setHasModular] = useState(false)
    const [koef, setKoef] = useState(0.4)

    useEffect(() => {
        refreshScoreList()
    }, []);

    function refreshScoreList() {
        setIsLoading(true)

        Promise.all([
            retrieveSubject(subjectId),
            retrieveStudentsByGroup(groupId),
            retrieveTasksBySubject(subjectId),
            retrieveAllScoresInSubject(subjectId)
        ])
            .then((responses) => {
                const subjectResponse = responses[0]
                const studentsResponse = responses[1]
                const tasksResponse = responses[2].data.filter((task) => task.task !== 'INFO').sort((a, b) => {
                    const dateA = new Date(a.createDate);
                    const dateB = new Date(b.createDate);
                    return dateA - dateB;
                });
                const scoreResponse = responses[3]

                setSubject(subjectResponse.data)
                setStudents(studentsResponse.data)
                setTasks(tasksResponse)
                setScores(scoreResponse.data)
                setHasModular(tasksResponse.find((task) => task.task === 'MODULAR'))
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => setIsLoading(false))


    }

    const onChangeKoef = (event) => {
        setKoef(event.target.value);
    };

    if (isLoading) {
        return <div></div>
    }

    if (!isLoading && !subject) {
        return <NoContentComponent/>
    }

    if (!isLoading && subject) {
        if (!subject.groupsList.some(group => group.groupId == groupId)) {
            return <NoContentComponent/>
        }
    }

    function calculate(student) {
        let sumOfScore = 0
        let sumOfMaxScore = 0
        if (hasModular) {
            let sumOfModScore = 0
            let sumOfModMaxScore = 0
            tasks.map((task) => {
                if (task.task === "LAB") {
                    sumOfMaxScore += task.gradedTask.maxScore
                    const score = scores.find((score) => score.studentId === student.studentId && score.taskId === task.taskId)
                    sumOfScore += score ? score.value : 0
                } else {
                    sumOfModMaxScore += task.gradedTask.maxScore
                    const score = scores.find((score) => score.studentId === student.studentId && score.taskId === task.taskId)
                    sumOfModScore += score ? score.value : 0
                }
            })
            return Math.round(sumOfScore / sumOfMaxScore * (1 - koef) * 100 + sumOfModScore / sumOfModMaxScore * koef)

        } else {
            tasks.map((task) => {
                sumOfMaxScore += task.gradedTask.maxScore
                const score = scores.find((score) => score.studentId === student.studentId && score.taskId === task.taskId)
                sumOfScore += score ? score.value : 0
            })
            return Math.round(sumOfScore / sumOfMaxScore * 100)
        }

    }

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="relative w-max-[1600px]">
                <div className="flex justify-center items-center">
                    <div>
                        <div className="w-[800px] h-[110px] relative rounded-2xl bg-blue-100"/>
                        <div
                            className="relative w-[800px] left-[7px] -top-[95px] text-wrap leading-tight font-['Nunito Sans']">
                            Підсумковий бал обчислюється наступним образом:<br/>
                            Сумується кількість зароблених балів та ділиться на максимальну кількість балів за всі
                            завдання.
                            Результат помножується на 100 та округляється на користь студента.<br/>
                            При наявності модульних робот, вказується їх коефіцієнт впливу на оцінку (від 0.1 до 0.5).
                        </div>
                    </div>
                </div>
                {tasks.length > 0 ? (
                    <div className="relative">
                        {hasModular && (
                            <div className="relative -top-[50px] left-[30px]">
                                <form>
                                    <label className="font-semibold text-[20px]">Коефіцієнт модульних робот: </label>
                                    <input className="w-[70px] ml-[20px] font-semibold text-[20px]" type="number"
                                           step="0.1" onChange={onChangeKoef} value={koef} max={0.5} min={0.1}/>
                                </form>
                            </div>
                        )}
                        <table className="table table-success table-striped relative -top-[35px] text-[20px]">
                            <thead>
                            <tr className="align-middle">
                                <th className="w-[180px] text-center" scope="col">ПІБ</th>
                                {tasks.map((task) => (
                                        <th className="w-[180px] text-center" scope="col" key={'header_' + task.taskId}>
                                            {task.title}
                                        </th>
                                    )
                                )}
                                {tasks.length !== 0 && (
                                    <th className="w-[180px] text-center" scope="col">
                                        Підсумковий бал
                                    </th>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {students.map((student) => (
                                <tr key={student.studentId} className="align-middle">
                                    <td>
                                        {student.lastname} {student.firstname} {student.patronymic}
                                    </td>
                                    {tasks.map((task) => (
                                        <td key={student.studentId + '_' + task.taskId} className="text-center">
                                            {scores.find((score) => score.studentId === student.studentId && score.taskId === task.taskId) ?
                                                scores.find((score) => score.studentId === student.studentId && score.taskId === task.taskId).value :
                                                '-'
                                            }/{task.gradedTask.maxScore}
                                        </td>
                                    ))}
                                    <td className="text-center">
                                        {calculate(student)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-[23px] font-bold text-center">
                        Поки що не опубліковано жодного завдання.<br/> Додайте завдання для отримання поточних оцінок
                        студентів.
                    </div>
                )}
            </div>
        </div>
    )
}