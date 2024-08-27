import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {retrieveAllSubjectsByTeacher} from "../../api/MemberApi";
import {fio} from "../../js/fio";

export default function TeachCoursesComponent(){
    const [courses, setCourses] = useState([])

    useEffect(() => refreshCourses, []);

    function refreshCourses() {
        retrieveAllSubjectsByTeacher(localStorage.getItem("uid"))
            .then((response) => setCourses(response.data))
            .catch((error) => console.log(error))
    }

    return (
        <div className="flex flex-wrap">
            {courses.map((course) =>
                <CourseComponent key={course.subjectId} course={course}/>
            )}
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
            <Link to={"/teach/courses/" + course.subjectId} className="no-underline">
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