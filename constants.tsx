
import { FileSignature } from './types';

export const FILE_SIGNATURES: FileSignature[] = [
  { hex: ['7F', '45', '4C', '46'], offset: 0, description: 'ELF Executable (Linux)', extension: 'elf', category: 'executable' },
  { hex: ['4D', '5A'], offset: 0, description: 'DOS MZ executable / Windows EXE', extension: 'exe', category: 'executable' },
  { hex: ['89', '50', '4E', '47', '0D', '0A', '1A', '0A'], offset: 0, description: 'PNG Image', extension: 'png', category: 'image' },
  { hex: ['FF', 'D8', 'FF'], offset: 0, description: 'JPEG Image', extension: 'jpg', category: 'image' },
  { hex: ['25', '50', '44', '46'], offset: 0, description: 'PDF Document', extension: 'pdf', category: 'document' },
  { hex: ['50', '4B', '03', '04'], offset: 0, description: 'ZIP Archive (or Office OpenXML)', extension: 'zip', category: 'archive' },
  { hex: ['52', '61', '72', '21', '1A', '07'], offset: 0, description: 'RAR Archive', extension: 'rar', category: 'archive' },
  { hex: ['37', '7A', 'BC', 'AF', '27', '1C'], offset: 0, description: '7-Zip Archive', extension: '7z', category: 'archive' },
  { hex: ['1F', '8B'], offset: 0, description: 'GZIP Archive', extension: 'gz', category: 'archive' },
  { hex: ['47', '49', '46', '38', '37', '61'], offset: 0, description: 'GIF Image', extension: 'gif', category: 'image' },
  { hex: ['47', '49', '46', '38', '39', '61'], offset: 0, description: 'GIF Image', extension: 'gif', category: 'image' },
  { hex: ['CA', 'FE', 'BA', 'BE'], offset: 0, description: 'Java Class File / Mach-O Binary', extension: 'class', category: 'executable' },
  { hex: ['23', '21'], offset: 0, description: 'Shebang / Script', extension: 'sh', category: 'executable' },
  { hex: ['7B', '0A'], offset: 0, description: 'JSON File', extension: 'json', category: 'document' },
  { hex: ['3C', '21', '64', '6F', '63', '74', '79', '70', '65', '20', '68', '74', '6D', '6C'], offset: 0, description: 'HTML Document', extension: 'html', category: 'document' },
  { hex: ['25', '21', '50', '53'], offset: 0, description: 'PostScript', extension: 'ps', category: 'document' },
  { hex: ['CF', 'FA', 'ED', 'FE'], offset: 0, description: 'Mach-O 64-bit Binary (macOS)', extension: 'macho', category: 'executable' },
  { hex: ['CE', 'FA', 'ED', 'FE'], offset: 0, description: 'Mach-O 32-bit Binary (macOS)', extension: 'macho', category: 'executable' }
];

export const SYSTEM_PROMPT = `
You are a cybersecurity forensic expert. Your task is to analyze a file based on its detected magic numbers and metadata.
Context: The user is using a tool to identify potentially malicious or hidden files (Forensics/Threat Hunting).

Structure your response with these sections:
1. OVERVIEW: Brief technical description of the file format.
2. SECURITY ANALYSIS: Potential risks associated with this file type (e.g., macro execution for documents, shellcode for binaries).
3. CYBER ATTACK RELEVANCE: Mention relevant MITRE ATT&CK techniques (like T1204 - User Execution, T1059 - Command and Scripting Interpreter).
4. OWASP CONTEXT: Relate to OWASP Top 10 where applicable (e.g., A01:2021-Broken Access Control or A06:2021-Vulnerable and Outdated Components).
5. VERDICT: A security recommendation (e.g., "Scan with YARA", "Isolate in sandbox").

Keep the tone professional, hacker-oriented (cli style), and concise.
`;
