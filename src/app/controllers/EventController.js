import { Op } from 'sequelize';
import Meetup from '../models/Meetup';

class EventController {
  async index(req, res) {
    const events = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
    });

    if (!events) {
      return res.json({ message: "You don't have scheduled events" });
    }

    return res.json(events);
  }

  async delete(req, res) {
    const event = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
        date: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (!event) {
      return res.json({ message: 'This events is not eligible for deletion' });
    }

    await event.destroy();

    return res.status(200).json({ message: 'Event deleted!' });
  }
}

export default new EventController();
