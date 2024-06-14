import { PdfHandlerBase } from './pdf-handler-base.directive'

class PDFHandler extends PdfHandlerBase {}

describe('PdfHandlerBaseDirective', () => {
  it('should create an instance', () => {
    const directive = new PDFHandler()
    expect(directive).toBeTruthy()
  })
})
