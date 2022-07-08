create table visitor_data
(
    id         int auto_increment
        primary key,
    count      int default 0 not null,
    ip_address varchar(255)  not null,
    country    varchar(255)  null,
    last_visit datetime      null,
    constraint visitor_data_id_uindex
        unique (id),
    constraint visitor_data_ip_address_uindex
        unique (ip_address)
);

INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (1, 1, '174.246.194.202', 'US', '2022-05-14 12:05:51');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (2, 6, '99.46.79.143', 'US', '2022-05-30 11:21:02');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (3, 0, '99.46.79.144', 'Russia', '2022-05-14 12:38:12');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (4, 0, '99.46.79.145', 'Russia', '2022-05-14 12:38:12');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (5, 0, '99.46.79.146', 'Russia', '2022-05-14 12:38:12');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (6, 0, '99.46.79.147', 'China', '2022-05-14 12:38:12');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (7, 4, '70.114.163.40', 'US', '2022-05-30 16:26:33');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (8, 1, '35.237.4.214', 'US', '2022-05-30 11:18:32');
INSERT INTO hardgaming.visitor_data (id, count, ip_address, country, last_visit) VALUES (9, 3, '99.64.96.219', 'US', '2022-05-30 11:18:49');
