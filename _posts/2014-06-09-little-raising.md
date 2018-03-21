---
layout: post
title: Little things
year: 2014
month: June
day: 9
---

Here's a bunch of little things I've encountered when coding at work and at home (yes, I am that hard-core):

- Mixing angular.js templates together with JSP templates: I am not sure if I am doing it right, but it works. And it works well :-s

    ![Essence of programming](http://i.imgur.com/x0ml8.png)

    Basically I stuffed this inside a JSTL tag file:

    ```
    <script text="javascript">
        var posts = [
            /* A bit of evil here: compose button disguised as a post */
            {
                type: "compose"
            },
            <c:forEach items="${posts}" var="post" varStatus="loop">
            {
                id: "${post.id}",
                price: "${post.price}",
                datePosted: ${post.creationDateMillis},
                description: "${post.description}",
                type: "${post.type.toString().toLowerCase()}",
                images: [
                	<c:forEach items="${post.images}"
                			var="image"
                			varStatus="imageLoop">
                		'${image}'
                		<c:if test="${!imageLoop.last}">,</c:if>
                	</c:forEach>],
                location: "${post.location}"

            }<c:if test="${!loop.last}">,</c:if>
            </c:forEach>
        ];
    </script>
    ```

    Everything in between the ```${ }```, the ```c:forEach``` and the ```c:if``` tags is fed into it from the underlying servlet. This will in turn become the input data used by angular to create the posts on the page itself

- To [escape](http://en.wikipedia.org/wiki/Escape_character) a single quote in CQL3 (Cassandra), you need to - prepare to get your mind blown - add another single quote before it!

- Legend has it that formatting strings in python can be fun too, especially when you need to actually escape the percentage sign somewhere. [Double percentage signs](http://stackoverflow.com/a/10678240) do the trick

- Java regex escape character is a double backslash instead of a single backslash

- Escaping a dollar sign in maven pom.xml to be used in a config later is really a pain in the a$$
