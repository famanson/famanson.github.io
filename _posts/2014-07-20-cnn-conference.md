---
layout: post
title: Side Project No.1 of 2014
year: 2014
month: July
day: 20
---

I'm making a note here: HUGE SUCCESS!

A bit of background: "CNN" is short for "Chuyên Ngoại Ngữ", or widely known to students in Hanoi as "Phổ Thông Chuyên Ngoại Ngữ" (yes yes, add the "ĐĐHNN, ĐHQGHN" suffix as well if you feel obliged). It is the school which I went to before I flew over to England to start my A-Levels, and we (current and former) students of the school often loosely refer to ourselves as "CNNer". And to top it off, we CNNers who study and live abroad are called "Global CNNers". The name of the school has various other translations, of which the official one is: [FLSS](http://flss.edu.vn/). I don't like it so I'll just use CNN despite the obvious confusion (duh!), also nobody says "FLSSer", that's just straight out weird.

I don't talk too much about the school to other people (of course unless they are fellow CNNers and can relate), but what I like to do very much is to try to give back as much as I can whenever I can. In recent years, we have been holding an annual conference - essentially a series of speeches, networking sessions and information hub about studying abroad. This is the 6th time we do it, and each time I try to learn and try new things on the go. For CNN Conference 2014, I won't be home back in Vietnam so I decided to put my webdev skillz to the test!

I gave it the last finishing touch the other day and it is now available at [http://globalcnners.org](http://globalcnners.org). And here are some of my development notes/remarks:

- I can't design things. Period. I can do it when people tell me what to do, like at work when I need to set up some HTML/CSS/JS on my own I'd bring it to a front-ender later on then they give feedbacks and tell me to change this and that on the page. That's cool, but doing it from scratch? Uncool. But I did it anyway , and tbh I am glad it turned out ok. But this has set the bar so high for my next project, lol.

- It should work with IE9+. I am still not sure how best to do this: do people test with IE on the go or do they often do everything in moz/webkit then move on to ie? I did the latter because I could not bother to fire up Windows/create a VM/debug in IE at all in the first place. At least it is safe to say I won't have to do it on a daily basis so I don't really care!

- GitHub ftw! The website does not cost a single penny to host :) However the GitHub docs did miss out some specifics for GitHub Pages host, so just for future references: [http://stackoverflow.com/questions/9082499/custom-domain-for-github-project-pages](http://stackoverflow.com/questions/9082499/custom-domain-for-github-project-pages)

- Like when you start learning a new language, once you have picked up something new words there is a period when you used it for EVERYTHING you say. I was exposed to Angular JS recently and this is the perfect use case for it: some kind of data structure is needed (for the Staff gallery), and all we have is a static site. The solution is either hard-coding all of the staff profiles into the HTML or create a separate controller layer for it in javascript. It is a good practice to avoid anything with the word "hard-code"/"hard-coding" in it, so guess which solution I went for.

- [Angular Translate](https://github.com/angular-translate/angular-translate) is awesome. I used it here as an exercise, and I will do it again for my other side projects in the future. Basically, it is a giant mapping from a set of IDs defined by the dev to different translations. What that means is we can assign ```TITLE_HEADING_1``` to "Hello" in the ```en``` mapping and "Xin chào" in the ```vn``` mapping and put ```TITLE_HEADING_1``` with a ```translate``` Angular filter into the HTML then pick the language we want any time we want. Neat.

- There's a lot more going into HTML animations than I thought. So yeah, I could do all these jquery animation things before. However, all I have made so far is for a bunch of monitoring dashboard applications at work, and we backenders do not need eye-candy stuff. We just need the transitions on the screen to display the right colours/numbers, and we just need that crap to work in Chrome. Here I had to consider which kind of animations have the best performance in each case, for example margin animations that manipulate the whole page layout causes a tonne more draw calls than others and making the rest of the page jerky and slow. My favourite part of the website is probably the balloon wobbling up and down when you first open the page. Soooooooo many hours went into that.

- And then there were browser compatibility with many differences in filter/animation implementations. A prime example in this case would be the grayscale filter (when you click on a flag on the Staff gallery or picking the languate). That single feature would need this ugly vendor thing to work cross-browser (and if the same browsers, cross-version):

```
.flag-icon.grayscale {
    filter: grayscale(100%); /* Current draft standard */
    -webkit-filter: grayscale(100%);
	-webkit-filter: grayscale(1);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: url('../img/filters.svg#grayscale');
    filter: gray;
}
```

Personally I like the SVG implementation the most, where you include this SVG file:

```
<svg xmlns="http://www.w3.org/2000/svg">
 <filter id="grayscale">
  <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/>
 </filter>
</svg>
```

And that ```#grayscale``` suffix will apply the matrix transformation to the picture.

![doge-filter](https://drive.google.com/uc?id=0B2OTEDYR8TTScU5GOERoaXBwQ0U)

So I spent way more time than I should really on this particular side project, pushing others down the queue and I feel very bad about it. But it was fun, and I learnt a lot from it, so it is fine. I guess it is always fine to use learning as an excuse to anything, really... But seriously, I am feeling very good right now about the progress I've made and here hoping the Conference on 26th July will be a cracker :)
