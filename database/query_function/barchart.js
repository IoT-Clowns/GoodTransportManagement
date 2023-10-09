db.order.aggregate([
    {
      $match: {
        $and: [
          {"timestamp.start": '02/10/2023'},
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