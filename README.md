# Top of the POPs

This app is the POP showdown game, intended to be used to provide a fun and engaging way to learn about Fastly at trade shows and developer conferences.  It is to be displayed on a large screen at the booth.  Players will interact with the game on their own personal device.

We show a world map with Fastly POPs (data centers) marked (similar to [fastly.com/network](fastly.com/network) but animated) and a QR code to use to join.  The first player who joins gets allocated a POP randomly (eg 'Singapore'), and gets to choose a metric (such as 'HTTP/2 adoption').  The second and subsequent players to join get to choose a POP to play against the first player (and will aim to choose a POP that exhibits a better performance on the metric the game will test, so in this case player 2 tries to guess which Fastly POP location might have a better HTTP/2 adoption than Singapore).

When the race begins, we show the value of the selected metric in real time for all participating POPs, but hide the aggregate.  At the time limit, we show the aggregates (eg the median over the whole game period), and declare the winner!

This is similar in concept to a classic British card game called [Top Trumps](https://en.wikipedia.org/wiki/Top_Trumps).

## Game play in detail

### On main screen:

1. Reset state (`/`): loading spinner, register new game
   - `GET /api/listPOPs` to get list of participating POPs
   - `POST /api/newGame` to start a game
   - pushstate to game URL
   
2. Game lobby (`/game/<game_id>`): display world map, joining instructions, highlight POPs already allocated to players.  If number of registered players >= 2, start countdown to beginning of game
   - `GET /game/<game_id>/stream` to subscribe to game events
   - Receive `gameUpdate` events when players, POPs and metric changes

3. Welcome player 1 and show POP allocation animation, select metric
   - Receive `newPlayer` event with `role: choose-metric`
   - Show a metric with explanation
   - Receive `prev`, `next`, `select` events from player device to cycle though options and choose one
   - `POST /api/setMetric` to set the metric for the game
   - Return to lobby view (with registered player's POP highlighted)

4. Welcome player 2, present existing POPs & metric, prompt for POP selection
   - Receive `newPlayer` event with `role: choose-pop`
   - Show a POP with stats and a city image
   - Receive `prev`, `next`, `select` events from player device to cycle though options and choose one
   - `POST /api/setPlayerPOP` to set the POP for a specific player
   - Return to lobby view (with registered player's POP highlighted)

5. Game in progress view: Hide world map, make columns for each POP, show: city pic, POP code, name of POP, name of player, current metric value.  Show time remaining.
   - `POST /api/startGame` to start the game
   - Receive `gameData` events to update the metric value

6. Final game state view: reduce size of losing POPs, display only city pic, code and median value (maybe in red).  Increase size of winning POP, show code, name, name of winning player, and median value (in green/white/blue?)
   - Receive `gameEnd` event when game ends to trigger this view
   - After a timeout, reset state and start a new game.
   
   
### On players' devices:

1. Join form (`/play/<game_id>`): provided game is in lobby state, allow player to join
   - `POST /api/getGame` to get current game state
   - `GET /game/<game_id>/stream` to subscribe to game events
   - `POST /api/newPlayer` to create player
   - pushState to player view
   
2. Player view (`/play/<game_id>/<player_id>`): Shows please wait message by default and waits for events

3. Remote control: if triggered by `showRemote` event, show UP/DOWN/SELECT controls
   - `POST /api/remoteKey` to send a remote key (prev, next, select)
   - Receive `endSelect` event to go back to waiting

4. Game view: if triggered by `startGame` event
   - Receive `gameData` events, display the player's own metric value in real time, and the time remaining
   
5. Final view: triggered by `endGame` event
   - Show win/lose status and email capture
   - POST /api/captureEmail` to capture email address
   - Link to learn more about Fastly


## Endpoints

### POST /ingest

Accepts log data from Fastly services.  Expects a compact string in the following format:

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

### GET /pops

Returns a list of Fastly POPs that are participating in the game, with their locations:

```json
[
  {
    "name": "Amsterdam",
    "code": "AMS",
    "coordinates": { "latitude": 52.3081, "longitude": 4.7642 }
  },
  ...
]
```

### GET /metrics

Returns a list of metrics that are available to choose

```json
[
  {
    "name": "Cache hit ratio",
    "code": "chr",
    "type": "percentage", // ENUM: 'percentage', 'milliseconds', 'kilobytes', 'units'
    "description": "The percentage of requests which can be answered with a cached response stored within Fastly's edge cloud.  Sometimes a request might find a hit in a second Fastly data center if there is no matching content in the first."
  },
  ...
]
```

### POST /games

Creates a new game.

*No params*

```json
{
  "id": "52c95b80-0739-4aa6-9378-21f0cd2ad3bf"
}
```

### POST /games/{game_id}/players

Creates a new player.

Request params:

*No params*

Response params:

```json
{
  "id": "a9edd36f-95d3-4f5a-b61a-f667c193d98d",
  "name": "Professor Beatlejuice",
  "avatar": "prof-beatlejuice"
}
```

### PATCH /games/{game_id}

Modifies a game (eg. to set a metric)

Request params:

* metric: A metric ID code

Response:

```json
{
  "game_id": "52c95b80-0739-4aa6-9378-21f0cd2ad3bf",
  "metric": "chr"
}
```

### PATCH /games/{game_id}/players/{player_id}

Modify a player (eg. to set a POP)

Request params:

* pop: A POP ID code

Response:

```json
{
  "player_id": "a9edd36f-95d3-4f5a-b61a-f667c193d98d",
  "name": "Professor Beatlejuice",
  "avatar": "prof-beatlejuice",
  "pop": "AMS"
}
```

### POST /games/{game_id}/start

Start the game

There is no response body for this request.


### GET /games/{game_id}

Returns the current state of the game.


### GET /game/{game_id}/stream

subscribes to the game stream as a [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) data stream.  All events related to the game are published as SSE events.  Possible events and their payloads are:

|Event name|Payload example|
|----------|---------------|
|`newPlayer`| `{ "player_id": "a9edd36f-95d3-4f5a-b61a-f667c193d98d", "name": "Riley", "pop": "SJC", role": "choose-metric" }` |
|`startSelect`| `{ "player_id": "a9edd36f-95d3-4f5a-b61a-f667c193d98d" }` |
|`endSelect` | `{ "player_id": "a9edd36f-95d3-4f5a-b61a-f667c193d98d" }` |
|`choosePOP`| `{ "player_id": "a9edd36f-95d3-4f5a-b61a-f667c193d98d", "POP": "SJC" }` |
|`chooseMetric`| `{ "player_id": "a9edd36f-95d3-4f5a-b61a-f667c193d98d", "metric": "h2" }` |
|`gameStart`| `{ "endTime": "2019-07-16T6:00:00Z"}` |
|`gameData`| `{ "JFK": 34.5, "SJC": 89, "LHR": 18.9 }` |
|`gameEnd`| `{ "aggregates": { "JFK": 29.9, "SJC": 55.1, "LHR": 21.3 }, "winner": "SJC"}` |
|`reset`| `{ }`|
