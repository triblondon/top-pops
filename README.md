# Top of the POPs

This app is the Top of the POPs game, intended to be used to provide a fun and engaging way to learn about Fastly at trade shows and developer conferences.  It is to be displayed on a large screen at the booth.  Players will interact with the game on their own personal device.

![Screenshot]("screenshot.png")

We show a world map with Fastly POPs (data centers) marked (similar to [fastly.com/network](fastly.com/network) but animated) and a QR code to use to join.  The first player who joins gets allocated a POP randomly (eg 'Singapore'), and gets to choose a metric (such as 'HTTP/2 adoption').  The second and subsequent players to join get to choose a POP to play against the first player (and will aim to choose a POP that exhibits a better performance on the metric the game will test, so in this case player 2 tries to guess which Fastly POP location might have a better HTTP/2 adoption than Singapore).

When the race begins, we show the value of the selected metric in real time for all participating POPs, but hide the aggregate.  At the time limit, we show the aggregates (eg the median over the whole game period), and declare the winner!

This is similar in concept to a classic British card game called [Top Trumps](https://en.wikipedia.org/wiki/Top_Trumps).

## Ingesting data

An API endpoint accepts log data from Fastly services.  Expects a compact string in the following format:

```
<pop> <time> <duration> <is_h2><is_ipv6><is_ssl><is_hit> <lang> <cwnd> <pace> <rtt>
```

These values must be populated as follows:

|Ref|VCL expression| Description |
|------------------|--------------|-------------|
| `pop` | `server.datacenter` | POP ID code |
| `time` | `time.start.usec` | Start time of the request |
| `duration` | `time.elapsed.usec` | Lifetime of the request on Fastly |
| `is_h2` | `if (fastly_info.is_h2, "1", "0")` | Whether the connection is using HTTP/2 |
| `is_ipv6`| `if (req.is_ipv6, "1", "0")` | Whether the connection is IPv6 |
| `is_ssl` | `if (req.is_ssl, "1", "0")` | Whether the connection is secure |
| `is_hit` | `if (fastly_info.state ~ "^HIT", "1", "0")` | Whether the request was considered a cache hit |
| `lang` | `req.http.Accept-Language` | Most preferred language of the requester |
| `cwnd` | `client.socket.cwnd` | Current congestion window of the connection |
| `pace` | `client.socket.tcpi_pacing_rate` | Speed at which Fastly is able to send data to the client |
| `rtt`  | `client.socket.tcpi_min_rtt` | Minimum observed RTT |

This results in a log line such as:

```
SJC 1563210961 14263 1010 en 10 4022082 4042
```

The logging can be implemented with the following VCL:

```
log "syslog " req.service_id " toppops-collector :: "
  server.datacenter " "
  time.start.usec " "
  time.elapsed.usec " "
  if (fastly_info.is_h2, "1", "0")
  if (req.is_ipv6, "1", "0")
  if (req.is_ssl, "1", "0")
  if (fastly_info.state ~ "^HIT", "1", "0") " "
  accept.language_lookup("aa:ab:ae:af:ak:am:an:ar:as:av:ay:az:ba:be:bg:bh:bi:bm:bn:bo:br:ca:ce:ch:co:cr:cs:cu:cv:cy:da:de:dv:dz:ee:el:en:eo:es:et:eu:fa:ff:fi:fj:fo:fr:fy:ga:gd:gl:gn:gu:gv:ha:he:hi:ho:ht:hu:hy:hz:ia:ie:ig:ii:ik:io:is:it:iu:iw:ja:ji:jv:jw:ka:kg:ki:kj:kk:kl:km:kn:ko:kr:ks:ku:kv:kw:ky:la:lb:lg:li:ln:lo:lt:lu:lv:mg:mh:mi:mk:ml:mn:mo:mr:ms:mt:my:na:nd:ne:ng:nl:no:nr:nv:ny:oc:oj:om:or:os:pa:pi:pl:ps:pt:qu:rm:rn:ro:ru:rw:sa:sc:sd:se:sg:sh:si:sk:sl:sm:sn:so:sq:ss:st:su:sv:sw:ta:te:tg:th:ti:tk:tl:tn:to:tr:ts:tt:ty:ug:uk:ur:uz:ve:vi:vo:wa:wo:xh:yi:yo:za:zh:zu", "en", req.http.Accept-Language) " "
  client.socket.cwnd " "
  client.socket.tcpi_pacing_rate " "
  client.socket.tcpi_min_rtt
;
```

It should be subject to an allowlist that captures only defined data centers and also to a sample rate.  A full fiddle is at https://fiddle.fastlydemo.net/fiddle/7eeb0d46.

The language tags within this code sample can be updated.  Load the [IANA language subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) in a web browser and run the following JavaScript in the browser console:

```javascript
document.body.innerText
  .match(/\%\n\s*Type: language\s+Subtag: (\w\w)\s+Description: (.+?).*?\n\%/gis)
  .filter(str => !str.includes('Macrolanguage: '))
  .map(str => str.match(/\%\n\s*Type: language\s+Subtag: (\w\w)\s+/))
  .map(arr => arr[1])
  .join(':')
;
```

## TODO

[ ] Favicon
[ ] Better design for POP confirm view
[ ] Better
