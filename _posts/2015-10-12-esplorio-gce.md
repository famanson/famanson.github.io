---
layout: post
title: All our base are belong to Google (with a few gotchas)
year: 2015
month: Oct
day: 12
---

![Workday](https://farm6.staticflickr.com/5776/20945848996_9ba2cdf62c_k_d.jpg)

The Esplorio team has moved into the same town resulting in me sharing a flat with Essa, and we took our servers along with us (I kid, I kid)

A while back we managed to get into the Google Launch programme, which includes a $100k voucher of Google Compute Engine (GCE) credits. The idea is that Google will assist these new exciting startups to scale with many different resources they have at their command, and beefy servers are just one of their specialties. There are a few technical gotchas I will mention at the end so if you want to skip the BS, go all the way down to [The gotchas](#gotchas)

## The move

These credits sat around for quite some time because our whole team (3+1) were dead focused on getting the iOS app out until about 3 weeks ago when we asked our friend [George Hickman](http://ghickman.co.uk) to join Esplorio once more to help us with this huge switch involving a lot of different moving parts:

- API servers serving the webapp and iOS app
- Web frontend server
- A single-node 8GB database box we need to convert to a proper distributed cluster as it was designed to run (Couchbase minimum requirements state 16GB of RAM for _each_ node in the cluster)
- A myriad of other servers to process geodata, images and queued tasks

By the end of the move, with George's tremendous help, we rewrote all of our deployment scripts using the awesome [Apache Libcloud](https://libcloud.apache.org). Spinning up a whole database cluster only takes one single `deploy.db_cluster:node_count=100` line in the terminal. After all the scripts were rewritten, it took me another couple of days to complete the switch, tighten our firewalls, and scrub all the old servers. As careful as I was, some parts of the system still went down for about half an hour because of a DNS change.

We now even have a staging database cluster, which makes us feel a bit more like a proper software company, and plenty of firepower to prep for growth _:fingers crossed:_

It was a great experience. After months and months of writing way too much Javascript and Swift, I've eventually got my hands around some much needed DevOps stuff. _It also serves as a reminder for myself: Esplorio is totally not a simple system to run!_

## <a name="gotchas"></a>The gotchas

However, we had several problems that we encountered during our move:

### 1. Unusual traffic from China

When we first set up some test GCE boxes, we noticed some suspicious traffic hitting our Django servers. Since Django has the `ALLOWED_HOSTS` check, fortunately it filters out various invalid hosts from hitting most of our endpoints, and on top of that it sends us alerts of these repeated spoofing attempts to hit our servers like this:

```
ERROR: Invalid HTTP_HOST header: 'azzvxgoagent5.appspot.com'.You may need to add u'azzvxgoagent5.appspot.com' to ALLOWED_HOSTS

No stack trace available

Request repr() unavailable.
```

_(The HOST header may vary: `azzvxgoagent5.appspot.com`, `azzvxgoagent3.appspot.com`, `azzvxgoagent1.appspot.com`, `www.google.com.hk`)_

After some investigation, it turns out all of these requests came from a program called `GoAgent`, which snoops around Google App Engine (GAE) servers and use them as a free resource to create a proxy service. As you would have guessed, it is apparently used by many Chinese to bypass the Great Firewall. Our Compute Engine boxes must have fallen in the same IP range that GAE boxes use, and we've had thousands of these requests coming our way.

We decided to filter out these requests before it reaches our Django instances, returning a `HTTP 444` (bad request error, without any response) right when they hit our HTTP server.

### 2. Funky network setup by Google

To bring our database over to the new infrastructure without any downtime, we used a technique in Couchbase called XDCR (Cross-DataCenter Replication). The process is to first build the new cluster, and then set up an automatic unidirectional copy of the data from the old cluster into the new one where every single document in the old cluster will be sent over as part of the copy (each copy request is thus called an XDCR op). Once all the data is in place, one can simply flip the switch for the application to use the new cluster, and all the precious data will be there in the new cluster, ready to use. When all of the left-over XDCR ops finish, we can make a backup of the old server and then archive it.

In order for this to happen successfully, all nodes within the 2 clusters need to be able to talk to each other. We first set the new cluster up so that they can all talk to each other using Google's internal IP addresses, leaving only one box exposed to the old cluster, because we thought if we point the XDCR target to this "leader" box, it'd be enough. XDCR failed, of course, because Couchbase clusters treat each node equally and so all of these _individual_ nodes need to be able to talk to each other. I did some further digging into the GCE network structure, and found that Google have done some funky setup where the IP address of `eth0` is the internal one, and the external address is apparently generated and configured elsewhere. The idea is that all the nodes are connected to the Internet not directly but via a different layer, and as a result external IP addresses can be changed either at creation time or even on the fly. It's quite cool.

I predict our database cluster would perform even better if we use an all-internal setup, however it is a task for another day.

### 3. Quotas

The last gotcha we hit during the migration was the quotas. I assume this is enforced by Google to prevent abuse of their system. Basically, our whole setup required a total of a few dozen CPUs and a number of terabytes of SSD to run so we had to ask for quota raises twice. This was, thankfully, not much of a big trouble since we are a totally legit startup (yay!) and Google's support was very quick and receptive about it.

## Conclusion

I normally consider myself a (somewhat) full-stack developer, but much of the fun I've had still comes from back-end and DevOps. Building these new servers was a bit like assembling many parts of a big puzzle, and the end result was very satisfying. Now on to a tonne of other stuff waiting for me to complete while I [procrastinate by writing this blog entry](http://xkcd.com/303/)...
