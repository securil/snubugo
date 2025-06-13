import { pdfjs } from 'react-pdf';

// PDF.js 설정
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

/**
 * PDF 파일의 첫 번째 페이지를 캔버스로 렌더링하여 이미지 데이터를 생성
 */
export const generatePdfThumbnail = async (
  pdfPath: string, 
  width: number = 300,
  height: number = 400
): Promise<string | null> => {
  try {
    // PDF 로드
    const loadingTask = pdfjs.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    
    // 첫 번째 페이지 가져오기
    const page = await pdf.getPage(1);
    
    // 뷰포트 설정 (표지 크기에 맞춤)
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(width / viewport.width, height / viewport.height);
    const scaledViewport = page.getViewport({ scale });
    
    // 캔버스 생성
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context를 생성할 수 없습니다.');
    }
    
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    
    // 배경을 흰색으로 설정
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // PDF 페이지 렌더링
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };
    
    await page.render(renderContext).promise;
    
    // Canvas를 Data URL로 변환
    return canvas.toDataURL('image/jpeg', 0.8);
    
  } catch (error) {
    console.error('PDF 썸네일 생성 실패:', error);
    return null;
  }
};

/**
 * PDF 파일 정보 추출 (페이지 수, 메타데이터 등)
 */
export const extractPdfInfo = async (pdfPath: string) => {
  try {
    const loadingTask = pdfjs.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    
    const metadata = await pdf.getMetadata();
    const info = metadata.info as any; // PDF 메타데이터 타입이 복잡하므로 any 사용
    
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
    console.error('PDF 정보 추출 실패:', error);
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
    const response = await fetch(pdfPath, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    
    if (contentLength) {
      return formatFileSize(parseInt(contentLength));
    }
    
    // HEAD 요청이 실패하면 GET 요청으로 전체 파일 크기 확인
    const fullResponse = await fetch(pdfPath);
    const blob = await fullResponse.blob();
    return formatFileSize(blob.size);
    
  } catch (error) {
    console.error('파일 크기 가져오기 실패:', error);
    return '알 수 없음';
  }
};
