# 表的设计

一、用户表

| **字段** | **类型** | **说明** |  | **默认值** | **索引？** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| uid | int\(11\) | id | 唯一递增 |  | 是 |
| role | tinyint\(1\) | 角色标识 | 0：管理员 1：老师 2：学生 |  |  |
| username | varchar\(10\) | 用户名 | 唯一 |  |  |
| password | varchar\(16\) | 密码 |  |  |  |
| salt | char\(4\) | 加密随机码 | 随机 |  |  |
| real\_name | varchar\(100\) | 真实姓名 |  |  |  |
| sex | tinyint\(1\) | 性别 | 0：未设置 1：男 2：女 | 0 |  |
| department | varchar\(20\) | 所属院系 |  |  |  |
| class | varchar\(10\) | 所属班级 |  |  |  |
| created | int\(11\) | 创建时间 |  |  |  |
| modified | int\(11\) | 修改时间 |  |  |  |

    create table if not exists user(
        `uid` int(11) not null auto_increment comment '用户id',
        `role` tinyint(1) not null comment '角色标识：0管理员，1老师，2学生',
        `username` varchar(10) not null comment '用户名',
        `password` varchar(16) not null comment '密码',
        `salt` char(4) default null comment '加密随机码',
        `real_name` varchar(100) comment '真实姓名',
        `sex` tinyint(1) default 1 comment '性别',
        `department` varchar(20) comment '所属院系',
        `class` varchar(10) comment '所属班级',
        `created` int(11) not null comment '用户账号创建时间',
        `modified` int(11) not null comment '用户账号修改时间',
        primary key (`uid`),
        UNIQUE key `unique_username` (`username`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

**二、院系表**

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

**三、班级表**

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

**四、科目表**

| **字段** | **类型** | **说明** |  | **默认值** | **索引？** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| s\_id | int | id | 唯一递增 |  | 是 |
| name | string | 科目名称 |  |  |  |

    create table if not exists subject(
        `s_id` int(11) not null auto_increment comment '科目id',
        `name` varchar(255) comment '科目名称',
        primary key (`s_id`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8



