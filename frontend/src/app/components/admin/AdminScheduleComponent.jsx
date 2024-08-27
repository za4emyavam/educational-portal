import {useEffect, useState} from "react";
import {
    deleteSchedule,
    retrieveAllStudyGroups,
    retrieveScheduleByStudyGroup,
    retrieveSubjectsByStudyGroup, saveSchedule
} from "../../api/MemberApi";
import {fioByPersonalData} from "../../js/fio";
import AdminManageComponent from "./AdminManageComponent";
import Select from "react-select";
import deleteFileIcon from "../../resourses/delete.png";

export default function AdminScheduleComponent() {
    const [studyGroupId, setStudyGroupId] = useState(null)
    const [studyGroups, setStudyGroups] = useState([])
    const [subjects, setSubjects] = useState(null)
    const [subject, setSubject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdded, setIsAdded] = useState(false)
    const [schedule, setSchedule] = useState([])
    const [type, setType] = useState('LECTURE')
    const numberOfPair = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]])

    useEffect(() => refreshSchedule(), [studyGroupId, isAdded]);

    function refreshSchedule() {
        setIsLoading(true)
        const promises = []
        if (studyGroupId != null) {
            promises.push(Promise.all([
                retrieveScheduleByStudyGroup(studyGroupId), retrieveSubjectsByStudyGroup(studyGroupId)
            ])
                .then((responses) => {
                    setSchedule(responses[0].data)
                    setSubjects(responses[1].data)
                }))


        } else {
            setSchedule([])
        }
        promises.push(Promise.all([
            retrieveAllStudyGroups()
        ]).then((responses) => setStudyGroups(responses[0].data))
            .catch((error) => console.log(error)))

        Promise.all(promises)
            .finally(() => setIsLoading(false))
    }

    function handleAddSubject(day, number) {
        if (validate(day, number)) {
            Promise.all([saveSchedule(studyGroupId, {
                groupId: studyGroupId,
                subjectId: subject,
                day: day,
                number: number,
                classType: type
            })])
                .finally(() => {
                    setIsAdded(!isAdded)
                })
        }
    }

    function handleDelete(day, number) {
        Promise.all([deleteSchedule(studyGroupId, {
            day: day,
            number: number
        })])
            .finally(() => {
                setIsAdded(!isAdded)
            })
    }

    function validate(day, number) {
        if (!studyGroupId || !subject)
            return false

        if (day < 1 || day > 6)
            return false

        if (number < 1 || number > 6)
            return false

        return true
    }

    if (isLoading) {
        return (
            <div></div>
        )
    }

    return (
        <div className="flex">
            <AdminManageComponent/>
            <div className="w-[77vw] flex justify-center items-center mt-10">
                <div className="relative">
                    <div className="ml-10">
                        <h1 className="text-3xl font-bold mb-6">Створення розкладу</h1>
                        <div className="flex flex-row gap-3">
                            <div>
                                <label>
                                    Навчальна група:
                                </label>
                                <Select
                                    id="studyGroupId"
                                    name="studyGroupId"
                                    options={studyGroups.map((group) => ({
                                        value: group.groupId,
                                        label: (`Курс: ${group.yearOfStudy} (${group.major.majorId} ${group.major.name}) Група: ${group.name}`),
                                    }))}
                                    onChange={(selectedOption) => {
                                        selectedOption ? setStudyGroupId(selectedOption.value) : setStudyGroupId(null)
                                    }}
                                    defaultValue={studyGroupId && studyGroups.map((group) => ({
                                        value: group.groupId,
                                        label: (`Курс: ${group.yearOfStudy} (${group.major.majorId} ${group.major.name}) Група: ${group.name}`),
                                    }))[studyGroups.findIndex(group => group.groupId === studyGroupId)]}
                                    className="basic-multi-select w-[300px]"
                                    classNamePrefix="select"
                                    placeholder="Обрати..."
                                />
                            </div>
                            {studyGroupId && (
                                <div className="flex flex-row gap-3">
                                    <div>
                                        <label>
                                            Предмет:
                                        </label>
                                        <Select
                                            id="subject"
                                            name="subject"
                                            options={subjects ? subjects.map((subject) => ({
                                                value: subject.subjectId,
                                                label: subject.name
                                            })) : []}
                                            onChange={(selectedOption) => {
                                                setSubject(selectedOption ? selectedOption.value : null)
                                            }}
                                            defaultValue={subjects && subjects.map((subject) => ({
                                                value: subject.subjectId,
                                                label: subject.name,
                                            }))[subjects.findIndex(s => s.subjectId === subject)]}
                                            className="basic-multi-select w-[300px]"
                                            classNamePrefix="select"
                                            placeholder="Обрати..."
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Тип</label>
                                        <div className="flex space-x-4">
                                            {[{value: 'LECTURE', label: 'Лекция'},
                                                {value: 'PRACTICAL', label: 'Практика'}].map((option) => (
                                                <label key={option.value} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value={option.value}
                                                        checked={type === option.value}
                                                        onChange={() => setType(option.value)}
                                                        className="hidden"
                                                    />
                                                    <span
                                                        className={`inline-block w-4 h-4 mr-2 border rounded-full cursor-pointer ${
                                                            type === option.value ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                                                        }`}
                                                    ></span>
                                                    <span className="text-gray-700">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <table className="ml-10 table table-bordered mt-3">
                        <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>ПН</th>
                            <th>ВТ</th>
                            <th>СР</th>
                            <th>ЧТ</th>
                            <th>ПТ</th>
                            <th>СБ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[1, 2, 3, 4, 5, 6].map((number) => (
                            <tr key={number}>
                                <th scope="row"
                                    className="w-[50px] h-[75px] text-center">{numberOfPair.get(number)}</th>
                                {[1, 2, 3, 4, 5, 6].map((day) =>
                                    <td key={`${number}-${day}`} className="w-[150px] h-[75px]">
                                        {schedule[number] && schedule[number].find((item) => item.day === day) ?
                                            <LessonComponent
                                                item={schedule[number].find((item) => item.day === day)}
                                                day={day} number={number} handleDelete={handleDelete}/> :
                                            <TDButton day={day} number={number} onClick={handleAddSubject}/>}

                                    </td>
                                )}
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                </div>
                <div className="ml-20 relative">

                </div>
            </div>
        </div>
    )
}

function LessonComponent({item, day, number, handleDelete}) {

    function handleDeleteClick(event) {
        event.preventDefault();
        handleDelete(day, number)
    }

    return (<div>
            {item.classType === "LECTURE" ? (
                <div>
                    <div className="flex h-[75px] bg-violet-200">
                        <div className="w-1/12">
                            <div className="w-[4.35px] h-full position-relative bg-violet-600"/>
                        </div>
                        <img className="w-[25px] h-[26px] top-[5px] relative" src={deleteFileIcon}
                             onClick={handleDeleteClick}/>
                        <div className="w-11/12">
                            <div
                                className="text-right mt-1 mr-2 text-violet-600 text-[15px] font-bold font-['Nunito Sans']">{item.subjectId.name}
                            </div>
                            <div
                                className="text-right mb-2 mr-2 text-black text-[13px] font-semibold font-['Nunito Sans']">{fioByPersonalData(item.subjectId.mainTeacher.personalData)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex h-[75px] bg-red-100">
                        <div className="w-1/12">
                            <div className="w-[4.35px] h-full position-relative bg-red-500"/>
                        </div>
                        <img className="w-[25px] h-[26px] top-[5px] relative" src={deleteFileIcon}
                             onClick={handleDeleteClick}/>
                        <div className="w-11/12">
                            <div
                                className="text-right mt-1 mr-2 text-red-500 text-[15px] font-bold font-['Nunito Sans']">{item.subjectId.name}
                            </div>
                            <div
                                className="text-right mb-2 mr-2 text-black text-[13px] font-semibold font-['Nunito Sans']">{fioByPersonalData(item.subjectId.mainTeacher.personalData)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

function TDButton({day, number, onClick}) {

    function handleClick(event) {
        event.preventDefault()
        onClick(day, number)
    }

    return (
        <button className="w-full h-full  hover:bg-gray-300" onClick={handleClick}>
        </button>
    )
}