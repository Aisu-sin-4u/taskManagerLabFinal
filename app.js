// Modules
const express = require("express");
const connectDB = require("./connect");

const port = 5500;
const appName = "Task Manager";
const app = express();

// Middleware
app.use(express.static("./Client"));
app.use(express.json());

// Data model (schema)
const tasks = require("./Task");

// get all the tasks
app.get("/api/tasks", async (req,res)=>{
  try {
    const task = await tasks.find();
    res.status(200).json({task});
  } catch (error){
    res.status(500).json({msg: error});
  };
});

app.post("/api/tasks", async (req, res) => {
  try {
    const tasksToCreate = req.body;
    console.log(tasksToCreate);

    // Insert tasks with unordered option
    const createdTasks = await tasks.create(tasksToCreate);

    res.status(201).json({ tasks: createdTasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updateId = req.params.id;
    const dataToUpdate = req.body;

    // Insert tasks with unordered option
    const createdTasks = await tasks.findByIdAndUpdate(updateId, dataToUpdate);

    res.status(201).json({ tasks: createdTasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deleteId = req.params.id;

    // Insert tasks with unordered option
    const createdTasks = await tasks.findByIdAndDelete(deleteId);

    res.status(201).json({ tasks: createdTasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Connect to the database and start the appl server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {console.log(`${appName} is listening on port ${port}.`)});
  } catch (error) {
    console.log(error);
  };
}

start();
