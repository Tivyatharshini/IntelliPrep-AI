export const jdAnalysisSchema = `{
  "role": string,
  "requiredSkills": string[],
  "preferredSkills": string[],
  "experienceRequired": string,
  "educationRequirements": string[],
  "responsibilities": string[],
  "domainIndustry": string,
  "toolsAndTechnologies": string[]
}`;

export const atsSchema = `{
  "atsMatchScore": number,
  "matchingSkills": string[],
  "missingSkills": string[],
  "missingKeywords": string[],
  "resumeStrengths": string[],
  "areasForImprovement": string[],
  "summary": string
}`;

export const skillGapSchema = `{
  "currentSkills": string[],
  "requiredSkills": string[],
  "skillGaps": [
    {
      "skill": string,
      "whyItMatters": string,
      "learningResources": string[],
      "suggestedProjects": string[],
      "estimatedLearningTime": string
    }
  ]
}`;

export const interviewSchema = `{
  "role": string,
  "questions": [
    {
      "question": string,
      "whyAsked": string,
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}`;

export const evaluationSchema = `{
  "technicalAccuracyScore": number,
  "communicationScore": number,
  "completenessScore": number,
  "confidenceScore": number,
  "improvementSuggestions": string[]
}`;