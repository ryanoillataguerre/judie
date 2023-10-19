-- This query pulls basic statistics from the users table.
-- Input values:
--      prod_project_id : The GCP ID for the production project
--      prod_db         : The name of the production BigQuery database
--      users_table     : The name of the table holding the users
--
-- 2023-10-16 (modified 2023-10-16)

SELECT
    COUNT(*) n_rows,
    COUNT(DISTINCT id) n_users,
    SUM(CASE WHEN last_message_at IS NOT NULL THEN 1 ELSE 0 END) n_active_users,
    ROUND(AVG(questions_asked), 2) avg_questions
FROM
    `{{ params.prod_project_id }}.{{ params.prod_db }}.{{ params.users_table }}`
;
