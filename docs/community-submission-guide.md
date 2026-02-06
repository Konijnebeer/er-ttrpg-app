# Community Resource Submission Guide

Use this guide to format your JSON and folder structure for the community section.

## Folder Structure

Place your resource in the public community folder:

```
public/
  community/
    manifest.json
    your-resource-id/
      preview.webp
      your-resource-1.0.png
      your-resource-1.0.pdf
```

- Use a folder name that matches your `id`.
- Use lowercase, numbers, and hyphens only.
- Use a lower resolution WEBP format as a preview image to optimize loading.

## Manifest Entry

Add your resource to `public/community/manifest.json`:

```
{
  "id": "your-resource-id",
  "title": "Your Resource Title",
  "preview": "preview.webp",
  "contributors": [
    {
      "title": "Creator",
      "name": "Your Name",
      "contact": [
        {
          "type": "Type",
          "name": "your-handle",
          "url": "https://example.com"
        }
      ]
    }
  ],
  "links": [
    {
      "name": "Download PNG",
      "type": "Download-image",
      "source": "your-resource-1.0.png"
    },
    {
      "name": "Download PDF",
      "type": "Download-pdf",
      "source": "your-resource-1.0.pdf"
    },
    {
      "name": "Website",
      "type": "Website",
      "source": "https://example.com"
    }
  ]
}
```

## The 3 Link Types

You can include up to 3 links, minimum of 1.

### 1) Website

- `type`: `Website`
- `source`: full URL
- Folder/file naming: no file required

Example:

```
{
  "name": "Website",
  "type": "Website",
  "source": "https://example.com"
}
```

### 2) Download Image

- `type`: `Download-image`
- `source`: image file name in your folder
- File naming: `your-resource-1.0.png` (or any versioned name)

Example:

```
{
  "name": "Download PNG",
  "type": "Download-image",
  "source": "your-resource-1.0.png"
}
```

### 3) Download PDF

- `type`: `Download-pdf`
- `source`: PDF file name in your folder
- File naming: `your-resource-1.0.pdf` (or any versioned name)

Example:

```
{
  "name": "Download PDF",
  "type": "Download-pdf",
  "source": "your-resource-1.0.pdf"
}
```

## Contributor Contact Types

Use these `type` values inside `contributors[].contact[]`:

- `Discord`
- `Github`
- `Youtube`
- `Instagram`
- `Bluesky`
- `Patreon`

`url` is optional. If present, it will render as a link. If omitted, it will render as plain text.