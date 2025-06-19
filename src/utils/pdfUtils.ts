import { pdfjs } from 'react-pdf';

// PDF.js 설정
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

/**
 * PDF 파일의 첫 번째 페이지를 캔버스로 렌더링하여 이미지 데이터를 생성
 * @deprecated 미리 준비된 썸네일 사용으로 인해 비활성화됨
 */
export const generatePdfThumbnail = async (
  pdfPath: string, 
  width: number = 300,
  height: number = 400
): Promise<string | null> => {
  console.warn('generatePdfThumbnail 함수가 호출되었지만 비활성화되어 있습니다. 미리 준비된 썸네일을 사용하세요.');
  console.warn(`비활성화된 호출: ${pdfPath}`);
  return null;
};

/**
 * PDF 파일 정보 추출 (페이지 수, 메타데이터 등)
 * 이 함수는 계속 사용됩니다.
 */
export const extractPdfInfo = async (pdfPath: string) => {
  try {
    // URL 인코딩 처리
    const encodedPath = encodeURI(pdfPath);
    console.log(`PDF 정보 추출 시도: ${encodedPath}`);
    
    // 파일 존재 여부 확인
    const response = await fetch(encodedPath, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`PDF 파일을 찾을 수 없습니다: ${pdfPath} (${response.status})`);
    }
    
    const loadingTask = pdfjs.getDocument({
      url: encodedPath,
      verbosity: 0,
    });
    
    const pdf = await loadingTask.promise;
    const metadata = await pdf.getMetadata();
    const info = metadata.info as any;
    
    console.log(`PDF 정보 추출 완료: ${pdfPath}`, {
      pages: pdf.numPages,
      title: info?.Title
    });
    
    return {
      numPages: pdf.numPages,
      title: info?.Title || null,
      author: info?.Author || null,
      subject: info?.Subject || null,
      creator: info?.Creator || null,
      producer: info?.Producer || null,
      creationDate: info?.CreationDate || null,
      modificationDate: info?.ModDate || null,
    };
  } catch (error) {
    console.error(`PDF 정보 추출 실패 (${pdfPath}):`, error);
    return null;
  }
};

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * PDF 파일의 실제 크기 구하기 (브라우저에서는 제한적)
 */
export const getPdfFileSize = async (pdfPath: string): Promise<string> => {
  try {
    // URL 인코딩 처리
    const encodedPath = encodeURI(pdfPath);
    console.log(`파일 크기 확인 시도: ${encodedPath}`);
    
    const response = await fetch(encodedPath, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    
    if (contentLength) {
      const size = formatFileSize(parseInt(contentLength));
      console.log(`파일 크기 확인 완료: ${pdfPath} = ${size}`);
      return size;
    }
    
    // HEAD 요청이 실패하면 GET 요청으로 전체 파일 크기 확인
    const fullResponse = await fetch(encodedPath);
    const blob = await fullResponse.blob();
    const size = formatFileSize(blob.size);
    console.log(`파일 크기 확인 완료 (전체 다운로드): ${pdfPath} = ${size}`);
    return size;
    
  } catch (error) {
    console.error(`파일 크기 가져오기 실패 (${pdfPath}):`, error);
    return '알 수 없음';
  }
};