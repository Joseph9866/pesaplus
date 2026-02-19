/**
 * Unit tests for file upload handler
 */

import { describe, it, expect } from 'vitest';
import { validateFile, generatePreview, createFormData } from '../fileUpload';

describe('fileUpload - validateFile', () => {
  it('should accept valid JPEG files under 5MB', () => {
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const result = validateFile(file);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid PNG files under 5MB', () => {
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const result = validateFile(file);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid PDF files under 5MB', () => {
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const result = validateFile(file);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject files with invalid MIME types', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const result = validateFile(file);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid file type. Please upload a JPEG, PNG, or PDF file.');
  });

  it('should reject files exceeding 5MB', () => {
    // Create a file larger than 5MB
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const result = validateFile(file);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds the maximum allowed size of 5MB');
  });

  it('should accept files exactly at 5MB limit', () => {
    // Create a file exactly 5MB
    const content = new Array(5 * 1024 * 1024).fill('a').join('');
    const file = new File([content], 'exact.jpg', { type: 'image/jpeg' });
    const result = validateFile(file);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('fileUpload - generatePreview', () => {
  it('should generate preview for JPEG images', async () => {
    const file = new File(['fake image content'], 'test.jpg', { type: 'image/jpeg' });
    const preview = await generatePreview(file);
    
    expect(preview).toBeDefined();
    expect(typeof preview).toBe('string');
    expect(preview).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should generate preview for PNG images', async () => {
    const file = new File(['fake image content'], 'test.png', { type: 'image/png' });
    const preview = await generatePreview(file);
    
    expect(preview).toBeDefined();
    expect(typeof preview).toBe('string');
    expect(preview).toMatch(/^data:image\/png;base64,/);
  });

  it('should reject preview generation for PDF files', async () => {
    const file = new File(['fake pdf content'], 'test.pdf', { type: 'application/pdf' });
    
    await expect(generatePreview(file)).rejects.toThrow(
      'Preview generation is only supported for image files (JPEG, PNG).'
    );
  });

  it('should reject preview generation for non-image files', async () => {
    const file = new File(['text content'], 'test.txt', { type: 'text/plain' });
    
    await expect(generatePreview(file)).rejects.toThrow(
      'Preview generation is only supported for image files (JPEG, PNG).'
    );
  });
});

describe('fileUpload - createFormData', () => {
  it('should create FormData with single file', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const formData = createFormData({ id_front: file });
    
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('id_front')).toBe(file);
  });

  it('should create FormData with multiple files', () => {
    const file1 = new File(['content1'], 'front.jpg', { type: 'image/jpeg' });
    const file2 = new File(['content2'], 'back.jpg', { type: 'image/jpeg' });
    const file3 = new File(['content3'], 'selfie.jpg', { type: 'image/jpeg' });
    
    const formData = createFormData({
      id_document_front: file1,
      id_document_back: file2,
      selfie_photo: file3,
    });
    
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('id_document_front')).toBe(file1);
    expect(formData.get('id_document_back')).toBe(file2);
    expect(formData.get('selfie_photo')).toBe(file3);
  });

  it('should create empty FormData when no files provided', () => {
    const formData = createFormData({});
    
    expect(formData).toBeInstanceOf(FormData);
    // FormData with no entries should have no keys
    expect(Array.from(formData.keys()).length).toBe(0);
  });

  it('should preserve file names and types in FormData', () => {
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const formData = createFormData({ document: file });
    
    const retrievedFile = formData.get('document') as File;
    expect(retrievedFile.name).toBe('document.pdf');
    expect(retrievedFile.type).toBe('application/pdf');
  });
});
