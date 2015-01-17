# Security training notes

Ocado organised a Security Training course with the amazing [@diniscruz](https://twitter.com/diniscruz). The knowledge from the course is not just restricted to just Ocado's use case but can be applied elsewhere. Here is my notes from the course. 

## I. Introduction

### Best practices for _code quality and tests_:

- `node.js` is a perfect replacement for `selenium`. Direct DOM manipulation + CSS selectors = win. It can be used for all kinds of penetration tests even if the main stack is not in `nodejs`
- Test coverage stats integration: [coveralls.io](coveralls.io)
- Write tests along with code (both front and back end)
- Each GitHub issue has its own integration test
- Travis > Jenkins. Run and directly reflect results on GitHub (he probably said this because his whole stack is in GitHub)
- Propagating tests (dev -> QA prod)
- This should even be done locally - tests and website running in real time
- Need to be able to code without having to click on the application
- Have a fast, responsive reporting system for tests on each branch
- Only tests that are allowed to fail are the very last ones
- Procedure to fix bugs:
    + Write tests to replicate the problem _immediately_
    + Analyse the problem and propose a fix
    + A fix would break that test!
    + That becomes a regression test
    + Results in a huge amount of code coverage
- High coverage means that unit tests actually become your documentation
- New codebase should always start with 100% coverage and a visualisation of what is going on
- Low code coverage and lack of tests on edge cases imply security issues - Security does not happen by magic
- When we build our services, we need to be able to spin up several dependent services at a time - there need to be tests to probe these dependent clusters
- Idea is that in order to talk about security, we need the infrastructure to build on it first

### Tests:

- A test = anything that can be run in a unit test framework
- Good test practice = test that replicates vulnerabilities in the real world, then propagated to web app layer etc
- A test represents a problem - don't write it without thinking about fixing that stuff
- 3 different buckets:
    + `Bucket 1`: Vulnerabilities to fix - stuff that the business are not happy to go live with
    + `Bucket 2`: Vulnerabilities by design (a feature) - "accepted vulnerabilities"/"accepted realities" - for example: encrypted password getting sent to web client that the user needs for another function (vulnerability but needed for functionality) or somehow all files on the web host can be exposed - _do they contain any secrets?_
    + `Bucket 3`: Regression tests - comes from the above 2 buckets. If this breaks, a functionality has changed.
- TODO: Each sprint should chop down 10% of the first 2 buckets or there is a sprint dedicated to them.
- The sooner you build SSL, the sooner you care about it, ie. setting dat shit up on **local**
- It is always good to have a big pile of security issues! A large volume is a good bargaining chip on the table, especially when talking security with big corporates
- An example use case:
    - First we have a small `Http_Client`:

        ```node
        require 'fluentnode'
        cheerio = require 'cheerio'

        class Http_Client
            constructor: (options) ->
                @.options = options || {}
                @.url = @.options.url || 'http://google.com'

            GET: (virtual_path, callback) =>
                fullUrl = @.url + virtual_path
                fullUrl.GET (html) ->
                $ = cheerio.load(html)
                callback($)

        ```

    - Then we have a test under `Bucket 1`, say `test/security/to-fix/security-suite.coffee`:

        ```node
        require 'fluentnode'
        Http_Facade = require '../../../client/Http_Client'

        describe 'Issue #100 webapps are not using auth with the werbservice', () ->
          it 'Should fail with a 401', (done) ->
            options = { 'url': 'http://localhost' }
            using new Http_Client(options), () ->
              @GET '',($) ->
                # The request actually succeeds here
                $('title:first-child').html().assert_Is('Title')
                done()
        ```

    - What this means is that as long as the vulnerability is still alive, the test would still pass
    - Each use case/incident/vulnerability should have its own issue and test

### Security Implications:

- We don't really know what the security implications are until we get _properly hit_ (read: Sony)
- Worst-case scenario: System exploited in a non-deterministic way
- Identify key points in the system - ask yourself if a system goes down or is exploited, would it brong the company down? How would you cope with it?
- Massive issue: poor cross-team collab - Knowledge doesn't scale and security vulnerabilities lose visibility
- **Most security issues start appearing when people trying to make shit work** - large projects should be retrofitted. Previous tests should work for new system
- It is very hard to hire somebody that understands security and can code - it is easier to take a developer and turn him/her into a security specialist in the team
- Culture in hacking each other should be **celebrated**
- Languages with lack of type safety actually encourages more tests and checks
- Mocking = bad
- Never say "No" because as it propagates upwards, it means "there is no vulnerabilities", but "I don't know" or "I don't have proof for that" mean that there is no false sense of security
- Managers often do not give a shit because that is not what they are rewarded for (for their current position, _and also for what they used to work before becoming a manager_)

### APIs:
- Mocking APIs to work with = super bad (to do with maintenance)
- People who maintain APIs should also know how and what the client is using their stuff for.
- Should always visualise the components, like a metalanguage to visualise code dependencies - Because the growing level of complexity will make it harder and harder to scale and investigate bugs/attacks (good use of `neo4j`?)

## II. The Threat Model:

General idea is to analyse system dependencies and data flow to identify security risks and potential attacks/data exposure

Sometimes the best model is not having one - either too insignificant or not enough assets(?). In some cases the data harvested is worthless - does the attacker gain anything from that?

Security can also come from building an app that eliminates the threat by not using the technologies involved in the first place (see `III. Cross-site scripting` below)

Question: _"Is it my job to secure my assets or should I push it to the consumers?"_

Sometimes it is better to put monitoring on it - a trap that only a bug or an attacker can trigger (like an invisible link on the website - the only people who would hit it are crawlers)

Security should be done from ground up, but not always visible or required so often ignored!

## III. Cross-site scripting:

Javascript is powerful and can control everything that is contained in its domain. The only things that limit XSS:
- Different domains
- Different ports
- Different browser

XSS is one of the top issues around here because it can hit both external and internal networks. Once it is persistent, it propagates to anywhere the database is used

**HTML should be banned from the surface of Earth (lol)**

**Secure Coding:** building an application that allows people to develop and experiment with business requirements without worrying about security vulnerbilities. What TeamMentor guys do is:
- No Javascript on their page
- All HTMLs are generated from jadejs and Markdown - so their codebase has no HTML or jQuery

**No Controller**: The right way to deal really fix XSS is to take the controller out of the equation. The argument is that even if we fixed the controller, the view can still be reused elsewhere to inject scripts.

**Headers:** HSTS and CSP headers.
- CSP tells browsers to prevent in-line javascript to load or run
- CSP has a config to build a hook that reports back to developers when a client is hit (which is pretty awesome)


## IV. Course contents:

- https://gitlab.tech.lastmile.com/security-training/api-facade-tests (Ocado internal)
- https://gitlab.tech.lastmile.com/security-training/ocado-security-issues/issues (Ocado internal)
- http://blog.diniscruz.com/2013/12/xstream-remote-code-execution-exploit.html
- http://blog.diniscruz.com/2013/08/using-xmldecoder-to-execute-server-side.html
- https://www.wifipineapple.com/
- https://www.owasp.org/images/5/53/OWASP_Quick_Start_Guide.pdf