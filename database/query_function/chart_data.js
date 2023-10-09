//db = sample_dataset
//---------- Aggregation pipeline for pie chart ----------
db.station.aggregate([
    {
        $match: {timestamp: '01/10/2023'},
    },
    {
        $unwind: '$_product'
    },
    {
        $group: {
          _id: '$_station',
          totalProducts: {
            $sum: '$_product._quantity'
          }
        }
    }
  ]);
//---------- End Aggregation pipeline for pie chart ----------
//---------- Aggregation pipeline for bar chart ----------
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
//---------- End Aggregation pipeline for bar chart ----------
