import express from 'express';
import { and, asc, eq, ilike, or, sql } from 'drizzle-orm';
import { tags, tagTypes, projects, projectTags } from '../database/schema';
import { neonDatabase } from '../database';

const router = express.Router();


router.post('/', async (req, res) => {

    try {
        const { title, typeId, color, bgColor} = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Missing required fields: title, typeId' });
        }
        const findType =  await neonDatabase.select()
            .from(tagTypes)
            .where(eq(tagTypes.id, typeId))
            .limit(1);
        const result = findType[0];
        if (!result) {
            return res.status(400).json({ error: 'Tag type not found' });
        }
        const [newTag] = await neonDatabase
            .insert(tags)
            .values({
                title: title,
                typeId: typeId,
                color: color || '#ffffff',
                bgColor: bgColor || '#333333',
            })
            .returning();
        res.status(201).json(newTag);
    } catch {
        res.status(500).json();
    }

});

router.get('/', async (req, res) => {
    try {
        const findTag = await neonDatabase
            .select({
                id: tags.id,
                tagTitle: tags.title, 
                typeId: tagTypes.id,
                typeName: tagTypes.name})
            .from(tags)
            .leftJoin(tagTypes, eq(tags.typeId, tagTypes.id))
            .orderBy(asc(tags.title));
        const result = findTag;
        if(!result) {
            res.status(404).json({message: ""}) //colocar a mensagem aqui gabrelo;
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json();
    }
});


router.get('/:id/projects', async (req, res) => {
    try {
        const { id } = req.params;
        const tagId = Number(id);

        if (isNaN(tagId)) {
            return res.status(400).json({ error: 'Invalid tag ID format' });
        }

        const projectsWithTag = await neonDatabase
            .select({
                id: projects.id,
                title: projects.title,
                description: projects.description,
            })
            .from(projects)
            .leftJoin(projectTags, eq(projects.id, projectTags.projectId))
            .where(eq(projectTags.tagId, tagId));
        return res.status(200).json(projectsWithTag);
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve projects for this tag' });
    }
});

export default router;