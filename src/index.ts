#!/usr/bin/env node

/**
 * Feature Discussion MCP Server
 *
 * This server facilitates intelligent feature discussions between developers and AI.
 * It provides:
 * - Interactive feature discussions
 * - AI-guided requirement gathering
 * - Development guidance
 * - Architectural recommendations
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Types for feature discussions
 */
type FeatureDiscussion = {
  id: string;
  title: string;
  description: string;
  status: 'proposed' | 'in-discussion' | 'approved' | 'rejected';
  requirements: string[];
  businessValue?: string;
  targetUsers?: string[];
  successCriteria?: string[];
  technicalApproach?: string;
  architecturalDecisions?: string[];
  dependencies?: string[];
  risks?: string[];
  timeline?: string;
  createdAt: string;
  updatedAt: string;
  currentPrompt?: string;
};

// Type for feature discussion prompt fields
type FeatureField = keyof Omit<FeatureDiscussion,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'currentPrompt' | 'architecturalDecisions' | 'dependencies'
>;

type FeaturePrompt = {
  id: string;
  message: string;
  field: FeatureField;
};

type DiscussionContext = {
  previousDecisions: string[];
  relatedFeatures: string[];
  technicalConstraints: string[];
  conversationHistory: Array<{
    prompt: string;
    response: string;
    timestamp: string;
  }>;
};

/**
 * In-memory storage for feature discussions and context
 */
const featureDiscussions: { [id: string]: FeatureDiscussion } = {};
const discussionContexts: { [featureId: string]: DiscussionContext } = {};

// Define the sequence of prompts for feature discussion
const FEATURE_DISCUSSION_PROMPTS: FeaturePrompt[] = [
  {
    id: "initial_description",
    message: "Please provide a brief description of the feature you'd like to discuss.",
    field: "description"
  },
  {
    id: "business_value",
    message: "What business value does this feature provide? How does it benefit users or stakeholders?",
    field: "businessValue"
  },
  {
    id: "target_users",
    message: "Who are the target users for this feature?",
    field: "targetUsers"
  },
  {
    id: "requirements",
    message: "What are the key requirements or constraints for this feature?",
    field: "requirements"
  },
  {
    id: "success_criteria",
    message: "What are the success criteria for this feature? How will we know it's working as intended?",
    field: "successCriteria"
  },
  {
    id: "technical_approach",
    message: "Do you have any specific technical approach in mind for implementing this feature?",
    field: "technicalApproach"
  },
  {
    id: "risks",
    message: "Are there any potential risks or challenges we should consider?",
    field: "risks"
  },
  {
    id: "timeline",
    message: "What's the desired timeline or priority for this feature?",
    field: "timeline"
  }
];

const server = new Server(
  {
    name: "feature-discussion",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available feature discussions as resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(featureDiscussions).map(([id, feature]) => ({
      uri: `feature:///${id}`,
      mimeType: "application/json",
      name: feature.title,
      description: feature.description
    }))
  };
});

