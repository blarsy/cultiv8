import { MongoDataSource } from 'apollo-datasource-mongodb'
import mongo from 'mongodb'
const { ObjectId } = mongo

export default class Tasks extends MongoDataSource {
  async getTask(taskId) {
    return this.findOneById(taskId)
  }
  async getTasks() {
    return this.collection.find().toArray()
  }
  async rescheduleTask(taskId, date) {
    const done = await this.collection.updateOne({ _id: ObjectId(taskId)}, { $set: {date}})
    if(done.error) throw error
    return this.getTask(taskId)
  }
  async delete(taskId) {
    const done = await this.collection.deleteOne({ _id: ObjectId(taskId) })
    if(done.error) throw error
    return done.deletedCount
  }
}
