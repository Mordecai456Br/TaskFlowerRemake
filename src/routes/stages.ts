import express from 'express';
import {and, eq} from "drizzle-orm";
import { projects, stages } from "../database/schema";
import {neonDatabase} from "../database";


const router = express.Router();

router.post('/', async (req, res) => {  
    console.log("1");
    try {
        const { title, description, order, projectId } = req.body;
        if (!title && !description && !order && !projectId) {
            return res.status(400).json({ error: 'Is required: title, description, order, projectId'});
        }
        const findProject = await neonDatabase 
            .select()
            .from(stages)
            .where(and(
                eq(stages.projectId, projectId),
                eq(stages.title, title))
            )
            .limit(1)
        const result = findProject[0];
        console.log(findProject)
        if (result) {
            return res.status(409).json({ error: `You already created a stage with the title '${title}'`});
        }
        const [newStage] = await neonDatabase
            .insert(stages)
            .values({
                title: title,
                description: description,
                order: order,
                projectId: projectId
            })
            .returning();
        return res.status(201).json(newStage);
    } catch {
        res.status(500).json();
    }   
});

router.get('/', async (req, res) => {  

    try {

        const findProject = await neonDatabase 
            .select({
                id: stages.id,
                title: stages.title,
                description: stages.description,
                order: stages.order,
                projectId: stages.projectId
            })
            .from(stages)
        const result = findProject
        if (!result ) {
            return res.status(404).json({message: ""}) //gabrelo adicionar message aqui;
        }
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "" }); //gabrelo adicionar message aqui;
    }
})

export default router;





