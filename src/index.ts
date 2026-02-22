import express from 'express';

const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send("Welcome to TaskFlower!")
})

app.listen(port, () => {
    console.log(`Server starteddd on http://localhost:${port}`);
})

app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
})
