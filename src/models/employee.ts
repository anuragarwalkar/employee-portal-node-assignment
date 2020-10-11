import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    projectAssigned: {
      type: String,
      required: true
    },
    technologyStack: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    strict: true,
    timestamps: true
  }
);

const clientModel = mongoose.model("Employees", employeeSchema);

export default clientModel;
