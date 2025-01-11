-- Table: public.tb_transaction_type

-- DROP TABLE IF EXISTS public.tb_transaction_type;

CREATE TABLE IF NOT EXISTS public.tb_transaction_type
(
    transaction_type bigint NOT NULL,
    transaction_sub_type bigint NOT NULL,
    transaction_type_name text COLLATE pg_catalog."default" NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tb_transaction_type
    OWNER to myuser;

COMMENT ON COLUMN public.tb_transaction_type.transaction_type
    IS '1 = income
2 = expense';