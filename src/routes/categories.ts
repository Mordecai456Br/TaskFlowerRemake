import express from 'express';
import { desc, eq, ilike, and } from 'drizzle-orm';
import { categoriesOfProject } from '../database/schema';
import { projectTags } from '../database/schema';
import { neonDatabase } from '../database';


const router = express.Router();

router.post('/', async(req, res) => {

    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'name is required' });
        }
        const findName = await neonDatabase
            .select()
            .from(categoriesOfProject)
            .where(eq(categoriesOfProject.name, name))
            .limit(1);
        const result = findName[0];
        if (result) {
            return res.status(409).json({error: `A record with this "${name}" already exists.`})
        }
        const [newCatProject] = await neonDatabase
            .insert(categoriesOfProject)
            .values({
                name: name
            })
            .returning();
        res.status(201).json(newCatProject);
    } catch {
        res.status(500).json()
    } 

})

router.get('/', async (req, res) => {
    try {
        const findTag = await neonDatabase
            .select({
                id: categoriesOfProject.id,
                name: categoriesOfProject.name
            })
            .from(categoriesOfProject)
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