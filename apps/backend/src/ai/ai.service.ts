import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async generateScript(idea: string, genre: string): Promise<string> {
    // Mock AI response
    return `# ${genre} Script: ${idea}\n\n## Scene 1\n\n[EXT. STREET - DAY]\n\nA mysterious figure walks down the street...`;
  }

  async extractCharacters(script: string): Promise<any[]> {
    // Mock AI response
    return [
      { name: 'Hero', description: 'A brave warrior.', gender: 'Male', tags: 'brave, warrior, sword' },
      { name: 'Villain', description: 'A cunning schemer.', gender: 'Female', tags: 'cunning, schemer, dark magic' },
    ];
  }

  async generateAvatar(prompt: string): Promise<string> {
    // Mock AI response (placeholder image)
    return `https://placehold.co/512x512?text=${encodeURIComponent(prompt.substring(0, 20))}`;
  }

  async splitScriptToStoryboards(script: string): Promise<any[]> {
    // Mock AI response
    // Logic: Split script into shots
    return [
      { shotType: 'Wide Shot', action: 'A busy futuristic street.', dialogue: '', sortOrder: 1 },
      { shotType: 'Close Up', action: 'The Hero looks around nervously.', dialogue: 'Hero: Where are they?', sortOrder: 2 },
      { shotType: 'Medium Shot', action: 'The Villain approaches from the shadows.', dialogue: 'Villain: I found you.', sortOrder: 3 },
    ];
  }

  async generateStoryboardImage(prompt: string, referenceImageUrl?: string): Promise<string> {
    // Mock AI response (placeholder image)
    const text = referenceImageUrl ? 'Ref+Gen' : 'Gen';
    return `https://placehold.co/1024x576?text=${text}: ${encodeURIComponent(prompt.substring(0, 15))}`;
  }

  async refineStoryboardImage(originalPrompt: string, instruction: string, referenceImageUrl?: string): Promise<string> {
    // Mock AI response
    const text = 'Refined';
    return `https://placehold.co/1024x576?text=${text}: ${encodeURIComponent(instruction.substring(0, 15))}`;
  }
}
