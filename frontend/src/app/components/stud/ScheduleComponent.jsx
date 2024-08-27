import {useEffect, useState} from "react";
import {retrieveSchedule} from "../../api/MemberApi";
import {fio, fioByPersonalData} from "../../js/fio";

export default function ScheduleComponent() {
    const [schedule, setSchedule] = useState([])
    const numberOfPair = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]])

    useEffect(() => refreshSchedule, []);

    function refreshSchedule() {
        retrieveSchedule(localStorage.getItem("uid"))
            .then((response) => successfulResponse(response))
            .catch((error) => console.log(error))
    }

    function successfulResponse(response) {
        setSchedule(response.data)
    }

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="relative">
                <table className="ml-10 table table-bordered">
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
                            <th scope="row" className="w-[50px] h-[75px] text-center">{numberOfPair.get(number)}</th>
                            {[1,2,3,4,5,6].map((day) =>
                                <td key={`${number}-${day}`} className="w-[200px]">
                                    {schedule[number] && schedule[number].find((item) => item.day === day) ?
                                        <LessonComponent  item={schedule[number].find((item) => item.day === day)}/> : ''}
                                </td>
                            )}
                        </tr>
                    ))
                    }
                    </tbody>
                </table>
            </div>
            <div className="ml-20 relative">
                <div className="w-[226px] h-[340px] relative">
                    <div className="w-[226px] h-[340px] left-0 top-0 absolute bg-slate-100 rounded-sm border border-violet-100" />
                    <div className="w-[108px] h-[46px] left-[10px] top-[10px] absolute">
                        <div className="w-[108px] h-[46px] left-0 top-0 absolute opacity-20 bg-violet-600" />
                        <div className="opacity-90 w-[108px] h-[46px] left-0 top-0 absolute">
                        </div>
                        <div className="w-[3.15px] h-[46px] left-0 top-0 absolute bg-violet-600" />
                    </div>
                    <div className="w-[108px] h-[46px] left-[10px] top-[84px] absolute">
                        <div className="w-[108px] h-[46px] left-0 top-0 absolute opacity-20 bg-red-500" />
                        <div className="opacity-90 w-[108px] h-[46px] left-0 top-0 absolute">
                        </div>
                        <div className="w-[3.15px] h-[46px] left-0 top-0 absolute bg-red-500" />
                    </div>
                    <div className="left-[130px] top-[23px] absolute text-right text-black text-[15px] font-bold font-['Nunito Sans']">Лекція</div>
                    <div className="left-[30px] top-[158px] absolute">
                        <span className="text-black text-base font-black font-['Nunito Sans']">Розклад дзвінків<br/></span>
                        <span className="text-black text-base font-bold font-['Nunito Sans']">І пара – 8.00 – 9.20<br/>  ІІ пара – 9.30 – 10.50<br/>  ІІІ пара – 11.20 – 12.40<br/>  ІV пара – 12.50 – 14.10<br/>  V пара – 14.20 – 15.40<br/> VI пара – 15.50 – 17.10 <br/></span></div>
                    <div className="left-[130px] top-[97px] absolute text-black text-[15px] font-bold font-['Nunito Sans']">Практика</div>
                </div>
            </div>
        </div>
    )
}

function LessonComponent(item) {
    return (
        <div className="">
            {item.item.classType === "LECTURE" ? (
                <div>
                    <div className="flex h-[75px] bg-violet-200">
                        <div className="w-1/6">
                            <div className="w-[4.35px] h-full position-relative bg-violet-600"/>
                        </div>
                        <div className="w-5/6">
                            <div
                                className="text-right mt-1 mr-2 text-violet-600 text-[15px] font-bold font-['Nunito Sans']">{item.item.subjectId.name}
                            </div>
                            <div
                                className="text-right mb-2 mr-2 text-black text-[13px] font-semibold font-['Nunito Sans']">{fioByPersonalData(item.item.subjectId.mainTeacher.personalData)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex h-[75px] bg-red-100">
                        <div className="w-1/6">
                            <div className="w-[4.35px] h-full position-relative bg-red-500"/>
                        </div>
                        <div className="w-5/6">
                            <div
                                className="text-right mt-1 mr-2 text-red-500 text-[15px] font-bold font-['Nunito Sans']">{item.item.subjectId.name}
                            </div>
                            <div
                                className="text-right mb-2 mr-2 text-black text-[13px] font-semibold font-['Nunito Sans']">{fioByPersonalData(item.item.subjectId.mainTeacher.personalData)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}