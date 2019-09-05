import Sequelize from 'sequelize';

import db_param from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(db_param);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
