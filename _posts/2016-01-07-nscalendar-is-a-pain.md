---
layout: post
title: The problem with NSCalendar
year: 2016
month: January
day: 7
---

## "Timezone", "calendar", "region", "locale" are 4 words that strike fear into any software engineer's mind

*I am writing this blog entry as a note to myself for future reference in case other people have the same problems as well, especially if you use `DateTools` and `CoreData` in your app*

Time format plays a big role in our application. We not only need to be able to make requests to our backend servers with the right format (let's say something like "get all data before 1 Jan 2016"), but also need to show the user the date in a consistent way. Now since we noticed we have a lot of users in Japan, I thought maybe it is a good idea to switch to the Japanese calendar to see if our app still works correctly.

This uncovered a whole world of hurt given that we have not done any proper localisation yet, and are really keen on keeping Gregorian calendar as the standard across our codebase.

### Problem 1

Unless specified, the default locale for any dates in the system will obey the locale of the local region. This is a well-known problem - even Apple has an official documentation [here](https://developer.apple.com/library/ios/qa/qa1480/_index.html) stating that you should really use `en_US_POSIX` if you want to keep everything consistently Gregorian. This was solved easily by setting all our date formatters to use that locale.

### Problem 2

Like many other apps, we use `CoreData` as the backend for our client-side database and [DateTools](https://github.com/MatthewYork/DateTools) to handle many datetime-related tasks. The issue starts with `NSDate` instances stored in `CoreData` obeying the system calendar. It means this piece of code:

```
    let today = <A date value retrieved from CoreData>
    let formatter = NSDateFormatter()
    formatter.locale = NSLocale(localeIdentifier: "en_US_POSIX")
    formatter.dateFormat = `dd MMM yyyy`
    formatter.stringFromDate(today)
```

would result in `04 Jan 0028` once the phone is set to use Japanese calendar, and `today` will think of itself as if it is the year `0028` in Gregorian. If you then use it to perform calculations/manipulations or send it as it is to your backend API to process, it will be wrong.

*The solution is to actually be using the `en_US_POSIX` locale but set both the default calendar identifier in `DateTools` and the calendar identifier on each formatter to the default system identifier. If you do not use `DateTools`, do make sure that whatever date/calendar solution you go with in the end does this as well!*

```
    // The DateTools method to set default calendar (do this once at app launch)
    NSDate.setDefaultCalendarIdentifier(NSCalendar.currentCalendar().calendarIdentifier)

    // Rest of the code
    let today = <A date value retrieved from CoreData>
    let formatter = NSDateFormatter()
    formatter.locale = NSLocale(localeIdentifier: "en_US_POSIX")
    formatter.dateFormat = `dd MMM yyyy`
    formatter.stringFromDate(today)
```

It means that any `NSDate` instances retrieved from `CoreData` would always point to the right point in time, i.e. `04 Jan 0028` in Japan calendar now always points to the same point in time as `04 Jan 2016` in Gregorian calendar (having the same Unix timestamp `1451865600`). Then, the effect of using the `en_US_POSIX` locale would in turn cause the date instance with timestamp `1451865600` being formatted into the right Gregorian format that we want: `04 Jan 2016`.

### Problem 3

Right, so we have solved that problem with `CoreData`, what is going to happen to dates created inside the app but not saved to `CoreData`? The answer is that it is totally messed up as well since you have done `NSDate.setDefaultCalendarIdentifier(NSCalendar.currentCalendar().calendarIdentifier)` at the beginning

The problem is now when creating new `NSDate` instances within the app, the local system calendar will be used by default

```
    // Notice the `NSDate()`
    let today = NSDate()
    let formatter = NSDateFormatter()
    formatter.locale = NSLocale(localeIdentifier: "en_US_POSIX")
    formatter.dateFormat = `dd MMM yyyy`
    formatter.stringFromDate(today)
```

The above code will result in the string `04 Jan 0028`. To work around this problem, I temporarily fall back to the Gregorian calendar in the formatter for all of these dates which we need to show the user in the UI but are not created/retrieved from `CoreData` itself, then reset it to the system local one using `defer`. The full code is then:

```
  // A date formatter used for display views
  private static let displayDateFormatter: NSDateFormatter = {
    // Remember this following call is put here for illustration
    // In reality it should be in app launch
    NSDate.setDefaultCalendarIdentifier(NSCalendar.currentCalendar().calendarIdentifier)
    let formatter = NSDateFormatter()
    // Use the default calendar identifier but with the en_US_POSIX locale
    // This will avoid weird dates from popping up
    formatter.locale = en_US_POSIX
    formatter.calendar = NSCalendar(identifier: NSDate.defaultCalendarIdentifier())
    return formatter
  }()

  /**
   dateToDayDisplayString

   Given a date (NSDate), it returns a string representation of it with only the date
   */
  class func dateToDayDisplayString(date: NSDate, withFormat format: String,
    withTimeZone timezone: NSTimeZone? = nil, withCalendarIdentifier calendarIdentifier: String? = nil) -> String {
      if let timezone = timezone {
        displayDateFormatter.timeZone = timezone
      } else {
        displayDateFormatter.timeZone = NSTimeZone(name: "UTC")
      }

      displayDateFormatter.dateFormat = format

      if let calendarIdentifier = calendarIdentifier {
        displayDateFormatter.calendar = NSCalendar(calendarIdentifier: calendarIdentifier)
      }
      // This next line says always reset the calendar to the default one even after the return
      defer {
        if let _ = calendarIdentifier {
          displayDateFormatter.calendar = NSCalendar(identifier: NSDate.defaultCalendarIdentifier())
        }
      }
      return displayDateFormatter.stringFromDate(date)
  }
```



