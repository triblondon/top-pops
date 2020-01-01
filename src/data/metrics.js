const metrics = [
  {
    "name": "Cache hit ratio",
    "code": "chr",
    "type": "percentage",
    "strap": "Fastly's huge cache storage means higher cache hit ratios",
    "description": "The percentage of requests which can be answered with a cached response stored within Fastly's edge cloud.  Sometimes a request might find a hit in a second Fastly data center if there is no matching content in the first.  A data center will generally show a higher cache hit ratio if it has a higher proportion of a site's traffic."
  }, {
    "name": "Hit time",
    "code": "hittime",
    "type": "milliseconds",
    "strap": "Fastly can receive a request and start delivering bytes in under a millisecond",
    "description": "Time between a client opening a connection and Fastly beginning to serve response data in the event of a cache hit.  This reflects the overhead of a request being processed by Fastly and gives an indication of the power of Fastly's edge servers.  Newer generation machines will be faster."
  }, {
    "name": "HTTP/2 adoption",
    "code": "h2",
    "type": "percentage",
    "strap": "HTTP/2 speeds up your site and spells the end of many performance hacks.",
    "description": "The percentage of requests received by Fastly over HTTP/2 or HTTP/3, versus the venerable HTTP/1.1 which has been powering the web since 1997.  Adoption of new protocols requires support in the user's device and web browser, but is becoming ubiquitous.  It's hard to buy a new phone or computer today that doesn't come with a browser that supports HTTP/2."
  }, {
    "name": "IPv6 adoption",
    "code": "ipv6",
    "type": "percentage",
    "strap": "The world is running out of IPv4, but Fastly fully supports IPv6.",
    "description": "The percentage of requests received by Fastly on an IPv6 address.  "
  }, {
    "name": "TLS adoption",
    "code": "tls",
    "type": "percentage",
    "strap": "In the last decade, the web got 'secure by default'.",
    "description": "The percentage of requests sent to Fastly over secure connections, versus plain unencrypted HTTP.  Fortunately, site owners are more and more aware of the risks of accepting unencrypted requests, and Fastly can redirect such requests to secure endpoints automatically."
  }, {
    "name": "Language diversity",
    "code": "lang",
    "type": "diversity",
    "strap": "The world doesn't speak with one voice.  Your customers want content in many languages.  How many?",
    "description": "The number of preferred languages that represent more than 2% of requests received by this data center"
  }, {
    "name": "Congestion window size",
    "code": "cwnd",
    "type": "bytes",
    "strap": "Fastly holds connections to clients for as long as we can",
    "description": "The average congestion window size on a connection when Fastly finishes delivering a response.  This will be higher in areas where we can reuse connections, where HTTP/2 adoption is higher, and where consumer internet connections are more reliable, eg. where a larger proportion of users are on fixed line connections."
  }, {
    "name": "Delivery speed",
    "code": "pace",
    "type": "bps",
    "strap": "Fastly always sends bytes to end users as fast as they can receive them",
    "description": "The rate at which Fastly can send data to end users, in bytes per second.  This is a reflection of the bandwidth avaiable to the end users who are sending requests, since the rate is likely constrained by the network speed of their home or mobile data service.  It will be higher in regions where faster mobile internet infrastructure exists."
  }, {
    "name": "Round trip time",
    "code": "rtt",
    "type": "milliseconds",
    "strap": "80% of the world's population is within a 20ms RTT of a Fastly server",
    "description": "The time in milliseconds required to exchange a message with an end user.  This is higher in areas where a data center serves a larger, more widely dispersed user population, and also where a larger proportion of users are on mobile data connections."
  }
];

export default metrics;
