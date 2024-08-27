import {Link} from "react-router-dom";

export default function AdminManageComponent() {

    return (
        <div className="flex">
            <div className="h-fit w-fit bg-blue-300 text-white flex flex-col p-4 rounded-br-lg"><nav>
                <ul className="space-y-2">
                    <li>
                        <Link to="/admin/manage/faculties" className="block px-4 py-2 rounded text-white no-underline hover:bg-gray-700">
                            Факультети
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/manage/majors" className="block px-4 py-2 rounded text-white no-underline hover:bg-gray-700">
                            Спеціальності
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/manage/study_groups" className="block px-4 py-2 text-white no-underline rounded hover:bg-gray-700">
                            Навчальні групи
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/manage/users" className="block px-4 py-2 text-white no-underline rounded hover:bg-gray-700">
                            Користувачі
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/manage/courses" className="block px-4 py-2 text-white no-underline rounded hover:bg-gray-700">
                            Курси
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/manage/schedule" className="block px-4 py-2 text-white no-underline rounded hover:bg-gray-700">
                            Розклад
                        </Link>
                    </li>
                </ul>
            </nav>
            </div>
        </div>

    )
}

