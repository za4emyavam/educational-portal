import {useState} from "react";
import {useFormik} from "formik";
import {changePassword} from "../api/MemberApi";

export default function ProfileComponent() {
    const [error, setError] = useState(null)
    const [onSuccessMessage, setOnSuccessMessage] = useState(null)
    const validate = values => {
        const errors = {};

        if (!values.currentPassword) {
            errors.currentPassword = 'Потрібен поточний пароль';
        }

        if (!values.newPassword) {
            errors.newPassword = 'Потрібен новий пароль';
        } else if (values.newPassword.length < 8) {
            errors.newPassword = 'Пароль має бути не менше 8 символів';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Потрібно підтвердження нового паролю';
        } else if (values.confirmPassword !== values.newPassword) {
            errors.confirmPassword = 'Паролі мають збігатися';
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate,
        onSubmit: values => {
            setError(null)
            setOnSuccessMessage(null)
            const pass = ({
                oldPassword: values.currentPassword,
                newPassword: values.newPassword
            })
            changePassword(localStorage.getItem("uid"), pass)
                .then((response) => setOnSuccessMessage("Пароль успішно змінено"))
                .catch((error) => setError("Помилка при зміні паролю. Перевірте введені дані"))
            console.log('Password change submitted', values);
        },
    });

    return (
        <div className="flex items-center justify-center min-h-[86vh] bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Зміна паролю</h2>
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Поточний пароль</label>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            className="w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.currentPassword}
                        />
                        {formik.touched.currentPassword && formik.errors.currentPassword ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.currentPassword}</div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Новий пароль</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            className="w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.newPassword}
                        />
                        {formik.touched.newPassword && formik.errors.newPassword ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.newPassword}</div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Підтвердження нового паролю</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>
                    {error && (
                        <div className="flex items-center justify-between text-red-500 text-[17px] mb-[10px]">
                        {error}
                        </div>
                    )}
                    {onSuccessMessage && (
                        <div className="flex w-full items-center text-center justify-between text-green-500 text-[17px] mb-[10px]">
                            {onSuccessMessage}
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                        >
                            Змінити пароль
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};