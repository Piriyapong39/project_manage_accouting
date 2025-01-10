CREATE TABLE public.tb_users
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    email text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.tb_users
    OWNER to myuser;