import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './IdCardExtractor.css'; // Assuming you will add styles here

const IdCardExtractor = () => {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [data, setData] = useState({
    idNumber: '',
    name: '',
    dateOfBirth: '',
    nationality: '',
    issuedDate: '',
    expiryDate: '',
    sex: ''
  });
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setLoading(true); // Start loading
      performOCR(file);
    }
  };

  const performOCR = (file) => {
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: info => console.log(info)
      }
    ).then(({ data: { text } }) => {
      setOcrText(text);
      processText(text);
      setLoading(false); // End loading
    });
  };

  const correctIdNumber = (idText) => {
    const idPattern = /\b\d{3}-\d{4}-\d{7}\d?[-]?\d?\b/;
    const match = idPattern.exec(idText);
    if (match) {
      let idNumber = match[0];
      if (idNumber.length === 15 && idNumber[14] === '-') {
        idNumber = idNumber.slice(0, 14) + idNumber.slice(15);
      }
      if (idNumber.length === 14 && idNumber[13] !== '-') {
        idNumber = idNumber.slice(0, 13) + '-' + idNumber.slice(13);
      }
      return idNumber;
    }
    return '';
  };

  const normalizeDate = (dateString) => {
    const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
    const match = datePattern.exec(dateString);
    if (match) {
      let [_, day, month, year] = match;
      day = day.padStart(2, '0');
      month = month.padStart(2, '0');
      return `${day}/${month}/${year}`;
    }
    return '';
  };

  const processText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    let extractedData = {
      idNumber: '',
      name: '',
      dateOfBirth: '',
      nationality: '',
      issuedDate: '',
      expiryDate: '',
      sex: ''
    };

    const idPattern = /\b\d{3}-\d{4}-\d{7}\d?[-]?\d?\b/;
    const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/;
    const keywords = {
      dateOfBirth: ['date of birth', 'dob','dateot binh', 'dateofbirth', 'birth'],
      issuedDate: ['issued date', 'issuing date','1ssuing date','ssuing','ssin dat','awuing date', 'issue date', 'issuing'],
      expiryDate: ['expiry date', 'expiration date', 'piry date', 'expiry', 'expire']
    };

    lines.forEach((line, index) => {
      if (idPattern.test(line)) {
        const idNumber = correctIdNumber(line);
        extractedData.idNumber = idNumber;
      }

      if (datePattern.test(line)) {
        const date = normalizeDate(line.match(datePattern)[0]);
        const lowerLine = line.toLowerCase();
        const prevLine = lines[index - 1]?.toLowerCase();

        if (keywords.dateOfBirth.some(keyword => lowerLine.includes(keyword) || prevLine?.includes(keyword))) {
          extractedData.dateOfBirth = date;
        } else if (keywords.issuedDate.some(keyword => lowerLine.includes(keyword) || prevLine?.includes(keyword))) {
          extractedData.issuedDate = date;
        } else if (keywords.expiryDate.some(keyword => lowerLine.includes(keyword) || prevLine?.includes(keyword))) {
          extractedData.expiryDate = date;
        }
      }

      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('name:') || lowerLine.includes('name')) {
        extractedData.name = line.split(':')[1]?.trim() || line.split('Name')[1]?.trim() || '';
      } else if (lowerLine.includes('nationality:')||lowerLine.includes('hationality')||lowerLine.includes('tionality')) {
        extractedData.nationality = line.split(':')[1]?.trim() || '';
      } else if (lowerLine.includes('sex:')) {
        extractedData.sex = line.split(':')[1]?.trim() || '';
        extractedData.sex = extractedData.sex.match(/m/i) ? 'M' : 'F';
      }
    });

    if (extractedData.dateOfBirth && extractedData.dateOfBirth.length === 8) {
      extractedData.dateOfBirth = extractedData.dateOfBirth.replace(/(\d{2})\/(\d{1})(\d{4})/, '$1/0$2/$3');
    }

    if (!extractedData.dateOfBirth) {
      lines.forEach((line) => {
        if (keywords.dateOfBirth.some(keyword => line.toLowerCase().includes(keyword))) {
          const potentialDate = line.match(datePattern);
          if (potentialDate) {
            extractedData.dateOfBirth = normalizeDate(potentialDate[0]);
          }
        }
      });
    }

    extractedData.name = cleanText(extractedData.name);
    extractedData.nationality = cleanText(extractedData.nationality);
    extractedData.sex = cleanText(extractedData.sex);

    setData(extractedData);
  };

  const cleanText = (text) => text.replace(/[^\w\s]/gi, '').trim();

  return (
    <div className="id-card-extractor">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        className="upload-input"
      />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Scanning...</p>
        </div>
      )}
      {image && !loading && (
        <div className="image-container">
          <img src={image} alt="Uploaded ID Card" className="uploaded-image" />
        </div>
      )}
      <div className="data-container">
        <h2>Extracted Data:</h2>
        <form className="data-form">
          <label>
            <span>ID Number:</span>
            <input 
              type="text" 
              value={data.idNumber} 
              onChange={e => setData({ ...data, idNumber: e.target.value })} 
            />
          </label>
          <label>
            <span>Name:</span>
            <input 
              type="text" 
              value={data.name} 
              onChange={e => setData({ ...data, name: e.target.value })} 
            />
          </label>
          <label>
            <span>Date of Birth:</span>
            <input 
              type="text" 
              value={data.dateOfBirth} 
              onChange={e => setData({ ...data, dateOfBirth: e.target.value })} 
            />
          </label>
          <label>
            <span>Nationality:</span>
            <input 
              type="text" 
              value={data.nationality} 
              onChange={e => setData({ ...data, nationality: e.target.value })} 
            />
          </label>
          <label>
            <span>Issued Date:</span>
            <input 
              type="text" 
              value={data.issuedDate} 
              onChange={e => setData({ ...data, issuedDate: e.target.value })} 
            />
          </label>
          <label>
            <span>Expiry Date:</span>
            <input 
              type="text" 
              value={data.expiryDate} 
              onChange={e => setData({ ...data, expiryDate: e.target.value })} 
            />
          </label>
          <label>
            <span>Sex:</span>
            <input 
              type="text" 
              value={data.sex} 
              onChange={e => setData({ ...data, sex: e.target.value })} 
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default IdCardExtractor;
