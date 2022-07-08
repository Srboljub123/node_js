create table perms
(
    id   int auto_increment
        primary key,
    name varchar(255) not null,
    constraint perms_id_uindex
        unique (id),
    constraint perms_name_uindex
        unique (name)
);

INSERT INTO hardgaming.perms (id, name) VALUES (2, 'Admin');
INSERT INTO hardgaming.perms (id, name) VALUES (3, 'GOD');
INSERT INTO hardgaming.perms (id, name) VALUES (1, 'Mod');
INSERT INTO hardgaming.perms (id, name) VALUES (0, 'Unauthorized');
