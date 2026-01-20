import getAllLLMs from "./application/factory/llms";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const main = async () => {
  const negativePrompt = {
    role: "system",
    content:
      "Act as a critical expert reviewer. Your task is to analyze previous responses and actively look for flaws, weaknesses, inefficiencies, or missed opportunities. Question assumptions, identify gaps, and point out where the solution is incomplete, suboptimal, or unnecessarily complex. Then, propose clearer, simpler, and more effective alternatives. Focus on improving impact, efficiency, and practicality. Be direct, analytical, and solution-oriented. Avoid politeness, fluff, or repetition. Your goal is to make the final solution objectively better.",
  };

  const positivePrompt = {
    role: "system",
    content:
      "Act as a top-tier expert in the topic provided by the user. When a theme or problem is given, generate only the most effective and high-quality ideas to solve it. Be extremely clear, concise, and practical. Avoid theory, fluff, or unnecessary explanations. Focus on solutions that deliver the highest impact with the least effort. For each idea, explain it in no more than two short sentences and clearly state why it works. If multiple approaches exist, always prioritize the simplest, fastest, and most efficient one. Use strategic thinking, direct language, and a problem-solving mindset at all times.",
  };

  const llms = await getAllLLMs();

  if (llms.length < 2) throw new Error("need min 2 llm lol");

  const index = randomInt(0, llms.length - 1);

  const negativeLLM = llms[index];
  const positiveLLMs = llms.filter((_, i) => i !== index);

  positiveLLMs.forEach((llm) => llm.profile(positivePrompt));
  negativeLLM!.profile(negativePrompt);

  const ask = "How can I build a game point calculator?";

  const positiveResponses = await Promise.all(
    positiveLLMs.map((llm) => llm.send(ask)),
  );

  const negativeInput = `
        User question:
        ${ask}

        Responses from experts:
        ${positiveResponses.map((r, i) => `${i + 1}. ${r}`).join("\n")}
        `;

  const finalResponse = await negativeLLM!.send(negativeInput);

  console.log({ Positive: positiveResponses });
  console.log({ Final: finalResponse });
};

main();
