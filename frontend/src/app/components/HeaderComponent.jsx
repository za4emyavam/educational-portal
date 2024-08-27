import {useAuth} from "../security/AuthContext";
import {Link, useLocation} from "react-router-dom";
import '../style/header.css';

import logoutIcon from '../resourses/logout.svg';

import * as React from "react";

function HeaderStudent() {
    const location = useLocation()


    return (
        <header className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
                <div className="flex grow gap-5 mt-1.5 text-3xl font-extrabold text-neutral-800 max-md:mt-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7e421e5471bc993b12b2d1b98b0e857e80eb65eeb579871e3ff4f8d40c146e0?apiKey=c80eac4c63644d34829eb5b5278b03df&"
                        alt="LightClass logo" className="shrink-0 self-start w-8 aspect-[1.23] mt-1.5"/>
                    <div className="flex-auto">
                        <span className="text-blue-500">Light</span>Class
                    </div>
                </div>
            </div>
            <nav className="flex flex-col ml-5 w-[40%] max-md:ml-0 max-md:w-full">
                <div
                    className="flex gap-5 mt-3.5 text-2xl font-bold text-black max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                    <div className="flex-auto">
                        <Link to="/stud/schedule"
                              className={location.pathname === '/stud/schedule' ? 'no-underline font-extrabold text-blue-600' : 'no-underline text-black'}>Розклад</Link>
                    </div>
                    <div className="flex-auto">
                        <Link to="/stud/courses"
                              className={/^\/stud\/courses(?:\/|$)/.test(location.pathname) ? 'no-underline font-extrabold text-blue-600' : 'no-underline text-black'}>Курси</Link>
                    </div>
                    <div className="flex-auto no-underline"><Link to="/stud/tasks"
                                                                  className={location.pathname === '/stud/tasks' ? 'no-underline font-extrabold text-blue-600' : 'no-underline text-black'}>Мої
                        завдання</Link>
                    </div>
                </div>
            </nav>
            <div className="flex flex-col ml-5 w-[26%] max-md:ml-0 max-md:w-full">
                <div className="flex grow gap-4 items-center text-2xl font-semibold text-black max-md:mt-10">
                    <Link to="/profile" className="no-underline text-black">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9713cfcc1760e07b8b93d354560da75fed2579f974465c888d2c0535739c115?apiKey=c80eac4c63644d34829eb5b5278b03df&"
                            alt="User avatar" className="shrink-0 self-stretch aspect-[0.95] w-[38px]"/>
                    </Link>
                    <div className="flex-auto self-stretch my-auto">{localStorage.getItem("email")}</div>

                    <Link to="/logout" className="no-underline text-black flex-auto">
                        <img
                            src={logoutIcon}
                            alt="Logout icon" className="shrink-0 self-stretch aspect-[0.95] w-[30px]"/>
                    </Link>
                </div>
            </div>
        </header>
    );
}

