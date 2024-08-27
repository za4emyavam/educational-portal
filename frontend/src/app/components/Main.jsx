import {BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom"
import LoginComponent from "./LoginComponent";
import AuthProvider, {useAuth} from "../security/AuthContext";
import HeaderComponent from "./HeaderComponent";
import LogoutComponent from "./LogoutComponent";
import ScheduleComponent from "./stud/ScheduleComponent";
import CoursesComponent from "./stud/CoursesComponent";
import SubjectComponent from "./stud/SubjectComponent";
import TaskComponent from "./stud/TaskComponent";
import TasksComponent from "./stud/TasksComponent";
import TeachCoursesComponent from "./teach/TeachCoursesComponent";
import TeachSubjectComponent from "./teach/TeachSubjectComponent";
import TeachScoreListComponent from "./teach/TeachScoreListComponent";
import TeachTaskComponent from "./teach/TeachTaskComponent";
import TeachStudentTaskComponent from "./teach/TeachStudentTaskComponent";
import TeachRenewComponent from "./teach/TeachRenewComponent";
import getDefRoutes from "../js/getDefRoutes";
import ProfileComponent from "./ProfileComponent";
import NoContentComponent from "./NoContentComponent";
import FacultyComponent from "./admin/FacultyComponent";
import {FacultiesComponent} from "./admin/FacultiesComponent";
import MajorsComponent from "./admin/MajorsComponent";
import MajorComponent from "./admin/MajorComponent";
import StudyGroupsComponent from "./admin/StudyGroupsComponent";
import StudyGroupComponent from "./admin/StudyGroupComponent";
import UsersComponent from "./admin/UsersComponent";
import UserComponent from "./admin/UserComponent";
import TeacherComponent from "./admin/TeacherComponent";
import StudentComponent from "./admin/StudentComponent";
import AdminCoursesComponent from "./admin/AdminCoursesComponent";
import AdminCourseComponent from "./admin/AdminCourseComponent";
import AdminScheduleComponent from "./admin/AdminScheduleComponent";
import AdminTeachCoursesComponent from "./admin/AdminTeachCoursesComponent";


function AuthenticatedRoute() {
    const authContext = useAuth()

    try {
        if (authContext.isAuthenticated)
            return <Outlet/>
        else {
            authContext.logout()
            return <Navigate to="/"/>
        }

    } catch (error) {
        authContext.logout()
        return <Navigate to="/"/>
    }
}

function RoleRoute({role}) {
    if (role === localStorage.getItem("role")) {
        return <Outlet/>
    } else {
        return <Navigate to={getDefRoutes()}/>
    }
}


export default function Main() {

    return (
        <div className="Main">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent/>
                    <Routes>
                        <Route path="" element={<LoginComponent/>}/>
                        <Route path="/stud" element={<RoleRoute role={'STUDENT'}/>}>
                            <Route index element={<NoContentComponent/>}/>
                            <Route path="schedule" element={<AuthenticatedRoute/>}>
                                <Route index element={<ScheduleComponent/>}/>
                            </Route>
                            <Route path="courses" element={<AuthenticatedRoute/>}>
                                <Route index element={<CoursesComponent/>}/>
                                <Route path=":subjectId" element={<SubjectComponent/>}/>
                                <Route path=":subjectId/task/:taskId" element={<TaskComponent/>}/>
                            </Route>
                            <Route path="tasks" element={<AuthenticatedRoute/>}>
                                <Route index element={<TasksComponent/>}/>
                            </Route>
                        </Route>
                        <Route path="logout" element={<AuthenticatedRoute/>}>
                            <Route index element={<LogoutComponent/>}/>
                        </Route>
                        <Route path="/teach" element={<RoleRoute role={'TEACHER'}/>}>
                            <Route index element={<NoContentComponent/>}/>
                            <Route path="courses" element={<AuthenticatedRoute/>}>
                                <Route index element={<TeachCoursesComponent/>}/>
                                <Route path=":subjectId" element={<TeachSubjectComponent/>}/>
                                <Route path=":subjectId/task/:taskId" element={<TeachTaskComponent/>}/>
                                <Route path=":subjectId/group/:groupId/scores" element={<TeachScoreListComponent/>}/>
                                <Route path=":subjectId/task/:taskId/student/:studentId"
                                       element={<TeachStudentTaskComponent/>}/>
                            </Route>
                            <Route path="renewal" element={<AuthenticatedRoute/>}>
                                <Route index element={<TeachRenewComponent/>}/>
                            </Route>
                        </Route>
                        <Route path="/admin" element={<RoleRoute role={'ADMIN'}/>}>
                            <Route index element={<NoContentComponent/>}/>
                            <Route path="manage" element={<RoleRoute role={'ADMIN'}/>}>
                                <Route index element={<NoContentComponent/>}/>
                                <Route path="faculties" element={<FacultiesComponent/>}/>
                                <Route path="faculties/faculty" element={<FacultyComponent/>}/>
                                <Route path="faculties/faculty/:facultyId" element={<FacultyComponent/>}/>
                                <Route path="majors" element={<MajorsComponent/>}/>
                                <Route path="majors/major" element={<MajorComponent/>}/>
                                <Route path="majors/major/:majorId" element={<MajorComponent/>}/>
                                <Route path="study_groups" element={<StudyGroupsComponent/>}/>
                                <Route path="study_groups/study_group" element={<StudyGroupComponent/>}/>
                                <Route path="study_groups/study_group/:groupId" element={<StudyGroupComponent/>}/>
                                <Route path="users" element={<UsersComponent/>}/>
                                <Route path="users/user" element={<UserComponent/>}/>
                                <Route path="users/teacher/:teacherId" element={<TeacherComponent/>}/>
                                <Route path="users/student/:studentId" element={<StudentComponent/>}/>
                                <Route path="courses" element={<AdminCoursesComponent/>}/>
                                <Route path="courses/course" element={<AdminCourseComponent/>}/>
                                <Route path="courses/course/:courseId" element={<AdminCourseComponent/>}/>
                                <Route path="schedule" element={<AdminScheduleComponent/>}/>
                            </Route>
                            <Route path="courses" element={<RoleRoute role={'ADMIN'}/> }>
                                <Route index element={<AdminTeachCoursesComponent/>}/>
                                <Route index element={<TeachCoursesComponent/>}/>
                                <Route path=":subjectId" element={<TeachSubjectComponent/>}/>
                                <Route path=":subjectId/task/:taskId" element={<TeachTaskComponent/>}/>
                                <Route path=":subjectId/group/:groupId/scores" element={<TeachScoreListComponent/>}/>
                                <Route path=":subjectId/task/:taskId/student/:studentId"
                                       element={<TeachStudentTaskComponent/>}/>
                            </Route>
                        </Route>
                        <Route path="/profile" element={<AuthenticatedRoute/>}>
                            <Route index element={<ProfileComponent/>}/>
                        </Route>
                        <Route path="*" element={<Navigate to={getDefRoutes()}/>}/>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}


