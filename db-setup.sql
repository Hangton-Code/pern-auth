-- uuid modules
CREATE EXTENSION "uuid-ossp";

-- users table
CREATE TABLE public.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying(998) NOT NULL,
    password character varying(60),
    refresh_token character varying[] DEFAULT '{}'::character varying[],
    user_name character varying(30) NOT NULL DEFAULT (substr(md5(((random())::character varying)::text), 0, 15))::character varying,
    user_avatar_type integer NOT NULL DEFAULT 0,
    user_avatar_content text,
    signuped_at date NOT NULL DEFAULT now(),
    provider integer NOT NULL
);

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;