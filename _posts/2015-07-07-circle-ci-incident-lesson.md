---
layout: post
title: CircleCI 2015-07-06 incident - A lesson for myself
year: 2015
month: July
day: 7
---

## The shit hits the fan.

*Quick intro: GitHub is where we host our code, and CircleCI is where we run our tests. CircleCI has set up a hook for GitHub to notify them of new changes/branches/projects and run the set of tests define in those automatically in containers*

*What is written in this article is purely my own speculation on what happened, and I took a particular interest in it because it has a lot of similarities with our own backend system at Esplorio*

An earlier GitHub outage practically DDOS'ed CircleCI. All the hooks over the period of time GitHub had their problem got called. This quickly filled up CircleCI's capacity and caused a major slowdown, forcing them to scale up to deal with the problem. The CircleCI database issue that happened system-wide immediately afterwards is either very unfortunately timed or a direct consequence of this - either way, some people in San Francisco had a very bad day in the office... There is not much of an official statement on what exactly went on yet. Personally, I think the 2 incidents are very likely to be linked.

Until now, long after the original incident, CircleCI is still not be able to function normally. None of Esplorio's tests were run today at all. I feel sorry for the guys at CircleCI, but I also find this whole incident very fascinating from an engineering point of view mostly because it draws some sort of parallel to Esplorio's own backend system, working with complicated external APIs, trying to figure out their behaviours, and avoid death traps like this one that just happened to CircleCI (which basically put them out of business completely).

I do not know what precisely CircleCI is doing under the hood to work with GitHub, but my guess would be that there is probably nothing guarding the data flow going from GitHub to CircleCI. During or shortly after the GitHub outage, it might not have occurred to them that a flood of hooks would hit them when GitHub recovers. Esplorio has similar dependencies, but the main difference is that for our system, it is easier to just cancel all the hooks/scheduled calls and retry them later in time again and again. For us, a message only means processing a point on the map with some analysis. For them, a message means bringing up a container to run _all_ the tests in that message. This eats up resources crazy fast however people optimise it. 

To reflect on our own system at Esplorio, a sudden surge of usage could cause all sorts of funny problems. Our own database at Esplorio has had weird beviours before simply because it was running low on disk space due to a daily job every night without any of us noticing (because the original problem itself that caused the database crisis would be gone in the morning). Another reason why it slipped under our radar was because our database was still growing - the more it grows, the more disk space is used for these other database jobs that we set up, and it only started to hit when it reached a tipping point where it started struggling with other core processes for resources.

Scaling is all fun and good until you realise there are still a thousand of ways that your system can be screwed up in the wild. I do hope the guys at CircleCI can resolve their issues - for now, we'll just have to make do with running our tests on our own machines

```
[Update from CircleCI as of the time this blog article was posted]
We have all resources focused on solving the issue with the DB. We understand the effects an outage like this has on your productivity, and it’s our only priority. Will continue to update when we have any new information.
Jul 7, 09:25 PDT
```

