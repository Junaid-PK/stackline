import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from 'docx'
import { jsPDF } from 'jspdf'
import { experienceDates, splitLines, splitSkills } from './resume'
import type { ResumeData } from './types'

const safeFileName = (name: string) =>
  `${name.trim().replace(/[^a-z0-9]+/gi, '-') || 'Software-Engineer'}-Resume`

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

const addPdfText = (
  pdf: jsPDF,
  text: string,
  options: { size?: number; bold?: boolean; indent?: number; gap?: number } = {},
) => {
  const margin = 18
  const width = 210 - margin * 2 - (options.indent ?? 0)
  const lineHeight = (options.size ?? 9.5) * 0.42
  const lines = pdf.splitTextToSize(text, width) as string[]
  const state = pdf as jsPDF & { __cursorY?: number }
  let y = state.__cursorY ?? margin
  const needed = lines.length * lineHeight + (options.gap ?? 0)

  if (y + needed > 278) {
    pdf.addPage()
    y = margin
  }

  pdf.setFont('helvetica', options.bold ? 'bold' : 'normal')
  pdf.setFontSize(options.size ?? 9.5)
  pdf.text(lines, margin + (options.indent ?? 0), y)
  state.__cursorY = y + lines.length * lineHeight + (options.gap ?? 0)
}

const addPdfSection = (pdf: jsPDF, title: string) => {
  const state = pdf as jsPDF & { __cursorY?: number }
  const currentY = state.__cursorY ?? 18
  state.__cursorY = currentY + 2
  addPdfText(pdf, title.toUpperCase(), { size: 10, bold: true, gap: 1.5 })
  const lineY = (state.__cursorY ?? currentY) - 0.5
  pdf.setDrawColor(35, 56, 78)
  pdf.setLineWidth(0.35)
  pdf.line(18, lineY, 192, lineY)
  state.__cursorY = lineY + 4
}

export const downloadPdf = (data: ResumeData) => {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  const state = pdf as jsPDF & { __cursorY?: number }
  state.__cursorY = 18
  pdf.setProperties({
    title: `${data.fullName || 'Software Engineer'} Resume`,
    subject: data.targetRole,
    author: data.fullName,
  })

  addPdfText(pdf, data.fullName || 'Your Name', { size: 18, bold: true, gap: 1 })
  addPdfText(
    pdf,
    [data.email, data.phone, data.location, data.linkedin, data.github]
      .filter(Boolean)
      .join('  |  '),
    { size: 8.5, gap: 4 },
  )
  addPdfSection(pdf, 'Professional Summary')
  addPdfText(pdf, data.summary, { gap: 3 })
  addPdfSection(pdf, 'Technical Skills')
  addPdfText(pdf, splitSkills(data.skills).join(', '), { gap: 3 })
  addPdfSection(pdf, 'Professional Experience')

  data.experiences
    .filter((item) => item.company || item.title)
    .forEach((item) => {
      addPdfText(pdf, `${item.title} | ${item.company}`, {
        size: 10,
        bold: true,
        gap: 0.5,
      })
      addPdfText(
        pdf,
        [item.location, experienceDates(item)].filter(Boolean).join(' | '),
        { size: 8.5, gap: 1 },
      )
      splitLines(item.achievements).forEach((bullet) => {
        addPdfText(pdf, `•  ${bullet}`, { indent: 2.5, gap: 1 })
      })
      state.__cursorY = (state.__cursorY ?? 18) + 1.5
    })

  if (data.education.school || data.education.degree) {
    addPdfSection(pdf, 'Education')
    addPdfText(
      pdf,
      [data.education.degree, data.education.field].filter(Boolean).join(' in '),
      { bold: true, gap: 0.5 },
    )
    addPdfText(
      pdf,
      [data.education.school, data.education.graduationYear].filter(Boolean).join(' | '),
    )
  }

  pdf.save(`${safeFileName(data.fullName)}.pdf`)
}

const sectionHeading = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 180, after: 80 },
    border: {
      bottom: {
        color: '23384E',
        size: 6,
        style: BorderStyle.SINGLE,
      },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 20,
        font: 'Arial',
      }),
    ],
  })

export const downloadDocx = async (data: ResumeData) => {
  const body: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: data.fullName || 'Your Name',
          bold: true,
          size: 34,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: [data.email, data.phone, data.location, data.linkedin, data.github]
            .filter(Boolean)
            .join(' | '),
          size: 18,
          font: 'Arial',
        }),
      ],
    }),
    sectionHeading('Professional Summary'),
    new Paragraph({
      spacing: { after: 80, line: 260 },
      children: [new TextRun({ text: data.summary, size: 20, font: 'Arial' })],
    }),
    sectionHeading('Technical Skills'),
    new Paragraph({
      spacing: { after: 80, line: 260 },
      children: [
        new TextRun({
          text: splitSkills(data.skills).join(', '),
          size: 20,
          font: 'Arial',
        }),
      ],
    }),
    sectionHeading('Professional Experience'),
  ]

  data.experiences
    .filter((item) => item.company || item.title)
    .forEach((item) => {
      body.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: `${item.title} | ${item.company}`,
              bold: true,
              size: 21,
              font: 'Arial',
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: [item.location, experienceDates(item)].filter(Boolean).join(' | '),
              italics: true,
              size: 18,
              font: 'Arial',
            }),
          ],
        }),
        ...splitLines(item.achievements).map(
          (bullet) =>
            new Paragraph({
              text: bullet,
              bullet: { level: 0 },
              spacing: { after: 40, line: 250 },
              style: 'Normal',
            }),
        ),
      )
    })

  if (data.education.school || data.education.degree) {
    body.push(
      sectionHeading('Education'),
      new Paragraph({
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: [data.education.degree, data.education.field].filter(Boolean).join(' in '),
            bold: true,
            size: 20,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: [data.education.school, data.education.graduationYear]
              .filter(Boolean)
              .join(' | '),
            size: 19,
            font: 'Arial',
          }),
        ],
      }),
    )
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 20 },
          paragraph: { spacing: { after: 40 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: body,
      },
    ],
  })
  const blob = await Packer.toBlob(doc)
  saveBlob(blob, `${safeFileName(data.fullName)}.docx`)
}
