async function handleEssaySubmit() {
    const essayText = document.getElementById('essay').value;
    const questionText = document.getElementById('question').value;
    const essayDisplayDiv = document.getElementById('essay-display');
    const suggestionsContainerDiv = document.getElementById('suggestions-container');


  
    // Reset the essay output
    essayDisplayDiv.innerHTML = '';
    suggestionsContainerDiv.innerHTML = '';

    document.getElementById('loading').classList.remove('hidden');
    

    // Show the progress container when submitting
    // progressContainer.style.display = 'block';
  
    try {
        const response = await fetch('/api/essay', { ///http://localhost:3000/analyze-essay
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ essay: essayText, question: questionText }),
        });
      
        if (!response.ok) {
          throw new Error('Failed to analyze the essay');
        }
      
        const result = await response.json();
      
        // Check if rewrittenParagraphs is defined (changed from rewrittenEssay)
        if (result.rewrittenParagraphs) {
          const originalParagraphs = essayText.split('\n\n');
          const improvedParagraphs = result.rewrittenParagraphs.filter(paragraph => paragraph.trim() !== '');

      
          // console.log('Original Paragraphs:', originalParagraphs);
          // console.log('Improved Paragraphs:', improvedParagraphs);
      
          if (originalParagraphs.length !== improvedParagraphs.length) {
            console.error('Mismatch in the number of original and improved paragraphs');
            return;
          }
    

          originalParagraphs.forEach((paragraph, index) => {
            const paragraphElement = document.createElement('p');
            paragraphElement.textContent = paragraph.trim(); // Trim any extra whitespace
            paragraphElement.style.marginBottom = '1em'; // Add spacing between paragraphs
            paragraphElement.onmouseover = () => {
              // Remove highlight from other paragraphs
              document.querySelectorAll('#essay-display p').forEach(p => {
                p.classList.remove('highlighted-paragraph'); // Remove the highlight class
              });
          
              // Add highlight to the hovered paragraph
              paragraphElement.classList.add('highlighted-paragraph'); // Add the highlight class
          
              // Handle showing the suggestion
              handleParagraphHover(index, improvedParagraphs); // Use the improvedParagraphs array
            };
            essayDisplayDiv.appendChild(paragraphElement);
          });
          
  
        } else {
          console.error('Unexpected server response:', result);
        }
        document.getElementById('loading').classList.add('hidden');
        
      } catch (error) {
        document.getElementById('loading').classList.add('hidden');
        console.error('An error occurred while analyzing the essay:', error);
        alert('An error occurred while analyzing the essay: ' + error.message);
      }
      
  }
  
  function handleParagraphHover(index, rewrittenParagraphs) {
    const suggestionsDiv = document.getElementById('suggestions-container'); // Correct the ID
    suggestionsDiv.innerHTML = ''; // Clear previous suggestions
  
    const improvedParagraph = rewrittenParagraphs[index];
    if (improvedParagraph) {
      const suggestionElement = document.createElement('p');
      suggestionElement.textContent = improvedParagraph;
      suggestionsDiv.appendChild(suggestionElement);
    }
  }
  
  