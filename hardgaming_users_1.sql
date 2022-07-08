create table users
(
    id         int auto_increment
        primary key,
    username   varchar(255)  not null,
    email      varchar(255)  not null,
    password   varchar(255)  not null,
    first      varchar(255)  not null,
    last       varchar(255)  null,
    perm_level int default 0 not null,
    stripe_id  varchar(255)  not null,
    constraint users_email_uindex
        unique (email),
    constraint users_id_uindex
        unique (id),
    constraint users_username_uindex
        unique (username)
);

INSERT INTO hardgaming.users (id, username, email, password, first, last, perm_level, stripe_id) VALUES (7, 'jafesu', 'zeke@ezekielj.me', '5b81723d8d0ddee8d0e0dc2d724a4edc', 'Ezekiel', 'Hammond', 3, 'cus_LmjLWqZkqmP6le');
