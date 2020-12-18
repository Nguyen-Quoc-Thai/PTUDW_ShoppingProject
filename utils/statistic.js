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

module.exports.parsePrice = (strPrice) => {
  return parseInt(strPrice.replace(/[\.dđ]/g, ""));
};

module.exports.mergeCart = async (Model, userId, sessionCart) => {
  try {
    let cart = {};

    const userCart = await Model.findOne({
      userId,
      status: "waiting",
    });

    if (!userCart) {
      sessionCart.userId = userId;
      cart = await Model.create(sessionCart);
    } else if (userCart.totalQuantity === 0) {
      sessionCart.userId = userId;
      await Model.updateOne({ userId }, { $set: sessionCart });
      cart = sessionCart;
    } else {
      cart = userCart;

      const merCartItem = [...userCart.items, ...sessionCart.items];
      const slugName = Array.from(
        new Set(merCartItem.map((item) => item.slugName))
      );

      const items = slugName.map((slug) => {
        const uniSlug = merCartItem.filter((it) => it.slugName === slug);
        const staUniSlug = uniSlug.map((uni) => parseInt(uni.quantity));
        const quanti = staUniSlug.reduce((it1, it2) => it1 + it2, 0);

        uniSlug[0].quantity = quanti;
        uniSlug[0].total = quanti * this.parsePrice(uniSlug[0].price);

        return uniSlug[0];
      });

      cart.items = items;
      cart.totalQuantity += sessionCart.totalQuantity;
      cart.totalCost += sessionCart.totalCost;

      await Model.updateOne({ userId }, { $set: cart });
    }

    return cart;
  } catch (error) {
    console.log(error.message);
    return sessionCart;
  }
};
