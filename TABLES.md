| table_name      | column_name          | data_type                | is_nullable | column_default             |
| --------------- | -------------------- | ------------------------ | ----------- | -------------------------- |
| admin_roles     | id                   | uuid                     | NO          | gen_random_uuid()          |
| admin_roles     | email                | text                     | NO          | null                       |
| admin_roles     | is_admin             | boolean                  | YES         | false                      |
| admin_roles     | created_at           | timestamp with time zone | YES         | now()                      |
| admin_roles     | updated_at           | timestamp with time zone | YES         | now()                      |
| analyses        | id                   | uuid                     | NO          | uuid_generate_v4()         |
| analyses        | assessment_id        | uuid                     | NO          | null                       |
| analyses        | user_id              | uuid                     | NO          | null                       |
| analyses        | status               | USER-DEFINED             | NO          | 'pending'::analysis_status |
| analyses        | overall_risk_score   | numeric                  | YES         | null                       |
| analyses        | business_risk_score  | numeric                  | YES         | null                       |
| analyses        | financial_risk_score | numeric                  | YES         | null                       |
| analyses        | market_risk_score    | numeric                  | YES         | null                       |
| analyses        | swot_risk_score      | numeric                  | YES         | null                       |
| analyses        | analysis_content     | jsonb                    | NO          | null                       |
| analyses        | pdf_url              | text                     | YES         | null                       |
| analyses        | created_at           | timestamp with time zone | NO          | now()                      |
| analyses        | updated_at           | timestamp with time zone | NO          | now()                      |
| analyses        | error_message        | text                     | YES         | null                       |
| assessment_data | id                   | uuid                     | NO          | uuid_generate_v4()         |
| assessment_data | assessment_id        | uuid                     | NO          | null                       |
| assessment_data | section              | text                     | NO          | null                       |
| assessment_data | data                 | jsonb                    | NO          | null                       |
| assessment_data | created_at           | timestamp with time zone | NO          | now()                      |
| assessment_data | updated_at           | timestamp with time zone | NO          | now()                      |
| assessments     | id                   | uuid                     | NO          | uuid_generate_v4()         |
| assessments     | user_id              | uuid                     | NO          | null                       |
| assessments     | business_name        | text                     | NO          | null                       |
| assessments     | status               | text                     | NO          | 'pending'::text            |
| assessments     | summary              | text                     | YES         | null                       |
| assessments     | report_url           | text                     | YES         | null                       |
| assessments     | created_at           | timestamp with time zone | NO          | now()                      |
| assessments     | updated_at           | timestamp with time zone | NO          | now()                      |
| files           | id                   | uuid                     | NO          | uuid_generate_v4()         |
| files           | assessment_id        | uuid                     | NO          | null                       |
| files           | file_name            | text                     | NO          | null                       |
| files           | file_url             | text                     | NO          | null                       |
| files           | file_type            | text                     | NO          | null                       |
| files           | file_size            | bigint                   | NO          | null                       |
| files           | file_category        | text                     | NO          | null                       |
| files           | created_at           | timestamp with time zone | NO          | now()                      |
| pages           | id                   | uuid                     | NO          | gen_random_uuid()          |
| pages           | title                | text                     | NO          | null                       |
| pages           | slug                 | text                     | NO          | null                       |
| pages           | content              | text                     | NO          | null                       |
| pages           | meta_description     | text                     | YES         | null                       |
| pages           | is_published         | boolean                  | YES         | false                      |
| pages           | created_by           | uuid                     | YES         | null                       |
| pages           | created_at           | timestamp with time zone | YES         | now()                      |
| pages           | updated_at           | timestamp with time zone | YES         | now()                      |
| profiles        | id                   | uuid                     | NO          | null                       |
| profiles        | email                | text                     | NO          | null                       |
| profiles        | full_name            | text                     | YES         | null                       |
| profiles        | avatar_url           | text                     | YES         | null                       |
| profiles        | created_at           | timestamp with time zone | NO          | now()                      |
| profiles        | updated_at           | timestamp with time zone | NO          | now()                      |
| profiles        | age                  | integer                  | YES         | null                       |
| profiles        | location             | text                     | YES         | null                       |
| profiles        | marital_status       | text                     | YES         | null                       |
| profiles        | mobile_phone         | text                     | YES         | null                       |
| profiles        | occupation           | text                     | YES         | null                       |
| profiles        | self_introduction    | text                     | YES         | null                       |
| profiles        | life_experience      | text                     | YES         | null                       |
| profiles        | motivation           | text                     | YES         | null                       |
| profiles        | financial_capability | text                     | YES         | null                       |
| profiles        | five_year_goals      | text                     | YES         | null                       |
| profiles        | subscription         | text                     | YES         | 'חינם'::text               |