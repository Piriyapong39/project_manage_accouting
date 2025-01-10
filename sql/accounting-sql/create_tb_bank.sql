-- Table: public.tb_bank

-- DROP TABLE IF EXISTS public.tb_bank;

CREATE TABLE IF NOT EXISTS public.tb_bank
(
    id bigint NOT NULL,
    bank_name text COLLATE pg_catalog."default" NOT NULL,
    bank_status boolean NOT NULL DEFAULT true,
    CONSTRAINT tb_bank_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tb_bank
    OWNER to myuser;