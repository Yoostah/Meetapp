import { parseISO, isBefore } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import EventSubscription from '../models/EventSubscription';

class EventSubscriptionController {
  async index(req, res) {
    const mySubscriptions = await EventSubscription.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          as: 'event',
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          attributes: ['past', 'title', 'description', 'location', 'date'],
          include: {
            model: File,
            as: 'meetup_banner',
            attributes: ['path'],
          },
        },
      ],
      order: [['event', 'date']],
    });
    return res.json(mySubscriptions);
  }

  async store(req, res) {
    const event = await Meetup.findByPk(req.params.id);

    if (!event) {
      return res.status(401).json({ error: 'Event does not exists' });
    }

    if (event.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You can not subscribe to your own Event' });
    }

    if (isBefore(event.date, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can not subscribe to a finished Event' });
    }

    const isSubscribed = await EventSubscription.findOne({
      where: {
        user_id: req.userId,
        event_id: event.id,
      },
    });

    if (isSubscribed) {
      return res
        .status(401)
        .json({ error: 'You are already subscribed to this Event' });
    }

    const dateConflict = await EventSubscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'event',
          where: {
            date: event.date,
          },
        },
      ],
    });

    if (dateConflict) {
      return res.status(401).json({
        error: 'You are subscribed to another event with the same date',
      });
    }

    const subscribe = await EventSubscription.create({
      user_id: req.userId,
      event_id: event.id,
    });

    return res.json(subscribe);
  }
}

export default new EventSubscriptionController();
