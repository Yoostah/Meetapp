import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { originalname: name, filename: path } = req.file;
    const { title, description, location } = req.body;
    const formatedDate = parseISO(req.body.date);

    if (isBefore(formatedDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not allowed.' });
    }

    const file = await File.create({
      name,
      path,
    });

    if (!file) {
      return res
        .status(401)
        .json({ error: 'Something went Wrong while saving the Image' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date: formatedDate,
      user_id: req.userId,
      banner: file.id,
    });

    if (!meetup) {
      return res
        .status(401)
        .json({ error: 'Something went Wrong while creating the meetup' });
    }

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
        date: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (!meetup) {
      return res
        .status(400)
        .json({ error: 'Meetup does not exists or update is not allowed.' });
    }

    if (req.body.date) {
      const formatedDate = parseISO(req.body.date);

      if (isBefore(formatedDate, new Date())) {
        return res.status(400).json({ error: 'Past dates are not allowed.' });
      }
    }

    const updatedMeetup = await meetup.update({
      ...req.body,
      ...(req.body.date ? `date: formatedDate` : []),
    });

    return res.json(updatedMeetup);
  }
}

export default new MeetupController();
