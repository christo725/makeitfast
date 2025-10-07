'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Trash2 } from 'lucide-react';
import { Container, Box, Typography, Button, TextField, Checkbox, FormControlLabel, Paper, Grid } from '@mui/material';

interface UploadedFile {
  name: string;
  type: string;
  content: string;
}

export default function HomePage() {
  const [textInput, setTextInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [outputOptions, setOutputOptions] = useState({
    summary: true,
    calendar: true,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<any>(null);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [editedEventTitles, setEditedEventTitles] = useState<{ [key: string]: string }>({});
  const [editedEventDates, setEditedEventDates] = useState<{ [key: string]: string }>({});
  const [editedEventTimes, setEditedEventTimes] = useState<{ [key: string]: string }>({});
  const [editedEventDescriptions, setEditedEventDescriptions] = useState<{ [key: string]: string }>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/parse-file', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedFiles(prev => [...prev, {
            name: file.name,
            content: data.content,
            type: file.type,
          }]);
        }
      } catch (error) {
        console.error('Error parsing file:', error);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (uploadedFiles.length === 0 && !textInput.trim()) {
      alert('Please add some content to process');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: uploadedFiles,
          textInput,
          outputOptions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProcessedResult(data);

        if (data.calendarEvents) {
          setSelectedEvents(new Set(data.calendarEvents.map((e: any) => e.id)));
        }
      }
    } catch (error) {
      console.error('Error processing:', error);
      alert('Error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const selectAllEvents = () => {
    if (processedResult?.calendarEvents) {
      setSelectedEvents(new Set(processedResult.calendarEvents.map((e: any) => e.id)));
    }
  };

  const deselectAllEvents = () => {
    setSelectedEvents(new Set());
  };

  const updateEventTitle = (eventId: string, newTitle: string) => {
    setEditedEventTitles(prev => ({ ...prev, [eventId]: newTitle }));
  };

  const updateEventDate = (eventId: string, newDate: string) => {
    setEditedEventDates(prev => ({ ...prev, [eventId]: newDate }));
  };

  const updateEventTime = (eventId: string, newTime: string) => {
    setEditedEventTimes(prev => ({ ...prev, [eventId]: newTime }));
  };

  const updateEventDescription = (eventId: string, newDescription: string) => {
    setEditedEventDescriptions(prev => ({ ...prev, [eventId]: newDescription }));
  };

  const deleteEvent = (eventId: string) => {
    setProcessedResult((prev: any) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter((e: any) => e.id !== eventId)
    }));
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
    setEditedEventTitles(prev => {
      const { [eventId]: _, ...rest } = prev;
      return rest;
    });
    setEditedEventDates(prev => {
      const { [eventId]: _, ...rest } = prev;
      return rest;
    });
    setEditedEventTimes(prev => {
      const { [eventId]: _, ...rest } = prev;
      return rest;
    });
    setEditedEventDescriptions(prev => {
      const { [eventId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleAddSelectedEvents = async () => {
    if (!processedResult?.calendarEvents) return;

    const eventsToAdd = processedResult.calendarEvents
      .filter((e: any) => selectedEvents.has(e.id))
      .map((e: any) => ({
        ...e,
        title: editedEventTitles[e.id] || e.title,
        date: editedEventDates[e.id] || e.date,
        time: editedEventTimes[e.id] !== undefined ? editedEventTimes[e.id] : e.time,
        description: editedEventDescriptions[e.id] || e.description,
      }));

    if (eventsToAdd.length === 0) {
      alert('Please select at least one event');
      return;
    }

    try {
      const response = await fetch('/api/generate-ical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventsToAdd),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = eventsToAdd.length === 1
          ? `${eventsToAdd[0].title.replace(/\s+/g, '_')}.ics`
          : 'calendar_events.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        alert(`${eventsToAdd.length} event${eventsToAdd.length > 1 ? 's' : ''} downloaded!`);
      } else {
        const error = await response.json();
        console.error('Calendar generation error:', error);
        alert('Failed to generate calendar file. Check console for details.');
      }
    } catch (error) {
      console.error('Error generating iCal:', error);
      alert('Error generating calendar file.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const generateFullText = () => {
    let text = '';

    if (processedResult?.summary) {
      text += `Summary:\n${processedResult.summary}\n\n`;
    }

    if (processedResult?.bulletPoints && processedResult.bulletPoints.length > 0) {
      text += `Key Points:\n${processedResult.bulletPoints.map((p: string) => `• ${p}`).join('\n')}\n\n`;
    }

    if (processedResult?.todoList && processedResult.todoList.length > 0) {
      text += `Action Items:\n${processedResult.todoList.map((t: string) => `• ${t}`).join('\n')}\n\n`;
    }

    if (processedResult?.links && processedResult.links.length > 0) {
      text += `Links Shared:\n${processedResult.links.map((link: any) =>
        `• ${link.label}\n  ${link.url}`
      ).join('\n')}\n\n`;
    }

    if (processedResult?.calendarEvents && processedResult.calendarEvents.length > 0) {
      // Sort events by date
      const sortedEvents = [...processedResult.calendarEvents].sort((a: any, b: any) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      text += `Calendar Events:\n${sortedEvents.map((e: any) =>
        `• ${e.date}${e.time ? ` at ${e.time}` : ''} - ${e.title}${e.location ? ` (${e.location})` : ''}`
      ).join('\n')}`;
    }

    return text;
  };

  const handleDownloadPDF = async () => {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: generateFullText(),
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'make-it-fast-summary.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };


  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 900 }}>
          Make It Fast
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Transform long emails or docs into short lists and calendar events
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ bgcolor: '#fff3cd', color: '#856404', py: 1, px: 2, borderRadius: 1 }}>
            (No data is saved or stored in this app. Copy or download before clicking away!)
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <TextField
            label="Paste Original Text Here"
            multiline
            fullWidth
            rows={8}
            variant="outlined"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box {...getRootProps()} sx={{ border: '2px dashed', p: 3, textAlign: 'center', mb: 3 }}>
            <input {...getInputProps()} />
            <Typography variant="body1">
              {isDragActive ? 'Drop the files here...' : 'Or You Can Drag and Drop PDFs or Docs Here'}
            </Typography>
          </Box>

          {uploadedFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {uploadedFiles.map((file: UploadedFile, index: number) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">{file.name}</Typography>
                  <Button variant="outlined" color="error" onClick={() => removeFile(index)}>
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 3 }}>
            <FormControlLabel
              control={<Checkbox checked={outputOptions.summary} onChange={(e) => setOutputOptions(prev => ({ ...prev, summary: e.target.checked }))} />}
              label="Generate Summary (includes key points and action items)"
            />
            <FormControlLabel
              control={<Checkbox checked={outputOptions.calendar} onChange={(e) => setOutputOptions(prev => ({ ...prev, calendar: e.target.checked }))} />}
              label="Extract Calendar Events"
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleProcess}
            disabled={isProcessing}
            sx={{ py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            {isProcessing ? 'Processing...' : "Let's Go"}
          </Button>
        </Box>

        {processedResult && (
          <Box sx={{ mt: 4 }}>
            {/* Summary Section */}
            {processedResult.summary && (
              <Box sx={{ mb: 2, p: 3, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Summary</Typography>
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(processedResult.summary)}
                  >
                    Copy
                  </Button>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{processedResult.summary}</Typography>
              </Box>
            )}

            {/* Key Points Section */}
            {processedResult.bulletPoints && processedResult.bulletPoints.length > 0 && (
              <Box sx={{ mb: 2, p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Key Points</Typography>
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(processedResult.bulletPoints.map((p: string) => `• ${p}`).join('\n'))}
                  >
                    Copy
                  </Button>
                </Box>
                <ul style={{ lineHeight: 1.5 }}>
                  {processedResult.bulletPoints.map((point: string, index: number) => (
                    <li key={index} style={{ marginBottom: '12px' }}>
                      <Typography variant="body1">{point}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {/* Action Items Section */}
            {processedResult.todoList && processedResult.todoList.length > 0 && (
              <Box sx={{ mb: 2, p: 3, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Action Items</Typography>
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(processedResult.todoList.map((t: string) => `• ${t}`).join('\n'))}
                  >
                    Copy
                  </Button>
                </Box>
                <ul style={{ lineHeight: 1.5 }}>
                  {processedResult.todoList.map((item: string, index: number) => (
                    <li key={index} style={{ marginBottom: '12px' }}>
                      <Typography variant="body1">{item}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {/* Links Shared Section */}
            {processedResult.links && processedResult.links.length > 0 && (
              <Box sx={{ mb: 2, p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Links Shared</Typography>
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(processedResult.links.map((link: any) => `${link.label}\n${link.url}`).join('\n\n'))}
                  >
                    Copy
                  </Button>
                </Box>
                {processedResult.links.map((link: any) => (
                  <Box key={link.id} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>{link.label}</Typography>
                    <Typography
                      variant="body2"
                      component="a"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                        wordBreak: 'break-all'
                      }}
                    >
                      {link.url}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {processedResult.calendarEvents && processedResult.calendarEvents.length > 0 && (
              <Box sx={{ mb: 3, p: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Calendar Events</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={selectAllEvents}>
                      Select All
                    </Button>
                    <Button size="small" variant="outlined" onClick={deselectAllEvents}>
                      Deselect All
                    </Button>
                    <Button
                      size="small"
                      onClick={() => copyToClipboard(
                        `Calendar Events:\n${processedResult.calendarEvents.map((e: any) =>
                          `• ${editedEventTitles[e.id] || e.title} - ${e.date}${e.time ? ` at ${e.time}` : ''}${e.location ? ` (${e.location})` : ''}\n  ${e.description}`
                        ).join('\n')}`
                      )}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontStyle: 'italic' }}>
                  This tool can make mistakes, double check super important dates!
                </Typography>
                {processedResult.calendarEvents.map((event: any) => (
                  <Box key={event.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: selectedEvents.has(event.id) ? '#f0f7ff' : 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Checkbox
                        checked={selectedEvents.has(event.id)}
                        onChange={() => toggleEventSelection(event.id)}
                        sx={{ mt: 0.5 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          variant="standard"
                          label="Event Title"
                          value={editedEventTitles[event.id] !== undefined ? editedEventTitles[event.id] : event.title}
                          onChange={(e) => updateEventTitle(event.id, e.target.value)}
                          sx={{ mb: 1, '& input': { fontWeight: 'bold', fontSize: '1rem' } }}
                        />
                        <TextField
                          fullWidth
                          variant="standard"
                          label="Description"
                          multiline
                          value={editedEventDescriptions[event.id] !== undefined ? editedEventDescriptions[event.id] : event.description}
                          onChange={(e) => updateEventDescription(event.id, e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mb: 0.5 }}>
                          <TextField
                            variant="standard"
                            label="Date (YYYY-MM-DD)"
                            value={editedEventDates[event.id] !== undefined ? editedEventDates[event.id] : event.date}
                            onChange={(e) => updateEventDate(event.id, e.target.value)}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            variant="standard"
                            label="Time (optional)"
                            value={editedEventTimes[event.id] !== undefined ? editedEventTimes[event.id] : (event.time || '')}
                            onChange={(e) => updateEventTime(event.id, e.target.value)}
                            sx={{ flex: 1 }}
                          />
                        </Box>
                        {event.location && (
                          <Typography variant="caption" color="text.secondary">
                            Location: {event.location}
                          </Typography>
                        )}
                      </Box>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => deleteEvent(event.id)}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Box>
                  </Box>
                ))}
                <Typography variant="body1" sx={{ display: 'block', mt: 4, mb: 2, color: 'black', textAlign: 'center' }}>
                  Download your selected events as a single iCal file that you can import into any calendar app:
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleAddSelectedEvents}
                  disabled={selectedEvents.size === 0}
                  fullWidth
                  sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  Download {selectedEvents.size > 0 && `${selectedEvents.size} `}Event{selectedEvents.size !== 1 ? 's' : ''} to iCal
                </Button>
              </Box>
            )}

            {/* Export Options */}
            <Box sx={{ mt: 4, p: 3, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#f9f9f9' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Export</Typography>
              <Button
                variant="outlined"
                onClick={handleDownloadPDF}
                fullWidth
                sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Download Everything as a PDF
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
