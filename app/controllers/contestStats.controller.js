// controllers/contest.stats.controller.js

import * as statsService from "../services/contestStats.service.js";

export const getContestParticipationStats = async (req, res) => {
  try {
    const data = await statsService.getContestParticipationStats();

    res.json({
      total: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
