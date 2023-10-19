-- This query pulls chat transcripts from the chat table.
-- Input values:
--      prod_project_id : The GCP ID for the production project
--      prod_db         : The name of the production BigQuery database
--      chats_table     : The name of the table holding the chats
--      messages_table  : The name of the table holding the messages
--      users_table     : The name of the table holding the users
--
-- 2023-10-19 (modified 2023-10-19)

SELECT
  t1.`type` AS role,
  t1.readable_content,
  t1.created_at AS message_created_at,
  t0.subject,
  t0.user_id,
  IF(CONTAINS_SUBSTR(t2.email, '@judie'), true, false) is_judie,
  t1.id AS message_id,
  t0.id AS chat_id,
  t0.created_at chat_created_at
FROM
    `{{ params.prod_project_id }}.{{ params.prod_db }}.{{ params.chats_table }}` t0
INNER JOIN
    `{{ params.prod_project_id }}.{{ params.prod_db }}.{{ params.messages_table }}` t1
    ON t0.id = t1.chat_id
INNER JOIN
    `{{ params.prod_project_id }}.{{ params.prod_db }}.{{ params.users_table }}` t2
    ON t0.user_id = t2.id
ORDER BY t0.id, t1.created_at
;
