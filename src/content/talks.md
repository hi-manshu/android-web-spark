# Talks

Everything on https://sessionize.com/himanshoe is pulled in automatically.
This file adds two things on top of that:

## 1. Events that are not on Sessionize

One line per event, columns separated by `|`:

    name | month year | city, country | link (optional) | upcoming (optional)

Dates can be `Nov 2022`, `November 2022`, `2022-11`, or with a day like `22 Oct 2026`
(the day only matters for the Upcoming badge, which disappears after it).
Write `Online` as the location for virtual events.

- DevFest New Delhi 2022 | Nov 2022 | New Delhi, India
- DevFest Hamburg 2022 | Apr 2022 | Hamburg, Germany
- GDG Baroda DevFest 2019 | Nov 2019 | Vadodara, India

## 2. Slides, recordings and links for any event

Start a section with the event's name exactly as it appears on the timeline,
then add any of these lines:

    Talk: title of the session
    Slides: a URL, or a file you put in public/slides/ such as /slides/droidcon-berlin-2025.pdf
    Video: a YouTube link
    Link: label | URL        (repeat for more links)

PDFs in public/slides, Google Slides and YouTube open in a viewer on the site.
Anything else opens in a new tab. Sections whose name matches no event are ignored,
so this template is safe to leave here:

### Example event name (copy me)
Talk: Elevating Your App's Performance
Slides: /slides/example.pdf
Video: https://www.youtube.com/watch?v=xxxxxxxxxxx
Link: Conference page | https://example.com
