require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const OPENAI_API_KEYS = [
    process.env.OPENAI_API_KEY1,
    process.env.OPENAI_API_KEY2,
    process.env.OPENAI_API_KEY3
    // Add more keys as needed
];

let currentKeyIndex = 0;

function getNextApiKey() {
    const key = OPENAI_API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % OPENAI_API_KEYS.length;
    return key;
}

module.exports = async (req, res) => {
    try {
        console.log("Request body received:", req.body);
        // Allow CORS
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Parse JSON body
        const body = req.body;
        const { essay, question } = body;

        // Placeholder function to make the API call to determine the paragraph type

        // Get the next API key for this request
        const OPENAI_API_KEY = getNextApiKey();

        // Create a configuration for this request
        const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        async function determineParagraphType(paragraph, entireEssay) {
        
            // Prepare the messages for the API call
            const messages = [
                {
                    "role": "system",
                    "content": "You are to identify whether a paragraph is an Introduction, Body Paragraph, or Conclusion from an essay. "
                },
                {
                    "role": "user",
                    "content": `Here is an essay:\n\n${entireEssay}\n\nIs the following paragraph the Introduction, Body Paragraph, or Conclusion (respond with either \"Introduction\", \"Body Paragraph\", or \"Conclusion\")?\n\n${paragraph}`
                }
            ];

            console.log(messages);
        
            // Make the API call
            const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0,
            max_tokens: 50,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            });
            console.log(response.data.choices[0]);
        
            // Return the result from the API response
            return response.data.choices[0].message.content.trim();

        }
        // Splitting the essay into paragraphs
        const paragraphs = essay.split('\n\n');

        // Looping through each paragraph and determining its type
        const paragraphTypes = [];
        for (const paragraph of paragraphs) {
        const paragraphType = await determineParagraphType(paragraph, essay);
        paragraphTypes.push(paragraphType);
        }
        console.log(paragraphTypes);

        // Rewrite the paragraphs and assemble the rewritten essay
        const rewrittenParagraphs = [];
        for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const paragraphType = paragraphTypes[i];
        const rewrittenParagraph = await rewriteParagraph(paragraph, paragraphType, question);
        rewrittenParagraphs.push("\n\n", rewrittenParagraph + "");
        }
        const rewrittenEssay = rewrittenParagraphs.join('\n');

        // Send the result back to the client-side
        res.json({ rewrittenParagraphs });
    } catch (error) {
        console.error("An error occurred in the server function:", error);
        res.status(500).json({ error: "An internal error occurred" });
    }
};

