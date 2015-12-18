---
layout: post
title: How I almost screwed up the Esplorio iOS launch and fixed it with duct tape
year: 2015
month: December
day: 18
---

## Team Esplorio officially launched the iOS app

We first built our tracking app a long time ago. In the past few months, we put a beautiful UI on it and re-engineered the whole platform in the process.

We went from this simple one-page tracker prototype:

<img src="http://i.imgur.com/VqwvTLZ.png" style="width:50%">

to a beautiful trip recording/sharing app:

![this awesome app](http://i.imgur.com/WB5onSg.png)

With a bit of luck, we got Hunted and featured on the top of the Tech featured page for the day. Now that we've launched on the app store plus a shiny ProductHunt badge, it is pretty awesome.

### What happened behind the scene?

For the 2 days leading up to the launch, we camped at @timfernando's place to work our ass off. The first day we called it a day at 3am, and the second day we pulled an all-nighter trying to get all the launch stuff together then stayed up until late afternoon to respond to all the new traffic. That was almost 40 hours of work for the 2 days - which is pretty much a week equivalent for most people. **It is insane. I do not recommend it.**

### And I almost f*cked it up

**When shit hits the fan just before launch, it hits real hard.**

About 13 hours before launch, I was doing usual maintenance on our servers, restarting some machines since the OS required a server restart for some security updates. *One faulty restart then took out our whole database cluster.* The cluster seemed to get into a very bad race condition and never recovered afterwards no matter what we did to save it. We then decommissioned it, spinned up a new production cluster to replace it using the latest backup that we had at the time. However, by the time the backup data was in place, it was already 3 hours before launch time, but our database views still had not finished indexing yet - which means both the site and the app are both unusable.

*Tim, Essa and I then had to make a call to whether we should keep going with the launch.* It was a Thursday, the coming weekend would be the last weekend before Christmas, so we thought launching any time later than this (even on the Friday) would be a bad idea. At this point, we realised that we still have a staging database, which has the data replicated from production along with all the views being warmed up already, lying there ready to be used. We quickly tested it, everything seemed to work, the only risk is that since these are just staging servers, we have no [replications](http://docs.couchbase.com/admin/admin/Concepts/concept-replication.html) set up, so we run the risk of having a bigger screw-up if one of the boxes fail.

**We bit the bullet and used that cluster anyway. It worked flawlessly for the whole launch period.** We then ran an [XDCR](http://docs.couchbase.com/admin/admin/XDCR/xdcr-intro.html) during the launch from this substitute staging cluster to that new production cluster that we built overnight to make sure it always has newest data, and that the view indices will be ready later in the day or maybe the day after at worst.

This afternoon, we confirmed that Couchbase has now sorted itself out on the new production cluster. We made sure all the data is in place, switched all our servers to use that cluster and reversed the XDCR like it was before (production -> staging).

Yes, that's right. We just fixed our app launch with duct tape *and it worked*.

Startup life is fun.






