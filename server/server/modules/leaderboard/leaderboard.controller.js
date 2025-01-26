const LeaderboardService = require('./leaderboard.service');

exports.getLeaderboardByEvent = async (req, res) => {
  try {
    // Get subevent_id from query parameters
    const { subevent_id } = req.query;
    const eventId = parseInt(req.params.eventId);
    
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const leaderboard = await LeaderboardService.getLeaderboardByEvent(eventId);
    
    // Filter by subevent_id if provided
    const filteredLeaderboard = subevent_id 
      ? leaderboard.filter(entry => entry.subevent_id === parseInt(subevent_id))
      : leaderboard;

    res.status(200).json(filteredLeaderboard);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.declareWinners = async (req, res) => {
  try {
    const { eventId, subEventId, winners } = req.body;

    if (!eventId || !subEventId || !winners) {
      return res.status(400).json({ 
        message: 'Event ID, Subevent ID, and winners are required' 
      });
    }

    const leaderboard = await LeaderboardService.declareWinners(
      parseInt(eventId),
      parseInt(subEventId),
      winners
    );

    res.status(200).json({ 
      message: 'Winners declared successfully',
      leaderboard 
    });
  } catch (error) {
    console.error('Declare winners error:', error);
    res.status(500).json({ message: error.message });
  }
};