function HeaderTeacher() {
    const location = useLocation()

    return (
        <header className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
                <div className="flex grow gap-5 mt-1.5 text-3xl font-extrabold text-neutral-800 max-md:mt-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7e421e5471bc993b12b2d1b98b0e857e80eb65eeb579871e3ff4f8d40c146e0?apiKey=c80eac4c63644d34829eb5b5278b03df&"
                        alt="LightClass logo" className="shrink-0 self-start w-8 aspect-[1.23] mt-1.5"/>
                    <div className="flex-auto">
                        <span className="text-blue-500">Light</span>Class
                    </div>
                </div>
            </div>
            <nav className="flex flex-col ml-5 w-[40%] max-md:ml-0 max-md:w-full">
                <div
                    className="flex gap-5 mt-3.5 text-2xl font-bold text-black max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                    <div className="flex-auto">
                        <Link to="/teach/courses"
                              className={/^\/teach\/courses(?:\/|$)/.test(location.pathname) ? 'no-underline font-extrabold text-blue-600' : 'no-underline text-black'}>Курси</Link>
                    </div>
                    <div className="flex-auto">
                        <Link to="/teach/renewal"
                              className={location.pathname === '/teach/renewal' ? 'no-underline font-extrabold text-blue-600' : 'no-underline text-black'}>Оновлення</Link>
                    </div>
                </div>
            </nav>
            <div className="flex flex-col ml-5 w-[26%] max-md:ml-0 max-md:w-full">
                <div className="flex grow gap-4 items-center text-2xl font-semibold text-black max-md:mt-10">
                    <Link to="/profile" className="no-underline text-black">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9713cfcc1760e07b8b93d354560da75fed2579f974465c888d2c0535739c115?apiKey=c80eac4c63644d34829eb5b5278b03df&"
                            alt="User avatar" className="shrink-0 self-stretch aspect-[0.95] w-[38px]"/>
                    </Link>
                    <div className="flex-auto self-stretch my-auto">{localStorage.getItem("email")}</div>

                    <Link to="/logout" className="no-underline text-black flex-auto">
                        <img
                            src={logoutIcon}
                            alt="Logout icon" className="shrink-0 self-stretch aspect-[0.95] w-[30px]"/>
                    </Link>
                </div>
            </div>
        </header>
    );
}

function HeaderAdmin() {
    const location = useLocation()

    return (
        <header className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
                <div className="flex grow gap-5 mt-1.5 text-3xl font-extrabold text-neutral-800 max-md:mt-10">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7e421e5471bc993b12b2d1b98b0e857e80eb65eeb579871e3ff4f8d40c146e0?apiKey=c80eac4c63644d34829eb5b5278b03df&"
                        alt="LightClass logo" className="shrink-0 self-start w-8 aspect-[1.23] mt-1.5"/>
                    <div className="flex-auto">
                        <span className="text-blue-500">Light</span>Class
                    </div>
                </div>
            </div>
            <nav className="flex flex-col ml-5 w-[40%] max-md:ml-0 max-md:w-full">
                <div
                    className="flex gap-5 mt-3.5 text-2xl font-bold text-black max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                    <div className="flex-auto">
                        <Link to="/admin/manage/faculties"
                              className={/^\/admin\/manage(?:\/|$)/.test(location.pathname) ? 'no-underline font-extrabold text-blue-600' : 'no-underline text-black'}>Керування</Link>
                    </div>
                    <div className="flex-auto">
                        <Link to="/admin/courses"
                              className={/^\/admin\/courses(?:\/|$)/.test(location.pathname) ? 'no-underline font-extrabold text-blue-600' : 'no-underline text-black'}>Перегляд курсів</Link>
                    </div>
                </div>
            </nav>
            <div className="flex flex-col ml-5 w-[26%] max-md:ml-0 max-md:w-full">
                <div className="flex grow gap-4 items-center text-2xl font-semibold text-black max-md:mt-10">
                    <Link to="/profile" className="no-underline text-black">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9713cfcc1760e07b8b93d354560da75fed2579f974465c888d2c0535739c115?apiKey=c80eac4c63644d34829eb5b5278b03df&"
                            alt="User avatar" className="shrink-0 self-stretch aspect-[0.95] w-[38px]"/>
                    </Link>
                    <div className="flex-auto self-stretch my-auto">{localStorage.getItem("email")}</div>

                    <Link to="/logout" className="no-underline text-black flex-auto">
                        <img
                            src={logoutIcon}
                            alt="Logout icon" className="shrink-0 self-stretch aspect-[0.95] w-[30px]"/>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function HeaderComponent() {
    const currentLocation = useLocation()
    return (
        <div className={currentLocation.pathname === '/' ? 'd-none' : 'd-block'}>
            <div className="w-full px-16 py-10 bg-zinc-300 max-md:px-5">
                {localStorage.getItem("role") === 'STUDENT' ? (<HeaderStudent/>
                ) : (
                    localStorage.getItem("role") === 'TEACHER' ? <HeaderTeacher/> : (
                        localStorage.getItem("role") === 'ADMIN' && <HeaderAdmin/>
                    )
                    )}
            </div>
        </div>
    );
}
