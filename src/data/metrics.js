const metrics = [
  {
    "name": "Cache hit ratio",
    "code": "chr",
    "type": "percentage",
    "description": "The percentage of requests which can be answered with a cached response stored within Fastly's edge cloud.  Sometimes a request might find a hit in a second Fastly data center if there is no matching content in the first."
  }
];

export default metrics;
