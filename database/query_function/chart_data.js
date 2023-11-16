//db = sample_dataset
//---------- Aggregation pipeline for pie chart ----------
db.station.aggregate([
    {
        $match: {timestamp: '03/10/2023'},
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
//---------- Aggregation pipeline for scatter chart ----------
db.shipment.aggregate([
    {
        $addFields: {
            _start: {
                $dateFromString: {
                    dateString: {
                        $concat: [
                            { $dateToString: { format: "%Y-%m-%d", date: new Date() } },
                            "T",
                            "$_time._start",
                            ":00.000Z"
                        ]
                    },
                    format: "%Y-%m-%dT%H:%M:%S.%LZ"
                }
            },
            _end: {
                $dateFromString: {
                    dateString: {
                        $concat: [
                            { $dateToString: { format: "%Y-%m-%d", date: new Date() } },
                            "T",
                            "$_time._end",
                            ":00.000Z"
                        ]
                    },
                    format: "%Y-%m-%dT%H:%M:%S.%LZ"
                }
            }
        }
    },
    {
        $project: {
            _from: 1,
            _to: 1,
            totalMinutes: {
                $divide: [
                    {
                        $subtract: ["$_end", "$_start"]
                    },
                    1000 * 60 // Convert milliseconds to minutes
                ]
            }
        }
    },
    {
        $group: {
            _id: {
                from: "$_from._station",
                to: "$_to._station"
            },
            totalMinutes: {
                $sum: "$totalMinutes"
            }
        }
    },
    {
        $project: {
            _id: 0,
            from: "$_id.from",
            to: "$_id.to",
            totalMinutes: 1
        }
    }
]);

  