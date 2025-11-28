-- Migration: Fields Update
-- Date: 2025-11-28
-- Description: 
-- 1. phone: 从可选改为必填（应用层强制验证）
-- 2. Certification: 移除 issuer 字段
-- 3. Project: 移除 github 字段，highlights 从 string[] 改为 string
-- 4. 教育背景标题：改为"最高学历背景"（仅UI层面）
-- 5. 英文名标签：改为"英文名/拼音"（仅UI层面）

-- Note: 由于所有数据存储为 JSON 字符串，数据库结构无需修改
-- 以下为可选的数据清理脚本，用于清理旧字段数据

-- 1. 清理 certifications 中的 issuer 字段
UPDATE Profile 
SET certifications = (
  SELECT json_group_array(
    json_object(
      'id', json_extract(value, '$.id'),
      'name', json_extract(value, '$.name'),
      'date', json_extract(value, '$.date'),
      'url', json_extract(value, '$.url')
    )
  )
  FROM json_each(certifications)
)
WHERE certifications IS NOT NULL AND certifications != '[]';

-- 2. 清理 projects 中的 github 字段，并将 highlights 数组转为字符串
UPDATE Profile 
SET projects = (
  SELECT json_group_array(
    json_object(
      'id', json_extract(value, '$.id'),
      'name', json_extract(value, '$.name'),
      'description', json_extract(value, '$.description'),
      'role', json_extract(value, '$.role'),
      'startDate', json_extract(value, '$.startDate'),
      'endDate', json_extract(value, '$.endDate'),
      'technologies', json_extract(value, '$.technologies'),
      'url', json_extract(value, '$.url'),
      'highlights', CASE 
        WHEN json_type(json_extract(value, '$.highlights')) = 'array' 
        THEN (
          SELECT group_concat(json_extract(h.value, '$'), char(10))
          FROM json_each(json_extract(value, '$.highlights')) h
        )
        ELSE json_extract(value, '$.highlights')
      END
    )
  )
  FROM json_each(projects)
)
WHERE projects IS NOT NULL AND projects != '[]';

-- 3. 将 education 从数组格式转为单个对象（如果是数组）
UPDATE Profile 
SET education = json_extract(education, '$[0]') 
WHERE education IS NOT NULL 
  AND education != '[]' 
  AND json_type(education) = 'array';
