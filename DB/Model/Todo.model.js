import mongoose from mongoose;

const TodoSchema = new mongoose.Schema( {
    content : {
        type : String,
        required : true,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    subtodo : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SubTodo',
        required :true,
    }
]

}, {timestamps: true})

export const Todo = mongoose.model("Todo", TodoSchema);