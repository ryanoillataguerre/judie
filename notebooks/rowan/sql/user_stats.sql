-- This query pulls basic statistics from the users table.
-- 2023-10-16 (modified 2023-10-16)

SELECT
    COUNT(*) n_rows,
    COUNT(DISTINCT id) n_users
FROM
    `{{ params.prod_project_id }}.{{ params.prod_db }}.{{ params.users_table }}`
;
