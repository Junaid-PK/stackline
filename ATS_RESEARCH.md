# ATS resume research remembered by Stackline

Research date: July 30, 2026

This is the product's working rule set for software candidates with 3–8+ years of experience. It is intentionally conservative: ATS products differ, so the generator avoids structures that a major ATS vendor explicitly identifies as parsing risks.

## Key rules implemented

1. **Keep the exported resume to one text column.** Do not use tables, text boxes, sidebars, graphics, photos, word art, or rating bars. Greenhouse lists columned layouts, complex tables, graphics, and photos among common causes of unsuccessful parsing.
2. **Put contact information in the document body.** Do not place the candidate's name, phone, email, or location in a page header or footer.
3. **Use standard, explicit section names.** Stackline exports `Professional Summary`, `Technical Skills`, `Professional Experience`, and `Education`.
4. **Use complete names and job titles.** Avoid ambiguous abbreviations such as “Sr. Acct. Exec.” Spell out degrees such as “Bachelor of Science.”
5. **Use reverse-chronological experience.** Experienced software candidates should lead with their current or most recent work, not a projects or education section.
6. **Tailor truthfully to each posting.** Reuse exact, recognizable job-description terms only where the candidate has real experience. Include technical terms in context, not as hidden or stuffed keywords.
7. **Write accomplishments, not job descriptions.** Strong bullets use an action + technical method + result structure. Quantify latency, reliability, traffic, cost, revenue, delivery time, incident rate, team size, or adoption when the evidence exists.
8. **Use concise, factual language.** Start bullets with specific action verbs, avoid first-person pronouns, and keep formatting consistent and easy to skim.
9. **Export real text.** The PDF generator writes selectable text rather than rasterizing the resume as an image. DOCX is offered as the safest default, while the job posting's explicit file-format instruction always wins.
10. **Verify the final file.** Open the download, select all text, and paste it into a plain-text editor. Check that the reading order remains correct.

## Product decisions for 3–8+ year software careers

- Supported targets are software engineering specialties and engineering management.
- Experience selection starts at 3 years and ends at 8+.
- The professional summary emphasizes level, production scope, specialization, and measurable impact.
- The skills area favors recognized languages, frameworks, databases, cloud platforms, and engineering practices.
- Experience receives more visual and scoring weight than education or personal projects.
- The readiness score rewards complete contact details, a focused summary, at least eight relevant skills, complete roles, four or more achievement bullets, metrics in at least half the bullets, strong action verbs, and job-description coverage.
- Missing job terms are recommendations to review, never instructions to claim experience the candidate does not have.

## Sources

- [Greenhouse Support: Unsuccessful resume parse](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse) — parser failure modes including columns, tables, headers/footers, images, unclear sections, and abbreviated titles.
- [Harvard FAS Mignone Center: Guide to Creating a Strong Resume](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/) — specific, active, fact-based language; reverse chronological order; consistent formatting; and result-oriented writing.
- [MIT CAPD: Crafting an effective resume](https://capd.mit.edu/resources/career-toolkit-crafting-an-effective-resume/) — Project–Action–Result accomplishment statements and quantified outcomes.
- [MIT CAPD: Resumes](https://capd.mit.edu/resources/resumes/) — familiar formats, conservative type, strong action verbs, technical specificity, and accomplishments over responsibilities.
- [Indeed: ATS-friendly resume tips](https://www.indeed.com/career-advice/resumes-cover-letters/automated-screening-resume) — job-description keyword matching, context, standard sections, contact information in the body, single-column structure, and DOCX guidance.

## Caveat

No layout or score can guarantee an interview or universal ATS compatibility. Hiring systems use different parsers and employer-specific screening rules. Stackline's score is a transparent writing and formatting checklist, not a prediction of hiring outcomes.
