// // GET /api/mentor/payout-history
// export const getMentorPayoutHistory = async (req, res) => {
//     try {
//       const mentorId = req.user._id;
  
//       const payoutRequests = await PayoutRequest.find({ mentor: mentorId }).sort({ requestDate: -1 });
  
//       res.json({ history: payoutRequests });
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   };
  