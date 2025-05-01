# Image Upload Instructions

## File Structure
To display images in the survey form, place your JPG files in this directory following this naming convention:

```
/public/images/[number].jpg
```

## Naming Convention
The image number is calculated as follows:

1. Each user group (1-60) has a range of 500 images
2. Page 2 starts at the base number: (group_number - 1) * 500
3. Each subsequent page increments by 1 from the base number

### Examples for Group 1:
- Page 2: Image 0.jpg
- Page 3: Image 1.jpg
- Page 4: Image 2.jpg
- Page 5: Image 3.jpg
...
- Page 501: Image 499.jpg

### Examples for Group 2:
- Page 2: Image 500.jpg
- Page 3: Image 501.jpg
- Page 4: Image 502.jpg
- Page 5: Image 503.jpg
...
- Page 501: Image 999.jpg

### Examples for Group 60:
- Page 2: Image 29500.jpg
- Page 3: Image 29501.jpg
- Page 4: Image 29502.jpg
...
- Page 501: Image 29999.jpg

## How to Upload
1. Upload your images to this directory (`/public/images/`)
2. Ensure they follow the naming pattern above
3. Use JPG format for compatibility
4. Recommended image size: 600x400 pixels for optimal display

The system will automatically load the images based on the user's group selection and current form page.