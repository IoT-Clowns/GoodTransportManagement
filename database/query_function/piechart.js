//db = sample_dataset
db.station.aggregate([
  {
    $group: {
      _id: "$_product._productId",
      totalQuantity: { $sum: "$_product._quantity" }
    }
  },
  {
    $project: {
      _id: 0,
      productId: "$_id",
      totalQuantity: 1
    }
  }
])

db.station.find({totalQuantity: { $sum: "$_product._quantity" }})

db.order.aggregate([
    {
        $lookup: {
            from: "user",
            localField: "_userId",
            foreignField: "_id",
            as: "user"
        },
        $lookup: {
            from: "shipment",
            localField: "_Id",
            foreignField: "_order",
            as: "shipment"
        }
    },
    {
        $limit: 1
    }
]);

db.order.aggregate([
  {
    $match: {
      $and: [
        {"timestamp.start": '01/10/2023'},
        {"timestamp.end": {$exists: true}}
      ]
    }
  },
  {
    $unwind: '$_product'
  },
  {
    $group: {
      _id: null,
      products: {
        $addToSet: '$_product'
      },
      totalQuantity: {
        $sum: '$_product._quantity'
      }
    }
  },
  {
    $project: {
      _id: 0,
      products: 1,
      totalQuantity: 1
    }
  }
]);