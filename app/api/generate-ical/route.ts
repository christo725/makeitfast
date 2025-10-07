import { NextRequest, NextResponse } from 'next/server';
import { createEvents, EventAttributes } from 'ics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events = Array.isArray(body) ? body : [body];

    const icsEvents: EventAttributes[] = events.map((event) => {
      const dateStr = event.date;
      let startDate: number[] = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];

      try {
        if (dateStr && dateStr !== 'TBD') {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            startDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
          }
        }
      } catch (e) {
        console.log('Could not parse date, using today');
      }

      let startTime: number[] | undefined;
      if (event.time) {
        const timeMatch = event.time.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const meridiem = timeMatch[3];

          if (meridiem) {
            if (meridiem.toUpperCase() === 'PM' && hours < 12) hours += 12;
            if (meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;
          }

          startTime = [hours, minutes];
        }
      }

      const icsEvent: EventAttributes = {
        title: event.title,
        description: event.description,
        start: startTime ? ([...startDate, ...startTime] as [number, number, number, number, number]) : (startDate as [number, number, number]),
        duration: startTime ? { hours: 1 } : { days: 1 },
      };

      if (event.location) {
        icsEvent.location = event.location;
      }

      return icsEvent;
    });

    const { error, value } = createEvents(icsEvents);

    if (error) {
      console.error('Error creating iCal:', error);
      return NextResponse.json({ error: 'Failed to create calendar events' }, { status: 500 });
    }

    const filename = events.length === 1
      ? `${events[0].title.replace(/\s+/g, '_')}.ics`
      : 'calendar_events.ics';

    return new NextResponse(value, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating iCal:', error);
    return NextResponse.json({ error: 'Failed to generate iCal file' }, { status: 500 });
  }
}