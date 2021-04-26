export default {
  Mutation: {
    rescheduleTask: async (parent, args, { dataSources: {tasks}}) => {
      return tasks.rescheduleTask(args._id, args.date)
    },
    deleteTask: async (parent, args, { dataSources: {tasks}}) => {
      return tasks.delete(args._id)
    }
  },
  Query: {
    farms: async (source, args, { dataSources: {farms}}) => {
      return farms.getFarms()
    },
    farm: async (source, args, { dataSources: {farms}}) => {
      return farms.getFarm(args._id)
    },
    tasks: async (source, args, { dataSources: {tasks}}) => {
      return tasks.getTasks()
    },
    task: async (source, args, { dataSources: {tasks}}) => {
      return tasks.getTask(args._id)
    },
    cultures: async (source, args, { dataSources: {cultures}}) => {
      return cultures.getCultures()
    },
    surfaces: async (source, args, { dataSources: {surfaces}}) => {
      return surfaces.getAll(args.farmId)
    }
  },
  Task: {
    culture: async (parent, args,  { dataSources: {cultures}}) => {
      return cultures.getCulture(parent.culture)
    }
  },
  Culture: {
    product: async (parent, args, { dataSources: {products}}) => {
      return products.getProduct(parent.product)
    }
  },
  Surface: {
    plot: async (parent, args, { dataSources: {plots}}) => {
      return plots.getPlot(parent.plot)
    }
  }
}
