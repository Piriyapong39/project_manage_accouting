-- Table: public.tb_accounting

-- DROP TABLE IF EXISTS public.tb_accounting;

CREATE TABLE IF NOT EXISTS public.tb_accounting
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    bank_id bigint NOT NULL,
    user_id bigint NOT NULL,
    balance numeric(18,2) NOT NULL DEFAULT 0.00,
    created_at time with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at time with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tb_accounting_pkey PRIMARY KEY (id),
    CONSTRAINT bank_id FOREIGN KEY (bank_id)
        REFERENCES public.tb_bank (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.tb_users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tb_accounting
    OWNER to myuser;

COMMENT ON COLUMN public.tb_accounting.bank_id
    IS 'foreign key from tb_bank';