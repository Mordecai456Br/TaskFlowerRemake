import express from 'express';
import { desc, eq, ilike, and } from 'drizzle-orm';
import { projects, tags, tagTypes } from '../database/schema';
import { projectTags } from '../database/schema';
import { neonDatabase } from '../database';

const router = express.Router();


router.post('/', async(req, res) => {
    try {
        const { projectId, tagId } = req.body;
        if (!projectId) {
            return res.status(400).json({ error: 'projectId is required' });
        }
        if (!tagId) {
            return res.status(400).json({ error: 'tagId is required' });
        }

        const [findProject, findTag] = await Promise.all([
            neonDatabase
            .select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .limit(1), 
            neonDatabase
            .select()
            .from(tags)
            .where(eq(tags.id, tagId))
            .limit(1)
        ]);

        const resultProject = findProject[0];
        const resultTag = findTag[0];

        if (!resultProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (!resultTag) {
            return res.status(404).json({ error: 'Tag type not found' });
        }

        const [newProjectTag] = await neonDatabase
            .insert(projectTags)
            .values({
                projectId: projectId,
                tagId: tagId
            })
            .onConflictDoNothing()
            .returning();
        if (!newProjectTag) {
            return res.status(409).json({ error: 'Project Tag already exists' });
        }
        return res.status(201).json(newProjectTag);
     } catch {
        res.status(500).json()
    }
    
})


export default router;