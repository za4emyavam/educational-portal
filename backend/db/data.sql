insert into member
values (DEFAULT, 'test@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK', 'ADMIN');
insert into member
values (DEFAULT, 'teacher1@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK', 'TEACHER'),
       (DEFAULT, 'teacher2@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK', 'TEACHER'),
       (DEFAULT, 'teacher3@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK', 'TEACHER');
insert into member
values (DEFAULT, 'student1@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK'),
       (DEFAULT, 'student2@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK'),
       (DEFAULT, 'student3@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK'),
       (DEFAULT, 'student4@gmail.com', '$2a$10$Vmm0rSHnmb4GHiW4FuEsweXGFCDcU4Puo4zgco.or.QeYWKm0lIqK');


insert into personal_data
values (DEFAULT, 1, 'Микита', 'Шух', 'Сергійович'),
       (DEFAULT, 2, 'Ніна', 'Дмитренко', 'Іванівна'),
       (DEFAULT, 3, 'Василь', 'Романченко', 'Янович'),
       (DEFAULT, 4, 'Раїса', 'Крамаренко', 'Євгенівна'),
       (DEFAULT, 5, 'Любов', 'Крамарчук', 'Йосипівна'),
       (DEFAULT, 6, 'Йосип', 'Пономаренко', 'Янович'),
       (DEFAULT, 7, 'Юлія', 'Васильєв', 'Федорівна'),
       (DEFAULT, 8, 'Назар', 'Дмитренко', 'Михайлович');

insert into faculty
values (DEFAULT, 'Факультет фізики і математики');

insert into major
values (123, 'КІ', 1),
       (122, 'КН', 1);

insert into study_group
values (DEFAULT, '1', 123, 2);
insert into study_group
values (DEFAULT, '2', 122, 3);

insert into student
values (5, 1),
       (6, 1),
       (7, 2),
       (8, 2);

insert into teacher
values (2),
       (3),
       (4);

insert into subject
values (DEFAULT, 2, 'ДС№3'),
       (DEFAULT, 4, 'ДС№2'),
       (DEFAULT, 2, 'Теорія ймовірності');

insert into subject_study_group
values (1, 2),
       (1, 1),
       (3, 2),
       (2, 1);

insert into task
values (DEFAULT, 1, 'INFO', 'Тестовый заголовок', 'Тестовый текст с ссылками допустим'),
       (DEFAULT, 3, 'INFO', 'Тестовый заголовок', 'Тестовый текст с ссылками допустим'),
       (DEFAULT, 2, 'INFO', 'Тестовый заголовок asdasdasd', 'Тестовый текст с ссылками допустим bems bems');

insert into task
values (DEFAULT, 1, 'LAB', 'Лабораторна робота №1', 'Завдання до лабораторної роботи викладено в файлі', '2024-02-13'::date),
       (DEFAULT, 1, 'LAB', 'Лабораторна робота №2', 'Текст лабораторної роботи', '2024-02-23'::date),
       (DEFAULT, 1, 'LAB', 'Лабораторна робота №3', 'Текст лабораторної роботи', '2024-03-03'::date);

insert into graded_task
values (4, 20, '2024-02-22 23:30:00'),
       (5, 20, '2024-03-02 23:30:00'),
       (6, 20, '2024-03-13 23:30:00');

insert into schedule
values (DEFAULT, 1, 2, 2, 2, 'LECTURE'),
       (DEFAULT, 1, 2, 2, 3, 'PRACTICAL'),
       (DEFAULT, 1, 2, 2, 4, 'PRACTICAL'),
       (DEFAULT, 2, 1, 1, 1, 'LECTURE'),
       (DEFAULT, 2, 1, 1, 2, 'PRACTICAL'),
       (DEFAULT, 2, 1, 1, 3, 'PRACTICAL'),
       (DEFAULT, 2, 3, 3, 2, 'LECTURE'),
       (DEFAULT, 2, 3, 3, 3, 'PRACTICAL');

insert into file
    values (DEFAULT, 'https://lightclass-diploma-bucket.s3.eu-north-1.amazonaws.com/sys_anal_prac_lab1.docx', 'sys_anal_prac_lab1.docx', 'docx', DEFAULT);

insert into task_file
values (4, 1);

insert into score
values (4, 7, 2, 15);

insert into chat
values (DEFAULT, 4, 7, 7, DEFAULT, 'Чи обов`язково виконувати третє завдання?'),
       (DEFAULT, 4, 7, 2, DEFAULT, 'Ні, воно за додаткові бали');


