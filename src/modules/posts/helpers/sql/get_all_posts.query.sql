SELECT
    json_build_object(
        'refId', p.ref_id,
        'title', p.title,
        'description', p.description,
        --'status', p.status,
        --'priority', p.priority,
        'isPublic', p.is_public,
        --'isVerified', p.is_verified,
        --'isEdited', p.is_edited,
        'meta', p.meta,
        --'updatedAt', p.updated_at,
        'customerDetails', json_build_object(
            'name', c.name
        ),
        'brandDetails', json_build_object(
            'name', b.display_name,
            'logoUrl', b.logo_url
        ),
        'attachments', COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'refId', pa.ref_id,
                        'fileUrl', pa.file_url,
                        'fileType', pa.file_type,
                        'isPublic', pa.is_public
                    )
                )
                FROM post_attachments pa
                WHERE pa.post_id = p.id AND pa.is_deleted = false
            ),
            '[]'::json
        )
    ) AS post
FROM
    posts p
LEFT JOIN
    customers c ON c.id = p.customer_id
LEFT JOIN
    brands b ON b.id = p.brand_id
ORDER BY
    p.updated_at DESC
