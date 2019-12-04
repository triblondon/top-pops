const pops = [
  {
    "code": "AMS",
    "name": "Amsterdam",
    "group": "Europe",
    "coordinates": {
      "latitude": 52.308613,
      "longitude": 4.763889
    }
  },
  {
    "code": "BWI",
    "name": "Ashburn",
    "group": "United States",
    "coordinates": {
      "latitude": 38.944533,
      "longitude": -77.455811
    }
  },
  {
    "code": "ATL",
    "name": "Atlanta",
    "group": "United States",
    "coordinates": {
      "latitude": 33.636719,
      "longitude": -84.428067
    }
  },
  {
    "code": "AKL",
    "name": "Auckland",
    "group": "Asia/Pacific",
    "coordinates": {
      "latitude": -37.008056,
      "longitude": 174.791667
    }
  },
  {
    "code": "BOG",
    "name": "Bogota",
    "group": "South America",
    "coordinates": { "x": 0, "y": 0, "latitude": 4.711, "longitude": -74.072 }
  },
  {
    "code": "BOS",
    "name": "Boston",
    "group": "United States",
    "coordinates": {
      "latitude": 42.364347,
      "longitude": -71.005181
    },
    "shield": "bos-ma-us"
  },
  {
    "code": "EZE",
    "name": "Buenos Aires",
    "group": "South America",
    "coordinates": {
      "latitude": -34.815,
      "longitude": -58.5348
    }
  },
  {
    "code": "CPT",
    "name": "Cape Town",
    "group": "South Africa",
    "coordinates": { "x": 0, "y": 0, "latitude": -33.97, "longitude": 18.464 },
    "shield": "cpt-capetown-za"
  },
  {
    "code": "MAA",
    "name": "Chennai",
    "group": "Asia/Pacific",
    "coordinates": { "x": 0, "y": 0, "latitude": 12.9941, "longitude": 80.1709 }
  },
  {
    "code": "CHI",
    "name": "Chicago - CHI",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 41.9742,
      "longitude": -87.9073
    },
    "shield": "chi-il-us"
  },
  {
    "code": "CPH",
    "name": "Copenhagen",
    "group": "Europe",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 55.728081,
      "longitude": 12.37752
    },
    "shield": "cph-copenhagen-dk"
  },
  {
    "code": "CWB",
    "name": "Curitiba",
    "group": "South America",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -25.4809,
      "longitude": -49.3044
    }
  },
  {
    "code": "DFW",
    "name": "Dallas",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 32.896828,
      "longitude": -97.037997
    },
    "shield": "dallas-tx-us"
  },
  {
    "code": "DEN",
    "name": "Denver",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 39.861656,
      "longitude": -104.673178
    },
    "shield": "den-co-us"
  },
  {
    "code": "DUB",
    "name": "Dublin",
    "group": "Europe",
    "coordinates": { "x": 0, "y": 0, "latitude": 53.35, "longitude": 6.26 },
    "shield": "dub-dublin-ie"
  },
  {
    "code": "FRA",
    "name": "Frankfurt",
    "group": "Europe",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 50.026421,
      "longitude": 8.543125
    },
    "shield": "frankfurt-de"
  },
  {
    "code": "FJR",
    "name": "Fujairah Al Mahta",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 25.112225,
      "longitude": 56.323964
    },
    "shield": "fjr-ae"
  },
  {
    "code": "HEL",
    "name": "Helsinki",
    "group": "Europe",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 60.1699,
      "longitude": 24.9384
    },
    "shield": "hel-helsinki-fi"
  },
  {
    "code": "HKG",
    "name": "Hong Kong",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 22.308919,
      "longitude": 113.914603
    },
    "shield": "hongkong-hk"
  },
  {
    "code": "LCY",
    "name": "London - LCY",
    "group": "Europe",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 51.505278,
      "longitude": 0.055278
    },
    "shield": "london_city-uk"
  },
  {
    "code": "LAX",
    "name": "Los Angeles - LAX",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 33.942536,
      "longitude": -118.408075
    },
    "shield": "lax-ca-us"
  },
  {
    "code": "MAD",
    "name": "Madrid",
    "group": "Europe",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 40.439323,
      "longitude": -3.621211
    },
    "shield": "mad-madrid-es"
  },
  {
    "code": "MEL",
    "name": "Melbourne",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -37.673333,
      "longitude": 144.843333
    },
    "shield": "melbourne-au"
  },
  {
    "code": "MIA",
    "name": "Miami",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 25.79325,
      "longitude": -80.290556
    },
    "shield": "miami-fl-us"
  },
  {
    "code": "MXP",
    "name": "Milan",
    "group": "Europe",
    "coordinates": { "x": 0, "y": 0, "latitude": 45.4642, "longitude": 9.19 },
    "shield": "mxp-milan-it"
  },
  {
    "code": "YUL",
    "name": "Montreal",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 45.497497,
      "longitude": -73.570959
    },
    "shield": "yul-montreal-ca"
  },
  {
    "code": "LGA",
    "name": "New York City",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 40.639751,
      "longitude": -73.778925
    },
    "shield": "lga-ny-us"
  },
  {
    "code": "ITM",
    "name": "Osaka",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 34.785528,
      "longitude": 135.438222
    },
    "shield": "osaka-jp"
  },
  {
    "code": "OSL",
    "name": "Oslo",
    "group": "Europe",
    "coordinates": { "x": 0, "y": 0, "latitude": 59.922, "longitude": 10.809 },
    "shield": "osl-oslo-no"
  },
  {
    "code": "PAO",
    "name": "Palo Alto",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 37.454965,
      "longitude": -122.110783
    },
    "shield": "pao-ca-us"
  },
  {
    "code": "CDG",
    "name": "Paris",
    "group": "Europe",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 48.928051,
      "longitude": 2.35189
    },
    "shield": "cdg-par-fr"
  },
  {
    "code": "PER",
    "name": "Perth",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -31.940278,
      "longitude": 115.966944
    },
    "shield": "perth-au"
  },
  {
    "code": "GIG",
    "name": "Rio de Janeiro",
    "group": "South America",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -22.81341,
      "longitude": -43.249423
    }
  },
  {
    "code": "SJC",
    "name": "San Jose",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 37.3626,
      "longitude": -121.929022
    },
    "shield": "sjc-ca-us"
  },
  {
    "code": "SCL",
    "name": "Santiago",
    "group": "South America",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -33.3936,
      "longitude": -70.7935
    }
  },
  {
    "code": "GRU",
    "name": "Sao Paulo",
    "group": "South America",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -23.432075,
      "longitude": -46.469511
    },
    "shield": "gru-br-sa"
  },
  {
    "code": "SEA",
    "name": "Seattle",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 47.449,
      "longitude": -122.309306
    },
    "shield": "sea-wa-us"
  },
  {
    "code": "QPG",
    "name": "Singapore",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 1.350189,
      "longitude": 103.994433
    }
  },
  {
    "code": "SIN",
    "name": "Singapore",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 1.350189,
      "longitude": 103.994433
    },
    "shield": "singapore-sg"
  },
  {
    "code": "XSP",
    "name": "Singapore",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 198,
      "y": 83,
      "latitude": 1.350189,
      "longitude": 103.994433
    }
  },
  {
    "code": "BMA",
    "name": "Stockholm",
    "group": "Europe",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 59.354372,
      "longitude": 17.94165
    },
    "shield": "stockholm-bma"
  },
  {
    "code": "SYD",
    "name": "Sydney",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -33.946111,
      "longitude": 151.177222
    },
    "shield": "sydney-au"
  },
  {
    "code": "TYO",
    "name": "Tokyo",
    "group": "Asia/Pacific",
    "coordinates": { "x": 0, "y": 0, "latitude": 35.617, "longitude": 139.748 },
    "shield": "tyo-tokyo-jp"
  },
  {
    "code": "HND",
    "name": "Tokyo - HND",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 35.622281,
      "longitude": 139.748426
    },
    "shield": "hnd-tokyo-jp"
  },
  {
    "code": "NRT",
    "name": "Tokyo - NRT",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 35.764722,
      "longitude": 140.386389
    }
  },
  {
    "code": "YYZ",
    "name": "Toronto",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 43.677223,
      "longitude": -79.630556
    },
    "shield": "yyz-on-ca"
  },
  {
    "code": "YVR",
    "name": "Vancouver",
    "group": "United States",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": 49.1967,
      "longitude": -123.1815
    }
  },
  {
    "code": "VIE",
    "name": "Vienna",
    "group": "Europe",
    "coordinates": { "x": 0, "y": 0, "latitude": 48.269, "longitude": 16.41 },
    "shield": "vie-vienna-at"
  },
  {
    "code": "WLG",
    "name": "Wellington",
    "group": "Asia/Pacific",
    "coordinates": {
      "x": 0,
      "y": 0,
      "latitude": -41.327221,
      "longitude": 174.805278
    },
    "shield": "wellington-wlg"
  }
]

export default pops;