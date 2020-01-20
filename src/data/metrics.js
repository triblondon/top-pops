import { HIGHER_IS_BETTER, LOWER_IS_BETTER } from '../constants.js';

const metrics = [
  {
    "name": "Cache hit ratio",
    "code": "chr",
    "type": "percentage",
    "winDirection": HIGHER_IS_BETTER,
    "strap": "Fastly's huge cache storage means higher cache hit ratios",
    "description": "How often Fastly responds to a request without sending it to customer origin.  High cache hit ratios are found in larger data centers and where a site's home crowd is"
  }, {
    "name": "Hit time",
    "code": "hittime",
    "type": "milliseconds",
    "winDirection": LOWER_IS_BETTER,
    "strap": "Fastly can start delivering bytes in under a millisecond",
    "description": "Time from a request hitting Fastly until we begin to serve a response.  Faster turnaround happens on newer generation cache servers."
  }, {
    "name": "HTTP/2 adoption",
    "code": "h2",
    "type": "percentage",
    "winDirection": HIGHER_IS_BETTER,
    "strap": "HTTP/2 speeds up your site and kills messy performance hacks",
    "description": "Requests received by Fastly over HTTP/2 or HTTP/3, versus HTTP/1.1.  Adoption of new protocols requires support in the user's device and web browser, but is becoming ubiquitous.  It's hard to buy a new phone or computer today that doesn't come with a browser that supports HTTP/2."
  }, {
    "name": "IPv6 adoption",
    "code": "ipv6",
    "type": "percentage",
    "winDirection": HIGHER_IS_BETTER,
    "strap": "The world is running out of IP addresses, but Fastly fully supports IPv6",
    "description": "The percentage of requests received by Fastly on an IPv6 address.  Some mobile networks provide individual public v6 addresses but group users behind a single IPv4.  In areas where most users are mobile devices, IPv6 gives a more reliable connection and you'll see it more often."
  }, {
    "name": "TLS adoption",
    "code": "tls",
    "type": "percentage",
    "winDirection": HIGHER_IS_BETTER,
    "strap": "The web is now 'secure by default'. So is Fastly",
    "description": "Requests sent to Fastly securely, versus plain unencrypted HTTP.  This is higher where website owners have decided to enable TLS, and even higher if the website disallows insecure HTTP - particularly in regions where regulations require secure connections."
  }, {
    "name": "Language diversity",
    "code": "lang",
    "type": "diversity",
    "winDirection": HIGHER_IS_BETTER,
    "strap": "Use Fastly to talk to users in their preferred language",
    "description": "The number of preferred languages that represent more than 2% of requests received by this data center.  Higher in data centers that serve a user population spread over multiple countries or in countries with multiple popular languages."
  }, {
    "name": "Congestion window size",
    "code": "cwnd",
    "type": "segs",
    "winDirection": HIGHER_IS_BETTER,
    "strap": "Fastly holds connections open for longer",
    "description": "The amount of data we allow to be in transit without acknowledgement from the other end.  It starts low, so keeping connections open allows it to expand and the connection gets faster.  Higher in areas where we can reuse connections, eg. where consumer internet connections are more reliable."
  }, {
    "name": "Delivery speed",
    "code": "pace",
    "type": "kbps",
    "winDirection": HIGHER_IS_BETTER,
    "strap": "Fastly sends bytes to users as fast as they can take them",
    "description": "The speed Fastly can send data to end users, in bytes per second.  The rate is constrained by the network speed of the user's home or mobile data service.  It will be higher in regions with faster mobile internet."
  }, {
    "name": "Round trip time",
    "code": "rtt",
    "type": "milliseconds",
    "winDirection": LOWER_IS_BETTER,
    "strap": "80% of the world's population is within 20ms of Fastly",
    "description": "The time in milliseconds required to exchange a message with an end user.  This is higher in areas where a data center serves a larger, more widely dispersed user population, and also where a larger proportion of users are on mobile data connections."
  }
];

export default metrics;
