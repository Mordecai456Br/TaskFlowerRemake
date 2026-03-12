import express from 'express';
import { desc, eq, ilike, and } from 'drizzle-orm';
import { tags, tagTypes } from '../database/schema';
import { neonDatabase } from '../database';


const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const [newType] = await neonDatabase
            .insert(tagTypes)
            .values({
                name: name,
            })
            .returning();
        res.status(201).json(newType);
    
    } catch {
        res.status(500).json();
    }
    
})


export default router;
