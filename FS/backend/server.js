import express from "express";

const app = express();

const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.send("Server is ready")
// });

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: "A Programmer's Dilemma",
            content: "Why do programmers prefer dark mode? Because light attracts bugs!"
        },
        {
            id: 2,
            title: "Debugging Defined",
            content: "Debugging: Removing the needles from the haystack you called code."
        },
        {
            id: 3,
            title: "Binary Truth",
            content: "There are 10 types of people in the world: those who understand binary and those who don't."
        },
        {
            id: 4,
            title: "Code Conundrum",
            content: "Why was the JavaScript developer sad? Because they didn’t know how to ‘null’ their feelings."
        },
        {
            id: 5,
            title: "Array of Fun",
            content: "Why do Java developers wear glasses? Because they can't C#!"
        }
    ];
    res.send(jokes);
    
})

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
    
})