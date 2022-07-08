create table intents
(
    paymentIntent_id varchar(255)  not null
        primary key,
    status           int default 0 not null,
    customer_id      varchar(255)  not null,
    constraint intents_paymentIntent_id_uindex
        unique (paymentIntent_id)
);

INSERT INTO hardgaming.intents (paymentIntent_id, status, customer_id) VALUES ('pi_3L5FoQGLO8h1ns7m0eNPyxn8', 0, 'cus_LmjLWqZkqmP6le');
INSERT INTO hardgaming.intents (paymentIntent_id, status, customer_id) VALUES ('pi_3L5FpkGLO8h1ns7m0sJKLfhP', 0, 'cus_LmjLWqZkqmP6le');
