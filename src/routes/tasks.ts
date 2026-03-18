import express from 'express';
import {and, count, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {tasks, projects,  stages,  user} from "../database/schema";
import {neonDatabase} from "../database";


const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const { title, description, type, projectId, stageId, priority, created_by, assigned_to,  deadline, estimatedTimeMinutes } = req.body
        
        const [findProject] = await neonDatabase
            .select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .limit(1)   
        if (!findProject) {
            return res.status(404).json({ message: "projeto n encontrado" });
        }
        const findStage = await neonDatabase
            .select()
            .from(stages)
            .where(eq(stages.id, stageId))
            .limit(1)
        if (!findStage) {
            return res.status(404).json({ message: "stage n encontrado" });
        }
        const findCreator = await  neonDatabase
            .select()
            .from(user)
            .where(eq(user.id, created_by))
            .limit(1)
        if (!findCreator) {
            return res.status(404).json({ message: "criador n encontrado" });
        }
        const findAssignee = await  neonDatabase
            .select()
            .from(user)
            .where(eq(user.id, assigned_to))
            .limit(1)
        if (!findAssignee) {
            return res.status(404).json({ message: "usuario n existente no sistema" });
        }
        const [newTasks] = await neonDatabase 
            .insert(tasks)
            .values({
                title: title,
                description: description,
                type: type,
                projectId: projectId,
                stageId: stageId,
                priority: priority,
                created_by: created_by,
                assigned_to: assigned_to,
                deadline: deadline,
                estimatedTimeMinutes: estimatedTimeMinutes
            })
            .onConflictDoNothing()
            .returning();
        if (!newTasks) {
            return res.status(409).json({ error: `You already created a project with the title '${title}'` });
        }
        return res.status(201).json(newTasks);
    } catch {
        res.status(500).json()
    }        

})