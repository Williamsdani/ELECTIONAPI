const express = require("express");
const mongoose = require("mongoose");
PORT = 6508;

const app = express();
app.use(express.json());

mongoose
.connect(
    "mongodb+srv://wd7576383:kO8yEYGc7vhfudkZ@cluster0.a0e5jlh.mongodb.net/"
)

.then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log(e.message);
  });

  const electionSchema = mongoose.Schema({
    state: { type: String, required: [true, "state required"], unique: true },
    parties: { type: Array },
    result: {
        PDP:{type:Number,required:true["PDP result must be filled"]},
        APC:{type:Number,required:true["APC result must be filled"]},
        LP:{type:Number,required:true["LP result must be filled"]},
        APGA:{type:Number,required:true["APGAresult must be filled"]}
    },
    collationOfficer: {
      type: String,
      required: [true, "collation officer's name required"],
    },
    totalLG: Number,
    totalRegisteredVoters: {
      type: Number,
      required: [
        true,
        "Enter the total number of registerd voters in this state",
      ],
    },

    isRigged: {
        type: Boolean,
        default: function () {
         
          
          if (this.totalVoters > this.totalRegisteredVoters) {
              return true;
            } else {
              return false;
            }
          },
        },
        totalVoters:{
            type:Number,
             default:0
            
           },
          winner: { 
            type: String,
            default: function () {
              let maxKey = null;
              let maxValue = -Infinity;
              for (const [key, value] of Object.entries(this.result)) {
                if (value > maxValue) {
                  maxValue = value;
                  maxKey = key;
                }
              }
              return maxKey;
            },
            required: false,
          },
        });

        const electionModel = mongoose.model("Elections", electionSchema);

//create new entry
app.post("/create", async (req, res) => {

const data={state:req.body.state,
    parties:req.body.parties,
    results:req.body.results,
    collationOfficer:req.body.collationOfficer,
    totalRegisteredVoters:req.body.totalRegisteredVoters,
    totalVoters:(req.body.results.PDP+req.body.results.APC+req.body.results.LP+req.body.results.APGA)
}
// console.log(req.body.results.APC)

  try {
    const newEntry = await electionModel.create(data);
    res.status(200).json({
      message: "new entry successfullly added",
      data: newEntry,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}); 





app.listen(PORT, () => {
    console.log("server is on ", PORT);
  });
        
    
  exports.exports =async(req,res)=>{
    try {
      const id =req.params.id
      const updateone = await electionModel.findByIdAndUpdate(id)
      res.status(200).json({
        messasge:"this user has been updated",
        data:updateone

      })
    } catch (error) {
      res.status(404).json({
        message:error.message
      })
      
    }
  }