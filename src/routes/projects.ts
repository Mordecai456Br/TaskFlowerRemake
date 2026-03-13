import express from 'express';
import {and, count, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {categoriesOfProject, projects, projectTags, tags} from "../database/schema";
import {neonDatabase} from "../database";
import {formatQueryString} from "./helpers/queryStringFormater";
import { neon } from '@neondatabase/serverless';

const router = express.Router();

router.get('/', async (req, res) => {
        try {
            const {search, category, tagsQuery, matchAllTags = 'false', page = 1, limit = 10} = req.query;

            const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
            const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

            const offset = (currentPage - 1) * limitPerPage;

            const requireAllTags = String(matchAllTags).toLowerCase() === 'true';

            const filterConditions = [];
            if (search) {


                filterConditions.push(
                    or(
                        ilike(projects.title, `%${search}%`),
                        ilike(projects.description, `%${search}%`)
                    )
                );


            }

            const normalizedCategory = formatQueryString(category)
            if (normalizedCategory) {
                filterConditions.push(
                    ilike(categoriesOfProject.name, `%${normalizedCategory}%`),
                );
            }

            const normalizedTags = formatQueryString(tagsQuery)?.split(",") ?? [];

            if (normalizedTags.length) {

                if (requireAllTags) {

                    // MATCH ALL TAGS
                    filterConditions.push(
                        sql`EXISTS (
                SELECT 1
                FROM
                        ${projectTags}
                        INNER
                        JOIN
                        ${tags}
                        ON
                        ${tags.id}
                        =
                        ${projectTags.tagId}
                        WHERE
                        ${projectTags.projectId}
                        =
                        ${projects.id}
                        AND
                        ${tags.title}
                        IN
                        (
                        ${sql.join(normalizedTags.map(t => sql`${t}`), sql`,`)}
                        )
                        GROUP
                        BY
                        ${projectTags.projectId}
                        HAVING
                        COUNT
                        (
                        DISTINCT
                        ${tags.title}
                        )
                        =
                        ${normalizedTags.length}
                        )`
                    );

                } else {

                    // MATCH ANY TAG
                    filterConditions.push(
                        sql`EXISTS (
                SELECT 1
                FROM
                        ${projectTags}
                        INNER
                        JOIN
                        ${tags}
                        ON
                        ${tags.id}
                        =
                        ${projectTags.tagId}
                        WHERE
                        ${projectTags.projectId}
                        =
                        ${projects.id}
                        AND
                        ${tags.title}
                        IN
                        (
                        ${sql.join(normalizedTags.map(t => sql`${t}`), sql`,`)}
                        )
                        )`
                    );

                }

            }

            const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

            const countResult = await neonDatabase
                .select({count: sql<number>`count(*)`})
                .from(projects)
                .leftJoin(categoriesOfProject, eq(projects.categoryId, categoriesOfProject.id))
                .where(whereClause);
            const totalCount = Number(countResult[0]?.count ?? 0);

            const projectsList = await neonDatabase.select({
                ...getTableColumns(projects),
                category: {...getTableColumns(categoriesOfProject)},
                tags: sql`
                    COALESCE(
            json_agg(
                DISTINCT jsonb_build_object(
                    'id',
                    ${tags.id},
                    'name',
                    ${tags.title}
                    )
                    )
                    FILTER
                    (
                    WHERE
                    ${tags.id}
                    IS
                    NOT
                    NULL
                    ),
                    '[]'
                    )
                `
            }).from(projects)
                .leftJoin(categoriesOfProject, eq(projects.categoryId, categoriesOfProject.id))
                .leftJoin(projectTags, eq(projectTags.projectId, projects.id))
                .leftJoin(tags, eq(tags.id, projectTags.tagId))
                .where(whereClause)
                .groupBy(projects.id, categoriesOfProject.id)
                .orderBy(desc(projects.created_at))
                .limit(limitPerPage)
                .offset(offset);

            res.status(200).json({
                data: projectsList,
                pagination: {
                    page: currentPage,
                    limit: limitPerPage,
                    total: totalCount,
                    totalPages: Math.ceil(Number(totalCount) / limitPerPage),
                }
            });
        } catch (error) {
            console.error(`GET /projects error: ${error}`);
            res.status(500).json({error: 'Failed to get projects'});
        }
    }
);

router.post('/', async (req, res) => {  
    try {

        const {title, description, categoryId, mediaUrl, githubUrl, createdByUser} = req.body;

        if (!title && description && categoryId && createdByUser) {
            return res.status(400).json({ error: 'Is required: title, description, categoryId, createdByUser'});
        }

        
        const [findCreatedByUserTitle, findCategoryId] = await Promise.all([
            neonDatabase
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.createdByUser, createdByUser),
                    eq(projects.title, title)
                ))
            .limit(1),
            neonDatabase
            .select()
            .from(categoriesOfProject)
            .where(eq(categoriesOfProject.id, categoryId))
            .limit(1)
        ]);

        const isSameTitle = findCreatedByUserTitle[0];
        const resultCategory = findCategoryId[0];

        if (isSameTitle) {
            return res.status(409).json();
        }
        if (!resultCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const [newProject] = await neonDatabase 
            .insert(projects)
            .values({
                title: title,
                description: description,
                categoryId: categoryId,
                mediaUrl: mediaUrl,
                githubUrl: githubUrl,
                createdByUser: createdByUser
            })
            .onConflictDoNothing()
            .returning();
        if (!newProject) {
            return res.status(409).json({ error: `You already created a project with the title '${title}'` });
        }
        return res.status(201).json(newProject);
    } catch {
        res.status(500).json()
    }        
});

export default router;