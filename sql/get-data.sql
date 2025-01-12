SELECT 
	tt.transaction_id,
	tt.note,
	tt.transaction_type,
	tt.transaction_sub_type,
	tt.amount,
	tt.accounting_id,
	tt.created_at,
	ta.bank_id,
	ta.balance,
	tb.bank_name
FROM tb_transactions tt
INNER JOIN tb_accounting ta ON tt.accounting_id = ta.id
INNER JOIN tb_bank tb ON ta.bank_id = tb.id
INNER JOIN tb_transaction_type ttype
WHERE 1=1
	-- AND created_at BETWEEN '2025-01-12 10:00' AND '2025-01-12 12:00'
    AND ta.user_id = 17
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;