import {useEffect, useState} from "react";
import {retrieveSubjects} from "../../api/MemberApi";
import {Link} from "react-router-dom";
import {fio, fioByPersonalData} from "../../js/fio";

export default function CoursesComponent() {
    const [courses, setCourses] = useState([])

    useEffect(() => refreshCourses, []);

    function refreshCourses() {
        retrieveSubjects(localStorage.getItem("uid"))
            .then((response) => successfulResponse(response))
            .catch((error) => console.log(error))
    }

    function successfulResponse(response) {
        setCourses(response.data)
    }

    return (
        <div className="flex flex-wrap">
            {courses.map((course) =>
                <CourseComponent key={course.subjectId} course={course}/>
            )}
        </div>
    )
}


function CourseComponent(course) {

    return (
        <div className="w-[386.65px] h-[397px] relative ml-10 mt-10">
            <Link to={"/stud/courses/" + course.course.subjectId} className="no-underline">
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
                    className="w-[174px] h-[17px] left-[21px] top-[35px] absolute text-white text-xl font-bold font-['Nunito Sans'] leading-tight">{fioByPersonalData(course.course.mainTeacher.personalData)}
                </div>
                <div className="flex items-center justify-center">
                    <div
                        className="w-[243.96px] h-[41.25px] left-[71.35px] top-[177.88px] absolute text-center text-white text-[37px] font-black font-['Nunito Sans'] leading-[48px]">{course.course.name}
                    </div>
                </div>
            </Link>
        </div>


    )
}