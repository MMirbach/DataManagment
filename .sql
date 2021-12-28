CREATE TABLE admins
(
    admin_name character varying(64) NOT NULL,
    password character varying(64) NOT NULL,
    CONSTRAINT admins_pkey PRIMARY KEY (admin_name)
);

CREATE TABLE users
(
    chat_id character varying(64) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (chat_id)
);

CREATE TABLE polls
(
    poll_id character varying(64) NOT NULL,
    poll_question character varying(300) NOT NULL,
    poll_answers character varying(100)[]  NOT NULL,
    CONSTRAINT polls_pkey PRIMARY KEY (poll_id)
);

CREATE TABLE answers
(
    chat character varying(64) NOT NULL,
    poll character varying(64) NOT NULL,
    answer_index integer,
    CONSTRAINT answers_pkey PRIMARY KEY (chat, poll),
    CONSTRAINT answers_poll_fkey FOREIGN KEY (poll)
        REFERENCES polls (poll_id)
        ON DELETE CASCADE
);

CREATE TABLE pollmapping
(
    telegram_poll_id character varying(64) NOT NULL,
    poll_id integer NOT NULL,
    CONSTRAINT pollmapping_pkey PRIMARY KEY (telegram_poll_id),
    CONSTRAINT pollmapping_poll_id_fkey FOREIGN KEY (poll_id)
        REFERENCES public.polls (poll_id) MATCH SIMPLE
        ON DELETE CASCADE
)

