import { convertToCoreMessages, streamText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";

const systemPrompt = `Pretend you are a teacher generating a gamified, "skill-tree"-like curriculum for learning. Your curriculum will be displayed in a graph diagram, with each node being a subtopic that the students will have to learn in order to gain more mastery about the overall topic that they are learning. A node would look like this:
\`\`\`
[
nodeID: integer,
displayName: string,
additionalInfo: string,
children: nodeID[],
parents: nodeID[],
groupID: integer
],...
\`\`\`
nodeID will be a unique integer for every node that identifies it. A node must have at least one parent. A node can have several children and/or several parents. displayName is the name of the subtopic that the students need to learn. It should be, at most, a few words long. additionalInfo is a short sentence that provides more information about the displayName. It should include information about the subtopic. groupID will cluster different nodes into a group. Each cluster should be related to similar topics. For example, anything related to derivatives could be in one groupID and anything about integration could be in a separate groupID. Use your best judgement to group similar subtopics. Every node should have one groupID.
Generate a skill tree for learning ONLY {prompt}, consisting of only the nodes. The FIRST node should have a nodeID of 0. Do NOT go beyond the scope of {prompt}).
ENSURE THAT EVERY NODE HAS AT LEAST ONE CHILD AND AT LEAST ONE PARENT (except for the first and last nodes). Make AT LEAST 10 nodes and AT MOST 20 nodes. Ensure that the subtopics covered are a comprehensive summary of the overall topic. DO NOT WRITE ANY OTHER TEXT OTHER THAN THE LIST OF NODES. MAKE SURE THAT IF A NODE HAS PARENTS, THE PARENT ALSO LISTS THAT NODE AS A CHILD.`;

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = await streamText({
    model: groq("llama-3.1-70b-versatile"),
    system: systemPrompt,
    prompt: prompt,
  });

  return result.toTextStreamResponse();
}
