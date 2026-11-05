import mongoose from "mongoose";

const planApprovalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const PlanApproval = mongoose.model("PlanApproval", planApprovalSchema);

export default PlanApproval;
