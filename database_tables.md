# 表的设计  

一、**老师表**

| **字段** | **类型** | **说明** |  | **默认值** | **索引？** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| u\_id | int | id | 唯一递增 |  | 是 |
| username | string | 用户名 | 唯一 |  |  |
| password | string | 密码 |  |  |  |
| salt | string | 加密随机码 | 随机 |  |  |
| real\_name | string | 真实姓名 |  |  |  |
| sex | int | 性别 | 0：女     1：男 | 0 |  |
| department | int | 所属院系 | （详见附表1） |  |  |

    create table if not exists user_teacher(
        `u_id` int(11) not null auto_increment comment '用户id',
        `username` varchar(255) comment '用户名',
        `password` varchar(512) comment '密码',
        `salt` char(4) default null comment '加密随机码',
        `real_name` varchar(255) comment '真实姓名',
        `sex` tinyint(1) default 0 comment '性别',
        `department` tinyint(2) comment '所属院系',
        primary key (`u_id`),
        UNIQUE key `unique_username` (`username`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

**二、学生表**

| **字段** | **类型** | **说明** |  | **默认值** | **索引？** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| s\_id | int | id | 唯一递增 |  | 是 |
| username | string | 用户名 | 唯一 |  |  |
| password | string | 密码 |  |  |  |
| salt | string | 加密随机码 | 随机 |  |  |
| real\_name | string | 真实姓名 |  |  |  |
| sex | int | 性别 | 0：女    1：男 | 0 |  |
| department | int | 所属院系 | （详见附表1） |  |  |
| class | string | 所属班级 |  |  |  |

    create table if not exists user_student(
        `s_id` int(11) not null auto_increment comment '用户id',
        `username` varchar(255) comment '用户名',
        `password` varchar(512) comment '密码',
        `salt` char(4) default null comment '加密随机码',
        `real_name` varchar(255) comment '真实姓名',
        `sex` tinyint(1) default 0 comment '性别',
        `department` tinyint(2) comment '所属院系',
        `class` varchar(255) comment '所属班级',
        primary key (`s_id`),
        UNIQUE key `unique_username` (`username`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

三**、院系表**

| **字段** | **类型** | **说明** |  | **默认值** | **索引？** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| d\_id | int | id | 唯一递增 |  | 是 |
| name | string | 院系名 | 唯一 |  |  |

    create table if not exists department(
        `d_id` int(11) not null auto_increment comment '院系id',
        `name` varchar(255) comment '院系名',
        primary key (`d_id`),
        UNIQUE key `unique_name` (`name`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

四**、班级表**

| **字段** | **类型** | **说明** |  | **默认值** | **索引？** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| c\_id | int | id | 唯一递增 |  | 是 |
| department | int | 所属院系 |  |  |  |
| class | string | 班级 |  |  |  |

    create table if not exists class(
        `c_id` int(11) not null auto_increment comment '班级id',
        `department` tinyint(2) comment '所属院系',
        `class` varchar(255) comment '班级',
        primary key (`c_id`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

附表1：

| 值 | 含义 |
| :--- | :--- |
| 1 | 经济与管理学院 |
| 2 | 电子商务学院 |
| 3 | 政法学院 |
| 4 | 文学与传媒学院 |
| 5 | 外国语学院 |
| 6 | 理学院 |
| 7 | 化学与环境工程学院 |
| 8 | 机械与材料工程学院 |
| 9 | 电子工程学院 |
| 10 | 信息科学与技术学院 |
| 11 | 土木工程与城市建设学院 |
| 12 | 艺术学院 |
| 13 | 药学与生命科学学院 |
| 14 | 基础医学院 |
| 15 | 会计学院 |
| 16 | 旅游与国土资源学院 |
| 17 | 体育学院 |
| 18 | 护理学院 |
| 19 | 临床医学院 |
| 20 | 继续教育学院 |
| 21 | 师范学院 |
| 22 | 国际交流学院 |
| 23 | 马克思主义学院 |



