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
    CONSTRAINT answers_chat_fkey FOREIGN KEY (chat)
        REFERENCES users (chat_id),
    CONSTRAINT answers_poll_fkey FOREIGN KEY (poll)
        REFERENCES polls (poll_id)
        ON DELETE CASCADE
);

