import { Router, type IRouter } from "express";
import healthRouter from "./health";
import spacesRouter from "./spaces";
import visitorsRouter from "./visitors";
import authRouter from "./auth";
import donationsRouter from "./donations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(spacesRouter);
router.use(visitorsRouter);
router.use(authRouter);
router.use(donationsRouter);

export default router;
