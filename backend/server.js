import express from "express";
import dotenv from "dotenv";
import Todo from "./models/todo.model.js";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/todos",async(req,res)=>{ // create a todo
    const todo = req.body;

    if(!todo.title){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        });
    }

    const newTodo = new Todo(todo)
    try{
        await newTodo.save();
        return res.status(201).json({
            success:true,
            data:newTodo,
            message:"Todo created successfully"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
});  

app.get("/api/todos",async(req,res)=>{ // get all todos
    try{
        const todos = await Todo.find();
        return res.status(200).json({
            success:true,
            data:todos
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"can't get all the todos."
        })
    }
});

app.put("/api/todos/:id",async(req,res)=>{ // update a todo
    const {id} = req.params;
    const todo = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success:false,
            message:"Todo not found"
        });
    }
    try{
        const updatedTodo = await Todo.findByIdAndUpdate(id,todo,{new:true});
        return res.status(200).json({
            success:true,
            data:updatedTodo,
            message:"Todo updated successfully"
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:"Todo not found"
        })
    }
});

app.delete("/api/todos/:id",async(req,res)=>{ // delete a todo
    const {id} = req.params;
    try{
        await Todo.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:"Todo deleted successfully"
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:"Todo not found"
        })
    }
});

app.listen(5000,()=>{
    connectDB();
    console.log("Server is running on port 5000");
})