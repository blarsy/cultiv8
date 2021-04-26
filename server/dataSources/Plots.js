import { MongoDataSource } from 'apollo-datasource-mongodb'
import mongo from 'mongodb'
const { ObjectId } = mongo

export default class Plots extends MongoDataSource {
  async getAll(farmId) {
    return this.collection.find({ farm: ObjectId(farmId) }).toArray()
  }
  async getPlot(plotId) {
    return this.findOneById(plotId)
  }
}
