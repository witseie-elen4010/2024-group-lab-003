# Title
**ADR 1: Storing Dates in UTC Using Date.now Versus Storing in Local South African Time with Moment-Timezone**

# Status
Accepted

# Context
In software systems that interact with users across multiple time zones or require consistent time-related data processing, the method of storing and handling timestamps is critical. There are typically two approaches to consider: storing dates in Coordinated Universal Time (UTC) using JavaScript's `Date.now()`, or storing them in a local time format such as South African Time (SAST) using libraries like `moment-timezone`. This architectural decision is driven by the need to ensure consistent time tracking, facilitate maintenance, and enhance the scalability of the application.

# Decision
We have decided to adopt the UTC format for storing all timestamps using `Date now()` as opposed to using `moment-timezone` to store them directly in South African Standard Time (SAST). This decision is based on a thorough review of both methodologies, taking into account our application's need for reliability in time-related data across multiple time zones and the ease of maintenance. Conversion from UTC to any local time, including SAST, will be handled at the application's presentation layer during data retrieval and display.

# Consequences
## Benefits:
- **Global Standardization:** Storing dates in UTC is a global best practice for server-side timestamp storage. This eliminates the ambiguity of local time zones and daylight saving time changes, providing a uniform point of reference.
- **Scalability:** As the application grows, handling multiple time zones will become more complex. Storing all dates in UTC sidesteps complications that arise from supporting multiple local times, thereby simplifying time zone management as we scale.
- **Maintenance Simplicity:** Using UTC reduces the complexity in the backend storage of dates, as it avoids the need for conversion at the time of data entry or manipulation. This leads to fewer bugs and simplifies the development process.
- **Accurate Time Calculations:** UTC allows for straightforward and error-free time calculations, such as durations between events or scheduling future events, without the need to consider time zone differences internally.

## Drawbacks:
- **User Experience Complication:** Requires conversion to local time zones at the point of display, adding complexity to the front-end or presentation layers where the conversion logic must be implemented accurately.
- **Dependency on Time Zone Libraries:** Although not used for storage, libraries like `moment-timezone` or `date-fns-tz` are still required for converting UTC to local times for display purposes. This adds an extra dependency and slight overhead to the client-side operations.
- **Potential Performance Impact:** Every retrieval of time data for user presentation involves computational overhead due to the time zone conversion. This can impact performance, particularly in high-load scenarios or when handling large datasets.

**References**
- [Moment.js and moment-timezone library documentation for handling and converting time zones.](https://momentjs.com/timezone/docs/)
- [Articles and best practices on time zone handling by the Internet Engineering Task Task Force (IETF) and World Wide Web Consortium (W3C).](https://www.w3.org/TR/timezone/)

In conclusion, storing timestamps in UTC using `Date.now()` is determined to be the most effective approach for our application's long-term efficiency and scalability. It simplifies backend operations and ensures that our application can easily expand to new markets without significant alterations to its core time-handling architecture. This strategic decision aligns with industry standards and best practices for applications operating across multiple time zones.