import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { files, textInput, outputOptions } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    let combinedContent = '';

    if (textInput) {
      combinedContent += textInput + '\n\n';
    }

    for (const file of files) {
      combinedContent += `File: ${file.name}\n${file.content}\n\n`;
    }

    const result: any = {};

    if (outputOptions.summary) {
      const summaryPrompt = `You're an extremely organized person. Based ONLY on the following content, create a comprehensive summary.

Content:
${combinedContent}

Provide your response in exactly this format:

SUMMARY:
[Write exactly 2 sentences packed with key facts, numbers, dates, and essential information. Make every word count.]

KEY POINTS:
- [First key insight]
- [Second key insight]
- [Third key insight]
[Continue with more key points as needed, maximum 10 total]

ACTION ITEMS:
- [First actionable task]
- [Second actionable task]
- [Third actionable task]
[Continue with more action items as needed, maximum 10 total]

LINKS SHARED:
URL: [full URL]
Label: [one line description of what this link is about]
---
[repeat for each unique link found]

Important:
- Summary must be exactly 2 sentences, dense with facts
- Include specific numbers, dates, names, and concrete details in the summary
- Key points should be insights and important information (not actions)
- Action items should be specific things the reader needs to DO
- Each bullet point should be concise (under 20 words)
- For links, extract ALL URLs (http://, https://, www.) from the content
- Group similar links together and provide a clear one-line label for each
- If no links found, write "No links found"
- Use clear, simple language`;

      const summaryResult = await model.generateContent(summaryPrompt);
      const summaryText = summaryResult.response.text();

      console.log('Raw Gemini summary response:', summaryText);

      const summaryMatch = summaryText.match(/SUMMARY:?\s*\n([\s\S]*?)(?=\n\s*KEY POINTS:?|$)/i);
      const keyPointsMatch = summaryText.match(/KEY POINTS:?\s*\n([\s\S]*?)(?=\n\s*ACTION ITEMS:?|$)/i);
      const actionItemsMatch = summaryText.match(/ACTION ITEMS:?\s*\n([\s\S]*?)(?=\n\s*LINKS SHARED:?|$)/i);
      const linksMatch = summaryText.match(/LINKS SHARED:?\s*\n([\s\S]*?)$/i);

      if (summaryMatch) {
        result.summary = summaryMatch[1].trim();
      }

      if (keyPointsMatch) {
        result.bulletPoints = keyPointsMatch[1]
          .split('\n')
          .filter(line => {
            const trimmed = line.trim();
            return trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');
          })
          .map(line => line.replace(/^[\s\-•*]+/, '').trim())
          .filter(line => line.length > 0);
      }

      if (actionItemsMatch) {
        result.todoList = actionItemsMatch[1]
          .split('\n')
          .filter(line => {
            const trimmed = line.trim();
            return trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');
          })
          .map(line => line.replace(/^[\s\-•*]+/, '').trim())
          .filter(line => line.length > 0);
      }

      if (linksMatch) {
        const linksText = linksMatch[1].trim();
        if (linksText.toLowerCase().includes('no links found')) {
          result.links = [];
        } else {
          const linkBlocks = linksText.split('---').filter(block => block.trim());
          result.links = linkBlocks.map((block, index) => {
            const urlMatch = block.match(/URL:\s*([^\n]+)/i);
            const labelMatch = block.match(/Label:\s*([^\n]+)/i);

            return {
              id: `link-${index}`,
              url: urlMatch ? urlMatch[1].trim() : '',
              label: labelMatch ? labelMatch[1].trim() : 'Link'
            };
          }).filter(link => link.url);
        }
      } else {
        result.links = [];
      }
    }

    if (outputOptions.calendar) {
      const currentYear = new Date().getFullYear();
      const calendarPrompt = `Based ONLY on the following content, identify any calendar events, meetings, deadlines, or scheduled activities mentioned.

Content:
${combinedContent}

Current year is ${currentYear}. If a date doesn't include a year, assume ${currentYear}.

For each event you find, provide it in this EXACT format:

EVENT:
Title: [Brief event name]
Date: [Date in YYYY-MM-DD format. If year is not specified, use ${currentYear}]
Time: [Time if mentioned, otherwise write "Not specified"]
Location: [Location if mentioned, otherwise write "Not specified"]
Description: [1-2 sentences with specific details about what will happen at this event, who's involved, what's being discussed, or what needs to be done. Include context from the original content. DO NOT just repeat the event title.]
---

Important:
- Only include events that have clear dates or timeframes
- If a date like "Oct 10" is mentioned without a year, assume October 10, ${currentYear}
- Descriptions should be detailed and informative (1-2 sentences), providing context and specific details from the content
- DO NOT make the description just a restatement of the title
- Include relevant details like attendees, agenda items, deliverables, or purpose
- Separate each event with exactly "---"
- If no events are found, respond with "No events found"`;

      const calendarResult = await model.generateContent(calendarPrompt);
      const calendarText = calendarResult.response.text();

      console.log('Raw Gemini calendar response:', calendarText);

      if (calendarText.toLowerCase().includes('no events found')) {
        result.calendarEvents = [];
      } else {
        const events = calendarText.split('---').filter(e => e.trim() && e.trim().toLowerCase() !== 'no events found');
        const parsedEvents = events.map((eventText, index) => {
          const titleMatch = eventText.match(/Title:\s*([^\n]+)/i);
          const dateMatch = eventText.match(/Date:\s*([^\n]+)/i);
          const timeMatch = eventText.match(/Time:\s*([^\n]+)/i);
          const locationMatch = eventText.match(/Location:\s*([^\n]+)/i);
          const descMatch = eventText.match(/Description:\s*([^\n]+)/i);

          const title = titleMatch ? titleMatch[1].trim() : 'Event';
          const date = dateMatch ? dateMatch[1].trim() : 'TBD';
          const time = timeMatch && timeMatch[1].trim().toLowerCase() !== 'not specified' ? timeMatch[1].trim() : undefined;
          const location = locationMatch && locationMatch[1].trim().toLowerCase() !== 'not specified' ? locationMatch[1].trim() : undefined;
          const description = descMatch ? descMatch[1].trim() : '';

          return {
            id: `event-${index}`,
            title,
            date,
            time,
            location,
            description,
          };
        }).filter(e => e.title !== 'Event' || e.date !== 'TBD');

        // Remove duplicates based on title and date
        const uniqueEvents = parsedEvents.reduce((acc: any[], current: any) => {
          const isDuplicate = acc.some(event =>
            event.title.toLowerCase() === current.title.toLowerCase() &&
            event.date === current.date
          );
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Group multi-day events with same title
        const groupedEvents = uniqueEvents.reduce((acc: any[], current: any) => {
          const existingEvent = acc.find(event =>
            event.title.toLowerCase() === current.title.toLowerCase() &&
            event.description === current.description
          );

          if (existingEvent && existingEvent.date !== current.date) {
            // Check if dates are consecutive or part of a range
            const existingDate = new Date(existingEvent.date);
            const currentDate = new Date(current.date);
            const diffDays = Math.abs((currentDate.getTime() - existingDate.getTime()) / (1000 * 3600 * 24));

            if (diffDays <= 7) { // Within a week, likely same event
              // Update to date range
              const startDate = existingDate < currentDate ? existingEvent.date : current.date;
              const endDate = existingDate < currentDate ? current.date : existingEvent.date;
              existingEvent.date = `${startDate} to ${endDate}`;
              return acc;
            }
          }

          acc.push(current);
          return acc;
        }, []);

        result.calendarEvents = groupedEvents;
      }
    }


    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    return NextResponse.json({ error: 'Failed to process content' }, { status: 500 });
  }
}
