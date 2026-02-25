import express from 'express';
import {and, count, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {categoriesOfProject, projects, projectTags} from "../database/schema";
import {neonDatabase} from "../database";
import {formatQueryString} from "./helpers/queryStringFormater";

const router = express.Router();

router.get('/', async (req, res) => {
        try {
            const {search, category, tags, page = 1, limit = 10} = req.query;

            const currentPage = Math.max(1, +page);
            const limitPerPage = Math.max(1, +limit);

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

export default router;