/**
 * 썸네일 생성 도구 (ES Module 버전)
 * PDF 파일들을 읽어서 썸네일 이미지를 생성하는 Node.js 스크립트
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PDF.js를 동적으로 가져오기
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');

class ThumbnailGenerator {
  constructor() {
    this.publicDir = path.join(__dirname, '..', 'public');
    this.pdfsDir = path.join(this.publicDir, 'pdfs');
    this.thumbnailsDir = path.join(this.publicDir, 'thumbnails');
    this.magazinesJsonPath = path.join(this.publicDir, 'magazines.json');
    
    // 썸네일 디렉토리 생성
    if (!fs.existsSync(this.thumbnailsDir)) {
      fs.mkdirSync(this.thumbnailsDir, { recursive: true });
    }
  }

  /**
   * PDF에서 썸네일 생성
   */
  async generateThumbnail(pdfPath, outputPath, width = 300, height = 400) {
    try {
      console.log(`썸네일 생성 시작: ${path.basename(pdfPath)}`);
      
      // PDF 파일 읽기
      const pdfBuffer = fs.readFileSync(pdfPath);
      
      // PDF 문서 로드
      const loadingTask = pdfjsLib.getDocument({
        data: pdfBuffer,
        verbosity: 0,
      });

      const pdf = await loadingTask.promise;
      
      // 첫 번째 페이지 가져오기
      const page = await pdf.getPage(1);
      
      // 뷰포트 설정
      const viewport = page.getViewport({ scale: 1 });
      const scale = Math.min(width / viewport.width, height / viewport.height);
      const scaledViewport = page.getViewport({ scale });
      
      // Canvas 생성
      const canvas = createCanvas(scaledViewport.width, scaledViewport.height);
      const context = canvas.getContext('2d');
      
      // 배경을 흰색으로 설정
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // PDF 페이지 렌더링
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };
      
      await page.render(renderContext).promise;
      
      // JPG로 저장 (파일 크기 최적화)
      const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✅ 썸네일 생성 완료: ${path.basename(outputPath)}`);
      
      return {
        success: true,
        path: outputPath,
        size: `${scaledViewport.width}x${scaledViewport.height}`
      };
      
    } catch (error) {
      console.error(`❌ 썸네일 생성 실패 (${path.basename(pdfPath)}):`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * magazines.json에서 PDF 목록 가져오기
   */
  getMagazineList() {
    try {
      const magazinesData = JSON.parse(fs.readFileSync(this.magazinesJsonPath, 'utf8'));
      return magazinesData.magazines;
    } catch (error) {
      console.error('magazines.json 읽기 실패:', error);
      return [];
    }
  }

  /**
   * magazines.json 업데이트
   */
  updateMagazinesJson(magazines) {
    try {
      const magazinesData = JSON.parse(fs.readFileSync(this.magazinesJsonPath, 'utf8'));
      magazinesData.magazines = magazines;
      
      fs.writeFileSync(
        this.magazinesJsonPath, 
        JSON.stringify(magazinesData, null, 2), 
        'utf8'
      );
      
      console.log('✅ magazines.json 업데이트 완료');
    } catch (error) {
      console.error('magazines.json 업데이트 실패:', error);
    }
  }

  /**
   * 모든 동창회보의 썸네일 생성
   */
  async generateAllThumbnails() {
    console.log('🚀 썸네일 일괄 생성 시작...\n');
    
    const magazines = this.getMagazineList();
    const results = [];
    
    for (let i = 0; i < magazines.length; i++) {
      const magazine = magazines[i];
      
      console.log(`[${i + 1}/${magazines.length}] 처리 중: ${magazine.title}`);
      
      // PDF 파일 경로
      const pdfPath = path.join(this.publicDir, magazine.pdfPath.replace(/^\//, ''));
      
      // 썸네일 파일명 생성 (ID 기반)
      const thumbnailFileName = `${magazine.id}.jpg`;
      const thumbnailPath = path.join(this.thumbnailsDir, thumbnailFileName);
      
      // PDF 파일 존재 확인
      if (!fs.existsSync(pdfPath)) {
        console.log(`⚠️ PDF 파일 없음: ${pdfPath}`);
        results.push({
          magazine: magazine.id,
          success: false,
          error: 'PDF 파일 없음'
        });
        continue;
      }
      
      // 썸네일 생성
      const result = await this.generateThumbnail(pdfPath, thumbnailPath);
      
      if (result.success) {
        // magazines.json의 coverImage 경로 업데이트
        magazine.coverImage = `/thumbnails/${thumbnailFileName}`;
        
        results.push({
          magazine: magazine.id,
          success: true,
          thumbnailPath: `/thumbnails/${thumbnailFileName}`,
          size: result.size
        });
      } else {
        results.push({
          magazine: magazine.id,
          success: false,
          error: result.error
        });
      }
      
      console.log(''); // 빈 줄 추가
    }
    
    // magazines.json 업데이트
    this.updateMagazinesJson(magazines);
    
    // 결과 요약
    this.printResults(results);
    
    return results;
  }

  /**
   * 결과 요약 출력
   */
  printResults(results) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 썸네일 생성 결과 요약');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ 성공: ${successful.length}개`);
    console.log(`❌ 실패: ${failed.length}개`);
    console.log(`📈 성공률: ${Math.round((successful.length / results.length) * 100)}%`);
    
    if (failed.length > 0) {
      console.log('\n❌ 실패한 항목들:');
      failed.forEach(f => {
        console.log(`  - ${f.magazine}: ${f.error}`);
      });
    }
    
    if (successful.length > 0) {
      console.log('\n✅ 생성된 썸네일들:');
      successful.forEach(s => {
        console.log(`  - ${s.magazine}: ${s.thumbnailPath} (${s.size})`);
      });
    }
    
    console.log('\n🎉 썸네일 생성 완료!');
  }
}

// 스크립트 실행
const generator = new ThumbnailGenerator();

generator.generateAllThumbnails()
  .then(() => {
    console.log('\n✨ 모든 작업이 완료되었습니다!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });