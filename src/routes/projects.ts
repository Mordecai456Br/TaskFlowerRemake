import express from 'express';
import {and, count, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {categoriesOfProject, projects, projectTags, tags} from "../database/schema";
import {neonDatabase} from "../database";
import {formatQueryString} from "./helpers/queryStringFormater";

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

            const normalizedTags = formatQueryString(tagsQuery)?.split(",")
                .map(Number)
                .filter(Boolean)?? [];

            if (normalizedTags.length) {

                if (requireAllTags) {

                    // MATCH ALL TAGS
                    filterConditions.push(
                        sql`EXISTS (
                        SELECT ${projectTags.projectId}
                        FROM ${projectTags}
                        WHERE ${projectTags.projectId} = ${projects.id}
                        AND ${projectTags.tagId} IN (${sql.join(normalizedTags.map(tag => sql`${tag}`), sql`,`)})
                        GROUP BY ${projectTags.projectId}
                        HAVING COUNT(DISTINCT ${projectTags.tagId}) = ${normalizedTags.length}
    )`
                    );


                } else {

                    // MATCH ANY TAG
                    filterConditions.push(
                        sql`EXISTS(
                        SELECT * FROM
                        ${projectTags}
                        WHERE
                        ${projectTags.projectId}
                        =
                        ${projects.id}
                        AND
                        ${projectTags.tagId}
                        IN
                        (
                        ${sql.join(normalizedTags.map(tag => sql`${tag}`), sql`,`)}
                        )
                        )`
                    )
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

        let {title, description, categoryId, mediaUrl, githubUrl, createdByUser} = req.body;
        if (!createdByUser) {
            createdByUser = "eoeynEzL08LY5R6XUrz16xq3LnN7RnVX";
        }
        if (!title || !description || !categoryId) {
            return res.status(400).json({ error: 'Is required: title, description, categoryId, createdByUser'});
        }

        categoryId = Number(categoryId);
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
                categoryId: Number(categoryId),
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
    } catch (error) {
        console.error("ERRO NO POST /projects:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {id}  = req.params;
        const projectId = Number(id);
        const { title, description, categoryId, mediaUrl, githubUrl, isPinned, isPublic } = req.body;
        const [updatedProject] = await neonDatabase
            .update(projects)
            .set({
                title,
                description,
                categoryId,
                mediaUrl,
                githubUrl,
                isPinned,
                isPublic
            })
            .where(eq(projects.id, projectId))
            .returning();
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(updatedProject);

    } catch {
        res.status(500).json({ error: 'Failed to update project' });
    }
}); 

router.get('/:id/tag', async (req, res) => {
    try {
        const { id } = req.params;
        const projectId = Number(id);
        if (!projectId) {
            return res.status(400).json({ error: 'Invalid project ID format' });
        }
        const projectTagsList = await neonDatabase
            .select({
                id: tags.id,
                title: tags.title,
            })
            .from(tags)
            .leftJoin(projectTags, eq(tags.id, projectTags.tagId))
            .where(eq(projectTags.projectId, projectId));
        return res.status(200).json(projectTagsList);
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags for this project' });
    }
});

export default router;