import express from 'express';
import { and, asc, eq, ilike, or, sql } from 'drizzle-orm';
import { tags, tagTypes } from '../database/schema';
import { neonDatabase } from '../database';

const router = express.Router();


router.post('/', async (req, res) => {

    try {
        const { title, typeId} = req.body; 
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
                typeId
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



export default router;