async function rewriteParagraph(paragraph, paragraphType, question) {

    // Get the next API key for this request
    const OPENAI_API_KEY = getNextApiKey();

    // Create a configuration for this request
    const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    console.log("Paragraph Type:", paragraphType);
    console.log("Question:", question);
    console.log("Paragraph:", paragraph);

    if (paragraphType == "Introduction") {
      // Prepare the messages for the API call
      const messages = [
        {
            "role": "system",
            "content": "You are an English essay assistant. You are to re-write introductions of submitted students essays to questions. You will do this in reference to exemplar responses provided by the assistant."
          },
          {
            "role": "user",
            "content": "Question submitted by student: \n\nTo what extent does the exploration of human experience in The Crucible invite you to reconsider your understanding of love?\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will identify re-write like an exemplar response:\n\nAn individual's perception of love may be heart warming, affectionate and romantic. Arthur Miller, renowned playwright of ‘The Crucible', actively challenges the stigma around love to a significant extent causing the responder to reconsider their concept of love. Miller vividly explores how during the 1692 Salen witch trials the exploration of human experiences has invited responder to percieve a different approach to love. An approach that is breaking down the boundaries of love with acts of guilt and revenge altering one's understanding.\n\nNote, for top marks, an introduction should do the following:\n\n- Have a strong thesis statement that engages with the question originally with a strong writers voice and flair (should not simply re-write question)\n- Introduce the main themes and texts to set up the essay\n- Should engage thoroughly with the question terms and unpack the meaning in the question\n- Mention form and context where appropriate\n- Exhibits strong use of active language and is written with sophistication and a logical flow of ideas\n- End with a strong concluding sentence\n\nFollow the exact same structure as the exemplar introduction, starting with a macrothesis that engages directly with the question and its terms, then introduce the text, form, context and the first theme, then transition into the next theme, then conclude the introduction with a strong concluding sentence. It should only be 4 sentences long."
          },
          {
            "role": "assistant",
            "content": "Testing, reshaping, and even tarnishing the traditionally sacrosanct notion of love, the crucible of human experience compels us to reassess its very nature. Arthur Miller's gripping play 'The Crucible,' set during the 1692 Salem witch trials, delves into love's darker facets, interweaving guilt, revenge, and societal pressures, and thus challenges the orthodox conceptions of romantic affection. Miller's dramatization renders the complexities of human relationships within Puritan society's rigid moral confines, exploring love's malleability and exposing its transformation into something unrecognizable through desperation and fear. 'The Crucible' acts as a profound reflection on the human condition, offering a nuanced perspective that invites readers to scrutinize their understanding of love, where it serves both as a refuge and a weapon."
          },
          {
            "role": "user",
            "content": "Question submitted by student: \n\nTo what extent does the exploration of human experience in The Merchant of Venice invite you to reconsider your understanding of deception?\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will identify re-write like an exemplar response:\n\nWilliam Shakespeare's 16th century play, The Merchant of Venice, demonstrates the human experience of love, discrimination, greed and vengeance. It depicts the consistencies between shared experiences and the deception within societies. \n\nNote, for top marks, an introduction should do the following:\n\n- Have a strong thesis statement that engages with the question originally with a strong writers voice and flair (should not simply re-write question)\n- Introduce the main themes and texts to set up the essay\n- Should engage thoroughly with the question terms and unpack the meaning in the question\n- Mention form and context where appropriate\n- Exhibits strong use of active language and is written with sophistication and a logical flow of ideas\n- End with a strong concluding sentence\n\nFollow the exact same structure as the exemplar introduction, starting with a macrothesis that engages directly with the question and its terms, then introduce the text, form, context and the first theme, then transition into the next theme, then conclude the introduction with a strong concluding sentence. It should only be 4 sentences long."
          },
          {
            "role": "assistant",
            "content": "Emerging as both a strategy and a snare in the labyrinthine web of human interactions, deception invites a profound reevaluation of trust and authenticity. William Shakespeare's seminal comedy 'The Merchant of Venice,' composed between 1596 and 1599 and set against the bustling backdrop of Renaissance Venice, artfully unravels disguise, manipulation, and the moral ambiguity intertwining in human relationships. Shakespeare explores the multifaceted nature of deception within a society marked by religious tension, legal intrigue, and personal ambition, compelling us to confront the often-blurred lines between right and wrong, true and false. 'The Merchant of Venice' casts a reflective mirror, spotlighting the intricate dance of deception, challenging our preconceptions, and urging a reexamination of sincerity in a world filled with masks and masquerades."
          },
        {
            "role": "user",
            "content": `Question submitted by student: \n\n${question}\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will then re-write like an exemplar response:\n\n${paragraph}`
        }
      ];
  
      // Make the API call
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.25,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log("Response from OpenAI API:", response);
        const rewrittenContent = response.data.choices[0].message.content.trim();
        console.log("Rewritten Content:", rewrittenContent);
        return rewrittenContent;

    }
    else if (paragraphType == "Body Paragraph") {
        const messages = [
            {
                "role": "system",
                "content": "You are an English essay assistant. You are to re-write body paragraphs of submitted students essays to questions. You will do this in reference to exemplar responses provided by the assistant."
              },
              {
                "role": "user",
                "content": "Question submitted by student: \n\nTo what extent does the exploration of human experience in The Crucible invite you to reconsider your understanding of love?\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will identify re-write like an exemplar response:\n\nArthur Miller the Author of the play introduces the audience to human experiences that play big roles within love the main one being infidelity. Miller touches on this particular experience when we discover that John Proctor has been having an affair with his maid Abigail Williams. Proctor is soon to shut down the affair leaving Abigail angry and upset. When the time comes about the witch trials Abigal is quick to point fingers at Judy. Johns wife to say that she has been witched as a payback for John leaving her. Throughout the trials we see Abigail still trying to win proctor over by claiming he is innocent in hopes that Proctor will leave his wife and get together with her. When this plan of hers fails she doesn't hesitate to throw proctor under the bus and gets him locked up. In the midst of all this Abigail says to Proctor \"I opened my heart up to you… I let the light of God in for you\" as an expression of her feelings for him in an attempt to change his mind and run away with her. Abigail being manipulative and bitchy doesn't help her argument when trying to convince Proctor of what he should do.\n\nFor top marks, a body paragraph should do the following:\n\n- Have a strong topic sentence and concluding sentence that unpacks and addresses the question terms effectively\n- Should engage thoroughly with the question terms during analysis and when linking back to the question\n- Should present 4 -5 pieces of evidence, with quotes seamlessly integrated into analysis\n- Use meta techniques like motifs, symbols, form, tone etc\n- Engages with the form and context of the text\n- Exhibits strong use of active language and is written with sophistication and a logical flow of ideas, with an emphasis on writers voice (begins sentences with verb)\n\nThe final body paragraph should follow the exact same structure as the exemplar with a strong topic sentence that introduce the idea of the paragraph, leading into 5 - 6 pieces of evidence (including textual evidence in quotes) and analysis that weaves context and form as necessary, ending with a strong concluding sentence. The final body paragraph should be between 7 - 9 sentences long."
              },
              {
                "role": "assistant",
                "content": "Unveiling love's multifaceted nature through the complex relationships in 'The Crucible,' Arthur Miller prompts a profound reassessment of human emotions, intertwined with personal integrity and social norms. Embodying the complexity of love and infidelity is the tragic relationship between John Proctor and Abigail Williams, symbolized through motifs of fire and darkness. Revealing Proctor's furtive affair with Abigail, the line \"I opened my heart up to you... I let the light of God in for you\" epitomizes Abigail's intense affection. Shattering the illusion of pure love, Proctor's declaration, \"You'll speak nothin' of Elizabeth!\" triggers a chain of events that unveil the destructive power of obsession and manipulation. Pursuing Proctor relentlessly, Abigail's false accusations against his wife paint a bleak picture of love marred by vengeance. The court's authority, symbolized by Judge Danforth's stance, \"A person is either with this court or he must be counted against it,\" tests love and loyalty against societal pressures. Through the play's dialogue and mounting tension, Miller uses the dramatic form to weave a rich tapestry redefining love as not merely a romantic notion but a complex human experience. Refusing to abandon his integrity and betray his spouse, Proctor's final cry, \"I want my life,\" becomes a poignant testament to the transcendent power of genuine love and commitment. Thus, in 'The Crucible,' the profound exploration of love's multifaceted nature challenges the audience to reconsider the essence of love, elevating it into a broader discourse on morality, integrity, and the human condition."
              },
              {
                "role": "user",
                "content": "Question submitted by student: \n\nTo what extent does the exploration of human experience in The Merchant of Venice invite you to reconsider your understanding of deception?\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will then re-write like an exemplar response:\n\nLove is a key feature of the play demonstrating the romantic love between Portia and Bassanio, the platonic love between Bassanio and Antonio and Jessica's experiences. Deception is first introduced early in the play through Bassanio's impure love for Portia. This is evident in her depiction as \"a lady richly left, and she is fair\". Portia's first mention in the play evaluates her based on her wealth and appearance, evident in the adjectives \"richly\" and \"fair\". Bassanio also expresses pure love for Antonio, stating, \"To you, Antonio, I owe the most in money and in love\". This modality language \"the most\" suggests that his friendship with Antonio is superior to all else, directly conflicting the previous point about his relationship with Portia. This uncertainty forces the reader to question who is being deceived. Love is also shown to have a pure form in the play, evident in Jessica and Lorenzo's love, stating \"for whom, love I so much\". The Merchant of Venice also portrays the opposing lack of love between Jessica and her father; which is a parental child relationship where love should be unconditional, however, Jessica states \"what heinous sin is it in me to be ashamed to be my father's child\". The religious imagery \"heinous sin\" makes evident how strongly Jessica feels about her father, as Shakespeare demonstrates the continuation of troubled conflicting relationships. \n\nFor top marks, a body paragraph should do the following:\n\n- Have a strong topic sentence and concluding sentence that unpacks and addresses the question terms effectively\n- Should engage thoroughly with the question terms during analysis and when linking back to the question\n- Should present 4 -5 pieces of evidence, with quotes seamlessly integrated into analysis\n- Use meta techniques like motifs, symbols, form, tone, etc.\n- Engages with the form and context of the text\n- Exhibits strong use of active language and is written with sophistication and a logical flow of ideas, with an emphasis on writers' voice (begins sentences with a verb)\n\nThe final body paragraph should follow the exact same structure as the exemplar with a strong topic sentence that introduces the idea of the paragraph, leading into 5 - 6 pieces of evidence (including textual evidence in quotes) and analysis that weaves context and form as necessary, ending with a strong concluding sentence. The final body paragraph should be between 7 - 9 sentences long."
              },
              {
                "role": "assistant",
                "content": "Exploring the theme of deception in 'The Merchant of Venice,' Shakespeare's intricate structure offers a profound examination of love's complexities, inviting the audience to reflect on sincerity, illusion, and the human condition. Using juxtaposition, the play contrasts Bassanio's superficial love for Portia, described as \"a lady richly left, and she is fair,\" with his selfless friendship for Antonio, proclaimed in \"To you Antonio, I owe the most in money and in love.\" Through this, Shakespeare challenges the reader's perception of genuine love versus self-interested attachment. In the subplot, Jessica and Lorenzo's sincere affection is captured in \"for whom, love I so much,\" while Jessica's words \"what heinous sin is it in me to be ashamed to be my father's child\" reveal a painful familial disconnect, reflecting on a broader theme of love's duality. The play's dramatic form, including the use of soliloquies and asides, enhances this exploration by allowing characters to reveal their innermost thoughts and intentions. By strategically employing these elements within the overall narrative structure, Shakespeare crafts a multifaceted exploration of love and deception, raising questions about authenticity and manipulation. The distinct tone in different scenes, from romantic to tragic, further accentuates the theme, offering an unvarnished examination of human emotions. Through 'The Merchant of Venice,' the reader is prompted to reflect on love's purity and deceit, recognizing the inherent contradictions that define human interactions, and engaging in a deeper analysis enabled by the play's complex structure, form, and tone."
              },
              {
                "role": "user",
                "content": `Question submitted by student: \n\n${question}\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will then re-write like an exemplar response:\n\n${paragraph}\n\nFor top marks, a body paragraph should do the following:\n\n- Have a strong topic sentence and concluding sentence that unpacks and addresses the question terms effectively\n- Should engage thoroughly with the question terms during analysis and when linking back to the question\n- Should present 4 -5 pieces of evidence, with quotes seamlessly integrated into analysis\n- Use meta techniques like motifs, symbols, form, tone etc\n- Engages with the form and context of the text\n- Exhibits strong use of active language and is written with sophistication and a logical flow of ideas, with an emphasis on writers voice (begins sentences with verb)\n\nThe final body paragraph should follow the exact same structure as the exemplar with a strong topic sentence that introduce the idea of the paragraph, leading into 5 - 6 pieces of evidence (including textual evidence in quotes) and analysis that weaves context and form as necessary, ending with a strong concluding sentence. The final body paragraph should be between 7 - 9 sentences long. ADD QUOTES AND NEW EVIDENCE TO THE PARAGRAPH IF NECESSARY.`
              }
          ]

          const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.25,
            max_tokens: 600,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          console.log("Response from OpenAI API:", response);
        const rewrittenContent = response.data.choices[0].message.content.trim();
        console.log("Rewritten Content:", rewrittenContent);
        return rewrittenContent;

    }
    else if (paragraphType == "Conclusion") {
        const messages = [
            {
                "role": "system",
                "content": "You are an English essay assistant. You are to re-write paragraphs of submitted students essays to questions. You will do this in reference to a exemplar responses provided by the assistant."
              },
              {
                "role": "user",
                "content": "Question submitted by student: \n\nTo what extent does the exploration of human experience in The Crucible invite you to reconsider your understanding of love?\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will identify re-write like an exemplar response:\n\nIn conclusion, Arthur Miller's \"The Crucible\" presents a multifaceted exploration of love\n\nFor top marks, a conclusion should do the following:\n\nBegin with a synthesized statement that encapsulates the core argument or theme, elegantly summarizing the key insights and directly connecting to the question or prompt. This statement should reflect both the content and context of the text in a way that ties together the entire analysis.\nConclude with a powerful and resonant sentence that extends the central idea, emphasizing its broader implications or enduring relevance. This sentence should leave a lasting impression, reinforcing the main argument and resonating with the reader's understanding of the subject.\nThe final conclusion should succinctly embody these two qualities, providing a fitting closure to the essay by cohesively drawing together the primary points in a manner that is both concise and profound. The final conclusion should only be 2 sentences long at most."
              },
              {
                "role": "assistant",
                "content": "Ultimately, \"The Crucible\" serves as a profound exploration of love's multifaceted nature, unraveling its complexity through characters and conflicts that echo across historical and moral landscapes. Thus, Miller's dramatic craftsmanship invites a deeper reconsideration of love, transforming it from mere sentimentality into an enduring dialogue on human integrity and emotions."
              },
              {
                "role": "user",
                "content": `Question submitted by student: \n\n${question}\n\nThe essay is being split into each paragraph. The following is one of the paragraphs which you will then re-write like an exemplar response:\n\n${paragraph}`
              }
          ];
        
          // Make the API call
          const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.5,
            max_tokens: 200, // Conclusions are shorter, so we can reduce the max_tokens
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          console.log("Response from OpenAI API:", response);
        const rewrittenContent = response.data.choices[0].message.content.trim();
        console.log("Rewritten Content:", rewrittenContent);
        return rewrittenContent;

    }
    else {
        console.log("Error: couldn't determine paragraph type.");
    }
  
  }
  

  /* async function rewriteParagraph(paragraph, paragraphType, question) {

    // Get the next API key for this request
    const OPENAI_API_KEY = getNextApiKey();

    // Create a configuration for this request
    const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    console.log("Paragraph Type:", paragraphType);
    console.log("Question:", question);
    console.log("Paragraph:", paragraph);

    if (paragraphType == "Introduction") {
      // Prepare the messages for the API call
      const messages = [REMOVED CAUSE TOO LONG
      ];
  
      // Make the API call
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.25,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response);
  
      // Return the result from the API response
      return response.data.choices[0].message.content.trim();

    }
    else if (paragraphType == "Body Paragraph") {
        const messages = [REMOVED CAUSE TOO LONG
          ]

          const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.25,
            max_tokens: 600,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          console.log(response);
        
          // Return the result from the API response
          return response.data.choices[0].message.content.trim();

    }
    else if (paragraphType == "Conclusion") {
        const messages = [REMOVED CAUSE TOO LONG
          ];
        
          // Make the API call
          const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.5,
            max_tokens: 200, // Conclusions are shorter, so we can reduce the max_tokens
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          console.log(response);
        
          // Return the result from the API response
          return response.data.choices[0].message.content.trim();

    }
    else {
        console.log("Error: couldn't determine paragraph type.");
    }
  
  } */