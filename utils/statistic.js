module.exports.statistic = async (Model, filterFields, groupBy) => {
  try {
    const statistic = await Model.find(filterFields).distinct(groupBy);

    const result = await Promise.all(
      statistic.map(async (sta) => {
        const objQuery = filterFields;
        objQuery[groupBy] = sta;

        const ret = await Model.find(objQuery).countDocuments();
        return { name: sta, count: ret };
      })
    );

    return result.sort((a, b) => -a.count + b.count);
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
