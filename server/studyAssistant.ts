import { getGeminiClient } from './gemini';
import { Source } from '../src/types';

export class StudyAssistant {
  public async executeAction(source: Source, action: string): Promise<string> {
    const ai = getGeminiClient();
    const sourceContext = `Source Title: ${source.title}
Key Concepts: ${source.keyConcepts.join(', ')}
Summary Overview: ${source.summary.overview}
Detailed Content Excerpt: ${source.rawTextPreview || source.summary.detailedExplanation}`;

    let instruction = '';

    switch (action) {
      case 'explain_simply':
        instruction = `Explain "${source.title}" as if you are explaining it to a complete beginner or a 10-year-old.
Use friendly analogies, real-world metaphors, simple words, and vivid examples. Avoid unnecessary jargon, or immediately explain any term you introduce.`;
        break;

      case 'explain_detail':
        instruction = `Provide a rigorous, deep technical dive into "${source.title}".
Analyze the underlying mathematical, algorithmic, architectural, or theoretical mechanics. Detail edge cases, failure modes, complexity tradeoffs, and enterprise implementation considerations.`;
        break;

      case 'find_topics':
        instruction = `Identify and catalog the top 7 most important topics and subtopics in "${source.title}".
For each topic, explain its significance, its prerequisite knowledge, and why an examiner or interviewer would ask about it.`;
        break;

      case 'extract_definitions':
        instruction = `Extract every key technical term, acronym, and domain definition from "${source.title}".
Format as a clean glossary: **[Term]**: [Clear, unambiguous definition].`;
        break;

      case 'extract_questions':
        instruction = `Extract the top 10 potential exam and viva questions from "${source.title}".
Group them into:
1. Conceptual Understanding
2. Numerical / Problem Solving
3. Comparative & Architecture Questions`;
        break;

      case 'extract_decisions':
        instruction = `Analyze "${source.title}" for Key Decisions and Strategic Choices.
Detail what decisions were agreed upon, the rationale behind them, and what alternatives were rejected.`;
        break;

      case 'extract_action_items':
        instruction = `Extract concrete, actionable tasks and follow-up items from "${source.title}".
Format as a checklist:
- [ ] **Action Item**: [Description] | Assignee: [Role/Person] | Priority: [High/Medium/Low]`;
        break;

      case 'quick_revision':
        instruction = `Generate a rapid 3-minute revision cheat-sheet for "${source.title}".
Include core bullet points, must-remember formulas, and high-yield mnemonics to read right before walking into an exam.`;
        break;

      default:
        instruction = `Provide a comprehensive academic breakdown of "${source.title}" emphasizing core study takeaways.`;
        break;
    }

    if (ai) {
      try {
        const resp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${instruction}\n\nBased on this source material:\n"""\n${sourceContext}\n"""`,
        });
        if (resp.text) {
          return resp.text;
        }
      } catch (err: any) {
        console.warn('StudyAssistant action error:', err.message);
      }
    }

    // High quality contextual fallback
    return `### ${action.replace('_', ' ').toUpperCase()} for ${source.title}\n\n` +
      `**Core Takeaway:** ${source.summary.overview}\n\n` +
      `**Detailed Notes:**\n${source.summary.detailedExplanation}\n\n` +
      `**Key Definitions:**\n` +
      source.summary.keyDefinitions.map((d) => `- **${d.term}**: ${d.definition}`).join('\n') +
      `\n\n**Exam Focus Points:**\n` +
      source.summary.examFocus.map((e) => `- ${e}`).join('\n');
  }
}

export const globalStudyAssistant = new StudyAssistant();
