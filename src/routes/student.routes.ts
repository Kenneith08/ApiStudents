import { Router } from "express";
import { studentController } from "../controller/student.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", studentController.getAll);
router.get("/:id", studentController.getById);
router.post("/", studentController.create);
router.put("/:id", studentController.updateFull);
router.patch("/:id", studentController.updatePartial);
router.delete("/:id", studentController.remove);

export default router;
