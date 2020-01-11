/* Rough guide to stats:

   "size": 1) 4-8 nodes; 2) 16 nodes; 3) 32 nodes; 4) 64 nodes
   "areaPop": 1) under 10m, 2) 10-20m, 3) 20-40m, 4) over 40m
   "gdp": 1) under $10k; 2) 10-20K; 3) 20-40k, 4) over 40k (for the country)
*/


const pops = [
  {
    "code": "MAD",
		"name": "Madrid",
    "size": 3,
    "areaPop": 4,
    "tzOffset": 1,
    "gdp": 3,
		"left": 47.8,
		"top": 33.8
  },
  {
    "code": "CHI",
		"name": "Chicago",
    "size": 4,
    "areaPop": 4,
    "tzOffset": -6,
    "gdp": 4,
		"left": 26.2,
		"top": 32.8
  },
  {
    "code": "BOG",
		"name": "Bogota",
    "size": 2,
    "areaPop": 3,
    "tzOffset": -5,
    "gdp": 1,
		"left": 28,
		"top": 53.8
  },
  {
    "code": "EZE",
		"name": "Buenos Aires",
    "size": 1,
    "areaPop": 2,
    "tzOffset": -3,
    "gdp": 2,
		"left": 33.3,
		"top": 76
  },
  {
    "code": "LAX",
		"name": "Los Angeles",
    "size": 3,
    "areaPop": 3,
    "tzOffset": -8,
    "gdp": 4,
		"left": 17.5,
		"top": 37
  },
  {
    "code": "JNB",
		"name": "Johannesburg",
    "nodes": 8,
    "areaPop": 3,
    "tzOffset": 2,
    "gdp": 1,
		"left": 56.4,
		"top": 71.5
  },
  {
    "code": "HEL",
		"name": "Helsinki",
    "size": 1,
    "areaPop": 2,
    "tzOffset": 2,
    "gdp": 3,
		"left": 54.5,
		"top": 22.1
  },
  {
    "code": "FJR",
		"name": "Dubai",
    "size": 1,
    "areaPop": 1,
    "tzOffset": 4,
    "gdp": 4,
		"left": 63.8,
		"top": 42
  },
  {
    "code": "SIN",
		"name": "Singapore",
    "size": 3,
    "areaPop": 3,
    "tzOffset": 8,
    "gdp": 4,
		"left": 77.9,
		"top": 55.5
  },
  {
    "code": "TYO",
		"name": "Tokyo",
    "size": 3,
    "areaPop": 4,
    "tzOffset": 9,
    "gdp": 4,
		"left": 85.7,
		"top": 35.5
  },
  {
    "code": "PER",
		"name": "Perth",
    "size": 1,
    "areaPop": 1,
    "tzOffset": 8,
    "gdp": 4,
		"left": 80,
		"top": 73.8
  },
  {
    "code": "AKL",
		"name": "Auckland",
    "size": 1,
    "areaPop": 1,
    "gdp": 3,
    "tzOffset": 13,
		"left": 94.4,
		"top": 78.5
  }
];

export default pops;
