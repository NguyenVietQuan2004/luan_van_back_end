// services/contest.stats.service.js

import ContestRegistration from "../models/contest/contest.registration.model.js";

export const getContestParticipationStats = async () => {
  return await ContestRegistration.aggregate([
    // tách từng member
    { $unwind: "$members" },

    // join đảng viên
    {
      $lookup: {
        from: "dangviens",
        localField: "members.party_member_id",
        foreignField: "_id",
        as: "party_member",
      },
    },

    { $unwind: "$party_member" },

    // join cuộc thi
    {
      $lookup: {
        from: "cuocthis",
        localField: "contest_id",
        foreignField: "_id",
        as: "contest",
      },
    },

    { $unwind: "$contest" },

    {
      $project: {
        _id: 0,

        party_member_id: "$party_member._id",
        ho_ten: "$party_member.ho_ten",

        contest_name: "$contest.name",

        month: { $month: "$contest.start_date" },
        year: { $year: "$contest.start_date" },

        title: "$result.title",
        rank: "$result.rank",
        score: "$result.score",
      },
    },

    {
      $sort: {
        year: -1,
        month: -1,
      },
    },
  ]);
};
