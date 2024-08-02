# UAE ID Card Extractor

## Overview

The **UAE ID Card Extractor** is a React component that uses Optical Character Recognition (OCR) to extract and display information from UAE ID cards. This component leverages Tesseract.js to perform OCR on uploaded images, processes the extracted text to identify and clean relevant information, and presents it in an editable form.

## Features

- **Image Upload**: Allows users to upload an image of a UAE ID card.
- **OCR Processing**: Utilizes Tesseract.js for OCR to recognize text from the image.
- **Data Extraction**: Automatically extracts and corrects information such as ID Number, Name, Date of Birth, Nationality, Issued Date, Expiry Date, and Sex.
- **Editable Fields**: Displays extracted data in form fields that users can edit.
- **Loading Indicator**: Provides visual feedback during the OCR process.

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ayak1/aya_killiah_assignment.git
    cd uae-id-card-extractor
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the application**:

    ```bash
    npm start
    ```

    The application will start and be available at `http://localhost:3000`.

## Usage

1. **Upload Image**: Click on the file input to upload an image of a UAE ID card. The image should be clear and contain all necessary details.

2. **Processing**: Once the image is uploaded, the OCR process will begin, and a loading indicator will be displayed.

3. **Review and Edit**: After processing, the extracted data will be displayed in form fields. Review the data and make any necessary edits.

4. **Styling**: Customize the styling of the component by modifying `IdCardExtractor.css`.

## Component Details

- **`IdCardExtractor` Component**:
  - Handles image upload and OCR processing.
  - Displays a loading overlay during processing.
  - Shows extracted data in an editable form.

- **Dependencies**:
  - `react` and `react-dom` for building the user interface.
  - `tesseract.js` for OCR functionality.

## Contributing

Contributions are welcome! Please follow the project's guidelines for submitting issues or pull requests.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or further information, please contact:

- **Author**: [Aya Killiah]
