export default {
  Query: {
    currentCultures(){
      return [{ status: 1}, { status: 100}]
    },
    farms: async (source, args, { dataSources: {farms}}) => {
      return farms.getFarms()
    },
    farm: async (source, args, { dataSources: {farms}}) => {
      return farms.getFarm(args.id)
    },
    tasks: async (source, args, { dataSources: {tasks}}) => {
      return tasks.getTasks()
    },
    task: async (source, args, { dataSources: {tasks}}) => {
      return tasks.getTask(args.id)
    },
    cultures: async (source, args, { dataSources: {cultures}}) => {
      return cultures.getCultures()
    },
  },
  Task: {
    culture: async (parent, args,  { dataSources: {cultures}}) => {
      return cultures.getCulture(parent.culture)
    }
  }
}
