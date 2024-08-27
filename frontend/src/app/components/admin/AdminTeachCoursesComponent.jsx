import {Link} from "react-router-dom";
import {fio} from "../../js/fio";
import {useEffect, useState} from "react";
import {
    retrieveAllStudyGroups,
    retrieveSubjectsByStudyGroup
} from "../../api/MemberApi";
import Select from "react-select";

export default function AdminTeachCoursesComponent() {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [studyGroupId, setStudyGroupId] = useState(null)
    const [studyGroups, setStudyGroups] = useState([])

    useEffect(() => refreshCourses(), [studyGroupId]);

    function refreshCourses() {
        setIsLoading(true)
        const promises = []
        if (studyGroupId != null) {
            promises.push(Promise.all([
                retrieveSubjectsByStudyGroup(studyGroupId)
            ])
                .then((responses) => {
                    setCourses(responses[0].data)
                }))
        }
        promises.push(Promise.all([
            retrieveAllStudyGroups()
        ]).then((responses) => setStudyGroups(responses[0].data))
            .catch((error) => console.log(error)))

        Promise.all(promises)
            .finally(() => setIsLoading(false))
    }

    if (isLoading) {
        return (
            <div>

            </div>
        )
    }

    return (
        <div>
            <div className="ml-[20px] mt-[20px]">
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
            <div className="flex flex-wrap">
                {courses.map((course) =>
                    <CourseComponent key={course.subjectId} course={course}/>
                )}
            </div>
        </div>
    )

}

function CourseComponent({course}) {

    function getUniqueValues(list) {
        const uniqueValues = new Set();
        list.forEach(item => {
            uniqueValues.add(item.yearOfStudy);
        });
        return Array.from(uniqueValues);
    }

    return (
        <div className="w-[386.65px] h-[397px] relative ml-10 mt-10">
            <Link to={"/admin/courses/" + course.subjectId} className="no-underline">
                <div className="w-[386.65px] h-[397px] left-0 top-0 absolute">
                    <div className="w-[386.65px] h-[397px] left-0 top-0 absolute bg-violet-400 rounded-[40px] shadow"/>
                    <div className="w-[386.65px] h-[397px] left-0 top-0 absolute">
                        <div
                            className="w-[386.65px] h-[397px] left-0 top-0 absolute bg-stone-600 rounded-[40px] shadow"/>
                        <div className="w-[427.16px] h-[397.86px] left-[-20.71px] top-0 absolute"/>
                    </div>
                    <div
                        className="w-[386.65px] h-[397px] left-0 top-0 absolute opacity-10 bg-slate-900 rounded-[40px] shadow"/>
                    <div className="w-[386.65px] h-[397px] left-0 top-0 absolute bg-slate-900 rounded-[40px] shadow"/>
                </div>
                <div
                    className="w-[174px] h-[17px] left-[21px] top-[35px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">{fio(course)}
                </div>
                <div className="w-[103px] h-[17px] left-[25px] top-[300px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">
                    {course.groupsList.length === 1 ? ('Курс: ' + course.groupsList[0].yearOfStudy) : ('Курси:' + getUniqueValues(course.groupsList).map((item) => ' ' + item)) }
                </div>
                <div className="w-[303px] h-[17px] left-[25px] top-[330px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">
                    {course.groupsList.length === 1 ?
                        ('Група: ' + course.groupsList[0].groupName + '(' + course.groupsList[0].major.majorId + ' ' + course.groupsList[0].major.name +')')
                        :
                        ('Групи:' + course.groupsList.map((group) =>
                            ' ' + group.groupName + '(' + group.major.majorId + ' ' + group.major.name +')'
                        ))
                    }
                </div>
                <div className="flex items-center justify-center">
                    <div
                        className="w-[243.96px] h-[41.25px] left-[71.35px] top-[177.88px] absolute text-center text-white text-[37px] font-black font-['Nunito Sans'] leading-[48px]">{course.name}
                    </div>
                </div>
            </Link>
        </div>


    )
}