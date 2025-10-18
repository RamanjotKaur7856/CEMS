const Participant = require('../models/Participant');

exports.registerParticipant = async (req, res) => {
  const participant = new Participant(req.body);
  await participant.save();
  res.json(participant);
};

exports.getParticipantsByEvent = async (req, res) => {
  const participants = await Participant.find({ eventId: req.params.eventId });
  res.json(participants);
};