/**
 * Handler for reading a specific feature discussion
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, '');
  const feature = featureDiscussions[id];
  const context = discussionContexts[id];

  if (!feature) {
    throw new Error(`Feature discussion ${id} not found`);
  }

  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "application/json",
      text: JSON.stringify({ ...feature, context }, null, 2)
    }]
  };
});

/**
 * Handler that lists available tools for feature management
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "begin_feature_discussion",
        description: "Start a new feature discussion",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title or name of the feature"
            }
          },
          required: ["title"]
        }
      },
      {
        name: "provide_feature_input",
        description: "Provide information for the current feature discussion prompt",
        inputSchema: {
          type: "object",
          properties: {
            featureId: {
              type: "string",
              description: "ID of the feature being discussed"
            },
            response: {
              type: "string",
              description: "Your response to the current prompt"
            }
          },
          required: ["featureId", "response"]
        }
      }
    ]
  };
});

/**
 * Handler for feature management tools
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "begin_feature_discussion": {
      const { title } = request.params.arguments as any;
      const id = `f${Object.keys(featureDiscussions).length + 1}`;

      // Initialize new feature discussion
      featureDiscussions[id] = {
        id,
        title,
        description: "",
        requirements: [],
        status: 'in-discussion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentPrompt: FEATURE_DISCUSSION_PROMPTS[0].id
      };

      // Initialize discussion context
      discussionContexts[id] = {
        previousDecisions: [],
        relatedFeatures: [],
        technicalConstraints: [],
        conversationHistory: []
      };

      // Return the first prompt
      return {
        content: [
          {
            type: "text",
            text: `Feature discussion started for: ${title}\n\nFeature ID: ${id}\n\nFirst question:\n${FEATURE_DISCUSSION_PROMPTS[0].message}`
          }
        ]
      };
    }

    case "provide_feature_input": {
      const { featureId, response } = request.params.arguments as any;
      const feature = featureDiscussions[featureId];
      const context = discussionContexts[featureId];

      if (!feature) {
        throw new Error(`Feature ${featureId} not found`);
      }

      // Find current prompt
      const currentPromptIndex = FEATURE_DISCUSSION_PROMPTS.findIndex(p => p.id === feature.currentPrompt);
      const currentPrompt = FEATURE_DISCUSSION_PROMPTS[currentPromptIndex];

      // Store the response
      if (currentPrompt.field === 'requirements' || currentPrompt.field === 'targetUsers' ||
          currentPrompt.field === 'successCriteria' || currentPrompt.field === 'risks') {
        // Handle array fields
        feature[currentPrompt.field] = response.split('\n').map((r: string) => r.trim()).filter(Boolean);
      } else {
        // Handle string fields
        feature[currentPrompt.field] = response;
      }

      // Update conversation history
      context.conversationHistory.push({
        prompt: currentPrompt.message,
        response,
        timestamp: new Date().toISOString()
      });

      // Move to next prompt if available
      const nextPrompt = FEATURE_DISCUSSION_PROMPTS[currentPromptIndex + 1];
      let responseMessage = "Response recorded. ";

      if (nextPrompt) {
        feature.currentPrompt = nextPrompt.id;
        responseMessage += `\n\nNext question:\n${nextPrompt.message}`;
      } else {
        feature.status = 'proposed';
        feature.currentPrompt = undefined;
        responseMessage += "\n\nThank you! The feature has been fully documented. You can now use the 'analyze_feature' or 'suggest_architecture' prompts to get AI guidance on implementation.";
      }

      feature.updatedAt = new Date().toISOString();

      return {
        content: [{
          type: "text",
          text: responseMessage
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Handler that lists available AI guidance prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "analyze_feature",
        description: "Get AI analysis and recommendations for a feature",
      },
      {
        name: "suggest_architecture",
        description: "Get architectural recommendations for a feature",
      }
    ]
  };
});

/**
 * Handler for AI guidance prompts
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  switch (request.params.name) {
    case "analyze_feature": {
      return {
        messages: [
          {
            role: "system",
            content: {
              type: "text",
              text: "You are an experienced technical lead helping analyze feature requirements and providing implementation guidance. Consider the full context of the feature discussion when providing recommendations."
            }
          },
          {
            role: "user",
            content: {
              type: "text",
              text: "Please analyze this feature and provide detailed recommendations covering:\n" +
                    "1. Implementation approach\n" +
                    "2. Potential technical challenges\n" +
                    "3. Required skills and expertise\n" +
                    "4. Testing considerations\n" +
                    "5. Integration points with existing systems"
            }
          }
        ]
      };
    }

    case "suggest_architecture": {
      return {
        messages: [
          {
            role: "system",
            content: {
              type: "text",
              text: "You are an experienced software architect helping design robust and scalable solutions. Consider the full feature context and existing system architecture."
            }
          },
          {
            role: "user",
            content: {
              type: "text",
              text: "Please provide architectural recommendations covering:\n" +
                    "1. Proposed system design\n" +
                    "2. Key components and their interactions\n" +
                    "3. Data flow and storage considerations\n" +
                    "4. Scalability and performance factors\n" +
                    "5. Security implications"
            }
          }
        ]
      };
    }

    default:
      throw new Error("Unknown prompt");
  }
});

/**
 * Start the server using stdio transport
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
