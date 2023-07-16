import { Plugin, Editor } from 'obsidian';

export default class MyPlugin extends Plugin {
  private activeEditor: Editor | null = null;

  async onload() {
    this.registerDomEvent(document, 'DOMNodeInserted', this.handleDomMutation);
  }

  handleDomMutation = (event: MutationEvent) => {
    if (!(event.target instanceof HTMLElement)) return;

    // Check if the inserted node has the suggestion-container class
    if (event.target.classList.contains('suggestion-container')) {
      this.appendSuggestionItem(event.target);
    }
  };

  appendSuggestionItem(container: HTMLElement) {
    // Create a new suggestion item element
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.textContent = 'New Suggestion Item';

    // Add a click event listener to the suggestion item
    suggestionItem.addEventListener('click', async () => {
      await this.handleSuggestionItemSelected();
    });

    // Append the suggestion item to the suggestion container
    const suggestionContainer = container.querySelector('.suggestion');
    if (suggestionContainer) {
      suggestionContainer.appendChild(suggestionItem);
    }
  }

  async handleSuggestionItemSelected() {
    console.log('Suggestion item selected!');

    // Get the text contents of a div with the class `.cm-active`
    const activeDiv = document.querySelector('.cm-active');
    const activeText = activeDiv ? activeDiv.textContent : '';

    // Make API request to OpenAI to get subtasks breakdown
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-XXX', // Replace with your actual API key
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            {"role": "system", "content": "You are a helpful assistant that responds with markdown-formatted tasks in the format `- [ ] This is a task`. Please only respond with tasks, no other text."},
            {"role": "user", "content": `Create sub-tasks for this task: ${activeText}`} // Append activeText to the user message
          ]
        }),
      });

      if (!response.ok) {
        console.error('Error sending request to OpenAI API');
        return;
      }

      const data = await response.json();
      console.log(data);
      const subtasks = data.choices[0].message.content;

      console.log('Subtasks breakdown:');
      console.log(subtasks);

      // Append the subtasks to the active editor
      if (this.activeEditor) {
        this.activeEditor.replaceSelection('\n\n' + subtasks);
      }
    } catch (error) {
      console.error('Error fetching data from OpenAI API:', error);
    }
  }

  onunload() {
    this.activeEditor = null;
  }

  async onEditorChange(editor: Editor) {
    this.activeEditor = editor;
  }
}
