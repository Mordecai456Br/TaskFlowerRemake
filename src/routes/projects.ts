import express from 'express';
import {and, count, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {categoriesOfProject, projects, projectTags} from "../database/schema";
import {neonDatabase} from "../database";
import {formatQueryString} from "./helpers/queryStringFormater";
import { neon } from '@neondatabase/serverless';

const router = express.Router();

router.get('/', async (req, res) => {
        try {
            const {search, category, tags, page = 1, limit = 10} = req.query;

            const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
            const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

            const offset = (currentPage - 1) * limitPerPage;

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

            const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;


            const countResult = await neonDatabase
                .select({count: sql<number>`count(*)`})
                .from(projects)
                .leftJoin(categoriesOfProject, eq(projects.categoryId, categoriesOfProject.id))
                .where(whereClause);

            const totalCount = Number(countResult[0]?.count ?? 0);

            const projectsList = await neonDatabase.select({
                ...getTableColumns(projects),
                category: {...getTableColumns(categoriesOfProject)}
            }).from(projects).leftJoin(categoriesOfProject, eq(projects.categoryId, categoriesOfProject.id))
                .where(whereClause)
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

// router.post('/', async (req, res) => {  
//     try {
//         const { title, description, categoryId, mediaUrl, githubUrl, createdByUser, tagIds } = req.body;

//         if (!title || !description || !categoryId || !createdByUser) { 
//             res.status(400).json({ error: 'Missing required fields: title, description, categoryId, createdByUser' });
//             return;
//         }
//         const result = await neonDatabase.transaction(async (transc) => {
//             const [newProject] = await transc.insert(projects).values({
//                 title,
//                 description,
//                 categoryId,
//                 mediaUrl,
//                 githubUrl,
//                 createdByUser
//             }).returning();
//             await transc.insert(projectTags).values(
//                 tagIds.map((tagId: number) => ({
//                     projectId: newProject.id,
//                     tagId
//                 }))
//             );
//             return newProject;
//         }); 
//     }

// });

export default router;