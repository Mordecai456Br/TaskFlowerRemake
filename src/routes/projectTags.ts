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
    
});

router.get('/project=:id/tags', async (req, res) => {
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
            .rightJoin(projectTags, eq(tags.id, projectTags.tagId))
            .where(eq(projectTags.projectId, projectId));
        return res.status(200).json(projectTagsList);
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags for this project' });
    }
});

router.get('/', async (req, res) => {
    try {
        const findProjectTags = await neonDatabase
            .select()
            .from(projectTags)
        const result = findProjectTags;
        return res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags for this project' });
    }
});


export default router;