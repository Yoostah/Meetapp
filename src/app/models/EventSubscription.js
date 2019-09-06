import { Model } from 'sequelize';

class EventSubscription extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'event_id', as: 'event' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default EventSubscription;
