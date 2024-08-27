DROP TABLE if exists chat;
DROP TABLE if exists refresh_token;
DROP TABLE if exists student_task_file;
DROP TABLE if exists task_file;
DROP TABLE if exists file;
DROP TABLE if exists schedule;
DROP TABLE if exists score;
DROP TABLE if exists graded_task;
DROP TABLE if exists task;
DROP TABLE if exists subject_teachers;
DROP TABLE if exists subject_study_group;
DROP TABLE if exists subject;
DROP TABLE if exists student;
DROP TABLE if exists teacher;
DROP TABLE if exists study_group;
DROP TABLE if exists department_major;

DROP TABLE if exists major;
DROP TABLE if exists department;
DROP TABLE if exists faculty;



DROP TABLE if exists personal_data;
DROP TABLE if exists member;


DROP TYPE if exists role_type;
DROP TYPE if exists task_type;
DROP TYPE if exists class_type;

CREATE TYPE role_type AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE task_type AS ENUM ('INFO', 'LAB', 'MODULAR');
CREATE TYPE class_type AS ENUM ('LECTURE', 'PRACTICAL');

CREATE TABLE member
(
    member_id     SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255)        NOT NULL,
    role          role_type           NOT NULL DEFAULT ('STUDENT'),
    CONSTRAINT proper_email CHECK ( email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' )
);

CREATE TABLE personal_data
(
    data_id    SERIAL PRIMARY KEY,
    member     INTEGER      NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255),
    FOREIGN KEY (member) REFERENCES member (member_id) ON DELETE CASCADE
);

CREATE TABLE faculty
(
    faculty_id SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE major
(
    major_id   INTEGER PRIMARY KEY,
    name       VARCHAR(255)                            NOT NULL,
    faculty_id INTEGER REFERENCES faculty (faculty_id) NOT NULL
);

CREATE TABLE study_group
(
    group_id      SERIAL PRIMARY KEY,
    name          VARCHAR(255)                        NOT NULL,
    major         INTEGER REFERENCES major (major_id) NOT NULL,
    year_of_study INTEGER                             NOT NULL CHECK (year_of_study BETWEEN 1 AND 6)
);

CREATE TABLE teacher
(
    teacher_id INTEGER PRIMARY KEY REFERENCES personal_data (data_id) ON DELETE CASCADE
);

CREATE TABLE student
(
    student_id INTEGER PRIMARY KEY REFERENCES personal_data (data_id) ON DELETE CASCADE,
    group_id   INTEGER REFERENCES study_group (group_id) NOT NULL
);

CREATE TABLE subject
(
    subject_id   SERIAL PRIMARY KEY,
    main_teacher INTEGER REFERENCES teacher (teacher_id),
    name         VARCHAR(255) NOT NULL
);

CREATE TABLE subject_study_group
(
    subject_id INTEGER REFERENCES subject (subject_id),
    group_id   INTEGER REFERENCES study_group (group_id),
    PRIMARY KEY (subject_id, group_id)
);

CREATE TABLE task
(
    task_id     SERIAL PRIMARY KEY,
    subject_id  INTEGER      NOT NULL REFERENCES subject (subject_id) ON DELETE CASCADE,
    task        task_type    NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    create_date TIMESTAMP    NOT NULL DEFAULT now()::timestamp
);

CREATE TABLE graded_task
(
    task_id   INTEGER PRIMARY KEY REFERENCES task (task_id) ON DELETE CASCADE,
    max_score INTEGER   NOT NULL CHECK (max_score BETWEEN 0 AND 100),
    date_to   TIMESTAMP NOT NULL
);

CREATE TABLE score
(
    task_id         INTEGER REFERENCES task (task_id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES student (student_id) ON DELETE CASCADE,
    teacher_id      INTEGER REFERENCES teacher (teacher_id) ON DELETE CASCADE,
    score_value     INTEGER   NOT NULL CHECK (score_value BETWEEN 0 AND 100),
    evaluation_date TIMESTAMP NOT NULL DEFAULT now()::timestamp,
    PRIMARY KEY (task_id, student_id)
);

CREATE TABLE schedule
(
    schedule_id SERIAL PRIMARY KEY,
    group_id    INTEGER    NOT NULL REFERENCES study_group (group_id),
    subject_id  INTEGER    NOT NULL REFERENCES subject (subject_id) ON DELETE CASCADE,
    day         INTEGER    NOT NULL CHECK (day BETWEEN 1 AND 6),
    number      INTEGER    NOT NULL CHECK (number BETWEEN 1 AND 6),
    class_type  class_type NOT NULL
);

CREATE TABLE file
(
    file_id       SERIAL PRIMARY KEY,
    link          TEXT         NOT NULL,
    filename      VARCHAR(255) NOT NULL,
    filetype      VARCHAR(255) NOT NULL,
    uploaded_date TIMESTAMP    NOT NULL DEFAULT now()::timestamp
);

CREATE TABLE task_file
(
    task_id INTEGER REFERENCES task (task_id) ON DELETE CASCADE,
    file_id INTEGER REFERENCES file (file_id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, file_id)
);

CREATE TABLE student_task_file
(
    student_id INTEGER REFERENCES student (student_id),
    task_id    INTEGER REFERENCES task (task_id) ON DELETE CASCADE,
    file_id    INTEGER REFERENCES file (file_id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, task_id, file_id)
);

CREATE TABLE refresh_token
(
    token_id    SERIAL PRIMARY KEY,
    token       TEXT                NOT NULL,
    username    VARCHAR(255) UNIQUE NOT NULL,
    expiry_date TIMESTAMP           NOT NULL
);

CREATE TABLE chat
(
    chat_id    SERIAL PRIMARY KEY,
    task_id    INTEGER REFERENCES task (task_id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES student (student_id) ON DELETE CASCADE,
    sender     INTEGER REFERENCES personal_data (data_id) ON DELETE CASCADE,
    sent_date  TIMESTAMP NOT NULL DEFAULT now()::timestamp,
    message    TEXT      NOT NULL
);
