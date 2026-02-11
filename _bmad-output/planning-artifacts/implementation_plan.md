# Implementation Plan - Story 5.1: PDF Offer Letter Generation (Template Filling)

## Goal Description
Fill student details into a **PDF offer letter template** provided by the user. The system will load the template, replace placeholders with actual student data, and generate personalized offer letters.

## User-Provided Template
The user will provide a PDF offer letter template with placeholders for:
- Student Name
- Roll Number
- College
- Branch
- Email
- Phone
- Start Date
- Other relevant details

## Proposed Changes

### Apps/API (Backend)

#### [NEW] Install Dependencies
```bash
npm install pdf-lib --workspace=api
```

#### [NEW] Create Template Directory
- Create `apps/api/templates/` folder
- Store `offer-letter-template.pdf` here

#### [NEW] [src/services/pdfGenerator.ts](file:///c:/Users/Srishti/OneDrive/Documents/Desktop/ims/apps/api/src/services/pdfGenerator.ts)
- Create `fillOfferLetterTemplate(student)` function
- Load PDF template from `templates/` folder
- Use pdf-lib to:
  - Load existing PDF
  - Find and replace text placeholders
  - Or fill PDF form fields (if template has form fields)
- Return filled PDF as buffer

#### [NEW] [src/controllers/offerController.ts](file:///c:/Users/Srishti/OneDrive/Documents/Desktop/ims/apps/api/src/controllers/offerController.ts)
- Add `generateOffer` endpoint
- Fetch student by ID
- Call PDF generator service
- Return PDF with proper headers (`Content-Type: application/pdf`)

#### [NEW] [src/routes/offerRoutes.ts](file:///c:/Users/Srishti/OneDrive/Documents/Desktop/ims/apps/api/src/routes/offerRoutes.ts)
- Add `GET /api/offer/:studentId` route
- Mount in main app

### Apps/Web (Frontend)

#### [MODIFY] [src/components/admin/StudentProfileSheet.tsx](file:///c:/Users/Srishti/OneDrive/Documents/Desktop/ims/apps/web/src/components/admin/StudentProfileSheet.tsx)
- Add "Generate Offer Letter" button
- Show only for students with status "hired"
- On click: Download PDF from `/api/offer/:studentId`

## PDF Template Approach

**Option 1: Text Replacement (Simple)**
```typescript
// Replace placeholders like {{NAME}}, {{ROLL_NO}}, etc.
const pdfDoc = await PDFDocument.load(templateBytes);
const pages = pdfDoc.getPages();
// Draw text over placeholders
```

**Option 2: PDF Form Fields (Recommended)**
```typescript
// If template has form fields
const form = pdfDoc.getForm();
form.getTextField('name').setText(student.name);
form.getTextField('rollNo').setText(student.rollNo);
form.flatten(); // Make fields non-editable
```

## Implementation Steps

1. **User provides PDF template**
2. **Save template** to `apps/api/templates/offer-letter-template.pdf`
3. **Identify placeholders** in the PDF (form fields or text markers)
4. **Implement PDF filling** service
5. **Create API endpoint** to generate and download
6. **Add UI button** in student profile

## Verification Plan

### Manual Verification
1. Upload offer letter template to `apps/api/templates/`
2. Navigate to student profile (status = "hired")
3. Click "Generate Offer Letter"
4. Verify PDF downloads with student details filled in
5. Check all placeholders are replaced correctly
6. Verify formatting is preserved

## Next Steps
**Please provide the PDF offer letter template** and I'll:
1. Save it to the templates folder
2. Identify the placeholders/form fields
3. Implement the filling logic
4. Add the download button
