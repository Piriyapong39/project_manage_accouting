-- Table: public.tb_transactions

-- DROP TABLE IF EXISTS public.tb_transactions;

CREATE TABLE IF NOT EXISTS public.tb_transactions
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    transaction_id text COLLATE pg_catalog."default" NOT NULL,
    note text COLLATE pg_catalog."default",
    transaction_type bigint NOT NULL,
    transaction_sub_type bigint NOT NULL,
    accounting_id bigint NOT NULL,
    amount numeric(18,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    transaction_slip_path text COLLATE pg_catalog."default",
    CONSTRAINT tb_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT accounting_id FOREIGN KEY (accounting_id)
        REFERENCES public.tb_accounting (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tb_transactions
    OWNER to myuser;

COMMENT ON COLUMN public.tb_transactions.transaction_type
    IS '1 = income
2 = expense';