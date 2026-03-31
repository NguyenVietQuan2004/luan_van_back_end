import express from "express";
import dangVienRoutes from "./dangvien.route.js";
import stepRouter from "./step.route.js";
import applicantRouter from "./applicant.route.js";
import contestRoutes from "./contest.route.js";
import contestReRoutes from "./contest.registration.route.js";
import documentRouter from "./document.route.js";
import hesoluongRoutes from "./hesoluong.route.js";
import luongcosoRoutes from "./luongcoso.route.js";
import dangvienphiRoutes from "./dangvienphi.route.js";
import dangphiRoutes from "./dangphi.route.js";
import partyEmailsRoutes from "./partyEmails.routes.js";
import nopdangphicaptrenRoutes from "./nopdangphicaptren.route.js";
import contestStatsRouter from "./contestStats.route.js";
import reportRoutes from "./report.route.js";
import syllRoutes from "./syll.route.js";

const router = express.Router();
router.use(
  "/contest-stats",
  (req, res, next) => {
    console.log("da chay vao contest-stats");
    next();
  },
  contestStatsRouter,
); // ← Thêm dòng này
router.use("/hesoluong", hesoluongRoutes);
router.use("/luongcoso", luongcosoRoutes);
router.use("/syll", syllRoutes);
router.use("/dangvienphi", dangvienphiRoutes);
router.use("/dangphi", dangphiRoutes);
router.use("/nopdangphicaptren", nopdangphicaptrenRoutes);
router.use("/party-emails", partyEmailsRoutes);
router.use("/contest-registrations", contestReRoutes);
router.use("/contests", contestRoutes);
router.use("/steps", stepRouter);
router.use("/applicants", applicantRouter);
router.use("/dang-vien", dangVienRoutes);
router.use("/documents", documentRouter);
router.use("/reports", reportRoutes);
export default router;
