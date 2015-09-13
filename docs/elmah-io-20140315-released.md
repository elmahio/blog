# elmah.io 20140315 released

##### [Thomas Ardal](http://elmah.io/about/), March 15, 2014 in [Changelog](/category/changelog/)

## Say hello to a new release of elmah.io. This release primarily focuses on improving the rule engine with new actions.

### Profile page

There’s a new profile page in town. We don’t keep a lot of information about you, but you can change your name and email, by visiting the new Profile page located on the dashboard:

![Profile](/images/2014/03/profile.png)

The attentive reader probably notice the newsletter checkbox. The newsletter is something we are introducing to keep you up to date on the new stuff happening on elmah.io and ELMAH in general. We send out our newsletter once each quarter, so please join if you are interested in getting some good articles and links in your mailbox four times a year.

### Business rules

As mentioned in the [previous](http://blog.elmah.io/elmah-io-20140219-released/) release note, we have started building a diverse business rule engine into elmah.io, making it possible for you to execute various actions when errors matching a specified pattern occur. This time we added two new actions: Mail and HTTP Request.

By adding a rule with a mail action, you receive a new mail each time an error occur, when the error details matches the search criteria you’ve setup. In the following sample, you’d get an email every time a new error from Googlebot is registered. Start by adding a title and query:

![Add new rule](/images/2014/03/add_new_rule.png)

Click the *Then* button and select the mail action:

![Then email](/images/2014/03/then_email.png)

Another possibility is to let elmah.io request a URL each time an error occurs. Switch to HTTP Request and input the method and URL to start the magic:

![Then http](/images/2014/03/then_http.png)

The possibilities with the HTTP Request action are endless. Integrate with your favorite tool using the property merge feature in the body field.

As usual please reach out if you have ideas for elmah.io either through [UserVoice](http://elmahio.uservoice.com/), [Twitter](https://twitter.com/elmah_io) or [Email](mailto:info@elmah.io).