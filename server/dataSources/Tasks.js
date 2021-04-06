import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Tasks extends MongoDataSource {
  async getTask(taskId) {
    return this.findOneById(taskId)
  }
  async getTasks() {
    return this.collection.find().toArray()
  }
}
