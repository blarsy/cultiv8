import { MongoDataSource } from 'apollo-datasource-mongodb'
import mongo from 'mongodb'
const { ObjectId } = mongo

export default class Surfaces extends MongoDataSource {
  async getAll(farmId) {
    const farmPlots = await this.context.dataSources.plots.getAll(farmId)
    return this.collection.find({ plot: { $in: farmPlots.map(plot => ObjectId(plot._id)) } }).toArray()
  }
}
