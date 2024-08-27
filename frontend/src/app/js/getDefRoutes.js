export default function getDefRoutes() {
    switch (localStorage.getItem("role")) {
        case "STUDENT":
            return "/stud/schedule"
        case "TEACHER":
            return "/teach/courses"
        case "ADMIN":
            return "/admin/manage/faculties"
        default:
            return "/logout"
    }
}