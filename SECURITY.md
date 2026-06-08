# Security Policy

## Reporting a vulnerability

Please do not publish sensitive security details in a public Issue, Pull Request,
or Discussion.

If GitHub shows a private vulnerability reporting option for this repository,
use that path. If no private option is available, contact maintainer
`@postmelee` through the contact path shown on the GitHub profile, or open a
minimal public Issue asking for private security follow-up without including
exploit details.

Useful reports include:

- The affected `crop` version, commit, or Chrome Web Store release
- Browser and operating system details
- Clear reproduction steps
- Expected impact
- Whether the issue can expose screenshots, page data, clipboard contents, or
  downloaded files

## Supported scope

Security reports are most useful when they affect the current Chrome Web Store
release or active repository development work.

Examples of in-scope topics:

- Chrome extension permission or privilege issues
- Screenshot, clipboard, or download handling that exposes user data
- Overlay or content script behavior that leaks page data
- Firefox-derived source attribution or license-boundary mistakes with security
  impact

Examples that are usually out of scope:

- Vulnerabilities in unrelated websites captured by the user
- Browser or operating system vulnerabilities outside `crop`
- Social engineering against maintainers or users
- Reports that require broad host permissions, `debugger`, or unsupported
  privileged APIs that `crop` does not request

## Response expectations

`crop` is a small open source project. Response time may vary, but reports that
could expose user data, screenshots, clipboard contents, downloads, or extension
permissions will be prioritized.

The maintainer may ask for a reduced reproduction case before confirming scope
or impact. Public disclosure should wait until a fix or mitigation path has been
agreed where practical.
