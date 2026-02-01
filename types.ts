
export interface FileSignature {
  hex: string[];
  offset: number;
  description: string;
  extension: string;
  category: 'executable' | 'image' | 'archive' | 'document' | 'other';
}

export interface AnalysisResult {
  fileName: string;
  fileSize: number;
  detectedType: string;
  detectedExtension: string;
  hexPreview: string[];
  signatureMatch: FileSignature | null;
  securityIntel: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'system' | 'info' | 'error' | 'success' | 'warning';
  message: string;
}
