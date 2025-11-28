-- Migration: Convert to Rich Text Fields
-- Date: 2025-11-28
-- Description: 
-- 将以下字段从纯文本转换为富文本（HTML）格式：
-- 1. summary (个人简介)
-- 2. experiences.description (工作描述)
-- 3. experiences.achievements (从 string[] 改为 string 富文本)
-- 4. projects.description (项目描述)
-- 5. projects.highlights (项目亮点)

-- Note: 
-- 1. 由于数据存储为 JSON 字符串，数据库结构无需修改
-- 2. achievements 字段类型从 string[] 改为 string
-- 3. 旧数据会自动兼容显示（纯文本会被当作HTML显示）
-- 4. 如需迁移旧数据，可以将纯文本包装在 <p> 标签中

-- 可选：将现有纯文本数据转换为 HTML 格式
-- 此脚本将纯文本包装在 <p> 标签中，将 achievements 数组转换为 HTML 列表

UPDATE Profile 
SET experiences = (
  SELECT json_group_array(
    json_object(
      'id', json_extract(value, '$.id'),
      'company', json_extract(value, '$.company'),
      'position', json_extract(value, '$.position'),
      'startDate', json_extract(value, '$.startDate'),
      'endDate', json_extract(value, '$.endDate'),
      'current', json_extract(value, '$.current'),
      'description', '<p>' || COALESCE(json_extract(value, '$.description'), '') || '</p>',
      'achievements', (
        CASE 
          WHEN json_type(json_extract(value, '$.achievements')) = 'array' 
          THEN (
            '<ul>' || 
            (SELECT group_concat('<li>' || json_extract(h.value, '$') || '</li>', '')
             FROM json_each(json_extract(value, '$.achievements')) h) ||
            '</ul>'
          )
          ELSE COALESCE(json_extract(value, '$.achievements'), '')
        END
      ),
      'technologies', json_extract(value, '$.technologies')
    )
  )
  FROM json_each(experiences)
)
WHERE experiences IS NOT NULL AND experiences != '[]';

UPDATE Profile 
SET projects = (
  SELECT json_group_array(
    json_object(
      'id', json_extract(value, '$.id'),
      'name', json_extract(value, '$.name'),
      'description', '<p>' || COALESCE(json_extract(value, '$.description'), '') || '</p>',
      'role', json_extract(value, '$.role'),
      'startDate', json_extract(value, '$.startDate'),
      'endDate', json_extract(value, '$.endDate'),
      'technologies', json_extract(value, '$.technologies'),
      'url', json_extract(value, '$.url'),
      'highlights', CASE 
        WHEN json_extract(value, '$.highlights') IS NOT NULL 
        THEN '<p>' || json_extract(value, '$.highlights') || '</p>'
        ELSE NULL
      END
    )
  )
  FROM json_each(projects)
)
WHERE projects IS NOT NULL AND projects != '[]';

UPDATE Profile
SET summary = '<p>' || COALESCE(summary, '') || '</p>'
WHERE summary IS NOT NULL AND summary != '';
