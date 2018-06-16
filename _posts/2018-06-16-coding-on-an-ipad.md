---
layout: post
title: Setting up a working environment on the iPad
year: 2018
month: June
day: 16
image: https://cl.ly/sIWq/IMG_2528.jpg
---

![header-image](https://cl.ly/sIWq/IMG_2528.jpg)

## How it all started

I am on a quest to travel quickly and carry lighter, more compact gear. In the past 2 years, my old Canon 7D DSLR setup (including the infamously bulky Sigma 50mm f/1.4) has been gradually replaced by a combination of mirrorless kit (Fujifilm X-Pro2) and film rangefinder (Bessa R2M). However, there is still a problem: I not only carry camera gear on the move, but also *a laptop*.

The MacBook Pro 15” (2014) is lighter than most, but it is not a small device. On a weekend trip or when I am on the move for an extended period of time, it can become quite the burden. However, I still do need to bring it along most of the time in case either duty calls or I want some more advanced tools to edit my photos. This is where the iPad Pro comes in: it’s small and light (the 10.9” version), the TrueTone 120Hz screen is marvellous, and it is a very capable writing tool when combined with a good keyboard. Switching my writing (`Bear`) and photo editing (Apple’s very own`Photos`) to it is easy because the flow is already established.

The only thing left is to come back to my engineering root: *I want to set up a programming environment on it*.

## The requirements

Because of how I set up my programming environment everywhere else already, there are several very specific requirements that I need from this new setup.
- I need to get my passwords from  [pass](https://www.passwordstore.org/)
- A VPN client to provide safe passage on the treacherous parts of the Internet
- A decent code editor
- A GitHub/SSH client
- Some sort of UNIX terminal

As a software engineer, text editors and CLI software are my tools of trade. I spend most of my screen time working with either of those during a usual day of work, so I always take (a bit too much) time to evaluate and customise them.

## The Solution

### Pass

![passwordstore](https://cl.ly/sJAj/Image%202018-06-16%20at%202.03.54%20pm.jpg)

[pass](https://www.passwordstore.org) has become an essential part of my life. It is encrypted, secure, simple to use, and, most importantly, lives inside the terminal. I have tried many other password managers including Apple’s very own KeyChain, but none has come near to the level of flexibility and reliability of `pass`.

On the iPad, I have found that the combination of [Pass for iOS](https://itunes.apple.com/us/app/pass-password-store/id1205820573?mt=8) and its Safari extension works very well. There are several things to note during the setup process:
- I set up the GPG key on my Mac first, then copied it to the iPad via universal clipboard.
- For some reason `ssh://` scheme does not work for me when setting up the password sync to my private GitHub repo. I had to resort to authenticating via HTTPS using a newly generated personal access token (since I have two-factor auth).
- I highly recommend turning on Touch ID and add a password to your `pass` store.

### Encrypt.me (formerly CloakVPN)

There is very little to complain about [encrypt.me](https://encrypt.me/)  except that the old name is much cooler. If you have an iPhone/iPad/Mac and work remotely a lot, I highly recommend it!

It is fast, simple, and just works. In some places, the connection speed might suffer when it is turned on. But if I need to establish a secure line to a production server while on the move in the Wild West, the trade-off is definitely acceptable.

### Termius

When I first attempted to build a terminal simulator on the iPad, I tried to replicated exactly what I had on the laptop. I tried several apps then quickly realised that is impossible since too many system dependencies are missing on iOS, which makes both the `javascript` and the `python` environments unusable. I got as far as setting up just `ssh` and then quickly gave up. At this point, I knew that I’d need a remote environment and since I had been using [Termius](https://www.termius.com/) already on my phone, I simply put it on the iPad. The question is now which remote environment I should set up.

![Termius 1](https://cl.ly/sK1a/[c54b0250dcc9b73770126d5ad526db71]_IMG_0011.jpg)

Me being me, I tried another convoluted solution where I can connect remotely to my MacBook at home via a Dynamic DNS setup. I was quite happy with it since it was fast and I can run all of the scripts and tools I already had, but then I took a step back and it dawned on me that:
- Unless I leave my MacBook at home all the time, this would not work
- Besides, it needs to stay turned on most of the time
- Above all, this is extremely insecure

I then built a Linux box on [AWS EC2](https://aws.amazon.com/ec2/) with everything I need, slap that into a tab on `Termius` and *voila*! I can now run deployment scripts, tests and play around with our code (including `nodejs` and `ember`) on a proper working Linux environment on the go via my iPad anywhere and any time.

![Termius 2](https://cl.ly/sJkk/[ba705d6ac241324aa98f5998508d05ae]_IMG_0012.jpg)

I also paid for the Pro subscription on  `Termius`  since they also offers a lot of extra features than just `ssh` and port forwarding:
- Terminal tabs
- Autocomplete
- Agent forwarding
- SFTP
- Syncing configuration amongst different devices
- `Dark Mode`

The last 3 items on that list are what sold me on the Pro plan.

It is also worth mentioning that as a system restriction, apps cannot stay in the background for too long (up to 3 minutes in most cases). Sometimes when working with an active terminal, we might need more than that, so `Termius` came up with a solution where the app asks for `Always` location access on the iOS device to keep the process running. It’s nothing mind-blowing but for someone who works a lot with GPS tracking and has hit similar iOS limtations many times, I find these little workaround interesting.

### Working Copy

Having worked out that the `ssh` /`git`client inside the terminal alone would not cut it for code reviews, I tried to find a full-blown standalone `git`  client. Before having the iPad, I used to use [iOctocat](https://github.com/dennisreimann/ioctocat) to get notifications from PRs and then review/comment on the code on it or on my MacBook. However, with the iPad, the screen is no longer tiny so I can just use `GitHub`’s pull request interface on `Safari` itself. Since `iOctocat` was sunset, I have reconfigured my `Slack` notifications to push `GitHub` PRs notifications to me on my iOS devices. What this means is that I can now remove push notifications from the list of required features on my `git` client, which unlocked a few choices. Eventually, I settled on [Working Copy](https://workingcopyapp.com).

![Working Copy 1](https://cl.ly/sJJK/IMG_0009.jpg)

`Working Copy` is a `git` client with a simple text editor shipped along with it. It is very well designed, and the feature set is just what I need:
- Easy integration with `GitHub`
- Nice tools for resolving merge conflicts
- Repos are fully available offline when cloned (this sounds obvious but it is surprisingly difficult to get right)
- *It is iOS 11 capable* - this means that it can clone repos to iOS 11’s `Files`, which is a really useful feature. This means that if one wants to use a different text editor on top of it, that text editor just needs to be able to read from the same file system. It’s what I ended up doing myself because I’m not quite satisfied with the editor on `Working Copy` . It works just fine for things like HTML and Markdown, but that’s about it.

![Working Copy 2](https://cl.ly/sIzE/IMG_0010.jpg)

And so onwards to the next section...

### Textastic

On the laptop, I use [Sublime Text](https://www.sublimetext.com/) for javascript frontend, [PyCharm](https://www.jetbrains.com/pycharm/) for python backend and [XCode](https://developer.apple.com/xcode/) for iOS development extensively. I did not bother setting up an `XCode`-equivalent on the iPad because it is not mission-critical and, to my knowledge, there is no way to set up a proper iOS development on an iOS device itself. So that left a replacement for `Sublime Text` and `PyCharm` to be figured out.

I was presented with a few recommendations on the text editors front. It came down to one of: [Buffer](http://buffereditor.com) (on 50% sale as I am writing this article), [Coda](https://panic.com/coda/?),  [Pythonista 3](http://omz-software.com/pythonista/) and [Textastic](https://www.textasticapp.com/)
- `Coda` ‘s price is way above the rest of the competition. To be fair, it seems to be much more feature-rich, but I don’t need the whole shebang for my kind of usage. I quickly gave it a pass.
- `Pythonista 3` is a very powerful `python` IDE. It offered `pip` integration inside its own terminal, too! But after hours of trial and error, I could not get everything our web backend needs up and running with it (namely our database software and `CPython` dependencies). So I decided to just go with a generic text editor and rely on my remote Linux boxes and Continuous Integration to run scripts and tests respectively.
- Moving on, at first, I thought `Buffer`  editorwas a steal for the price. It is sleek, and is easy to get started. But I quickly hit a couple of issues that eventually let me down:
	- Even though it supports iOS 11 `Files`, I can only seem to open a single file at a time. This is no good since I work with the whole project this way.
	- Okay, so if I cannot work with `Working Copy` like that, perhaps I might have better luck with its `GitHub` integration. But after using it for a while, I found myself keep coming back to `Working Copy` time and time again because it has much better UI for running diffs and resolving merge conflicts.

So that left `Textastic` as the final option...

![Textastic](https://cl.ly/sLd1/IMG_0016.jpg)

... which checks all the boxes:
- A whole project can be imported from iOS 11 `Files` . `Working Copy` actually had a way to support `Textastic` via some scripts before, but this just made it an order of magnitude easier
- The design of the app is top-notch
- It works beautifully with `Working Copy` so there is no need to set up a `GitHub` integration
- It has `Monokai` theme, which I love (this is on other editors too, but I just have to mention it)

## Conclusion:

After weeks of research, I found that `Textastic` and `Working Copy` in split view side-by-side is a powerful pair of tools for text editing and version control. Using this with CI and `Termius`, I can both build new code and fix bugs on both our web frontend and backend servers easily. This is the final combination that I am happy with.

It is not the full stack that I normally work with since `XCode` is missing, but with [Bitrise](https://www.bitrise.io) + [fastlane](https://fastlane.tools/) + a `GitHub` webhook I can always do some very simple editing and release to [TestFlight](https://developer.apple.com/testflight/) easily. To run the debugger and other heavy tasks for iOS development, I would need the MacBook anyway and the much longer release cycle on iOS means that it isn’t really practical to set up the full dev flow on the go for `XCode` without the laptop.

I hope that this is useful and would save some time for someone out there looking for a development environment on a laptop substitution like I did. Get in touch with me if it does, or if you have a different opinion! Leave a comment here, drop me [a message]( [me@famanson.com](mailto:me@famanson.com), find me on [GitHub](https://github.com/famanson).

Have a nice day and happy coding!