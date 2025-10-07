# Make It Fast

A powerful document processing app that uses Google's Gemini AI to simplify and organize your documents.

## Features

- **Document Upload**: Drag and drop support for text files, PDFs, Word docs, Excel sheets, and CSVs
- **AI Processing**: Uses Gemini 2.0 Flash to analyze and process your documents
- **Multiple Output Options**:
  - Two-sentence summary with bullet points
  - Calendar event extraction with iCal file generation
  - Action-oriented to-do list generation
- **Export Options**:
  - Copy text to clipboard
  - Download as PDF
  - Email results (requires SMTP configuration)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Add Content**: Either paste text directly or drag and drop files into the upload area
2. **Select Outputs**: Choose which outputs you want (all are selected by default)
3. **Process**: Click "Make It Fast" to process your content
4. **Review Results**: View and interact with the generated summaries, events, and tasks
5. **Export**: Copy, download as PDF, or email the results

## Notes

- The app is session-based - no data is saved after you close the browser
- PDF parsing requires additional server configuration for full functionality
- Email sending requires SMTP configuration in production

## Technologies Used

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Google Gemini AI
- React Dropzone for file uploads
- Various file parsing libraries (mammoth, xlsx, pdf-parse)