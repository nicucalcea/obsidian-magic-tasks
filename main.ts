import { Plugin, Editor, MarkdownView } from "obsidian";
import { MagicTasksSettingTab } from "./settings";

// Modify this with your actual OpenAI API endpoint URL
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// selects the entire line from index zero
function selectLine(editor: Editor) {
  const { line } = editor.getCursor();
  const lineText = editor.getLine(line);
  editor.setSelection({ line, ch: 0 }, { line, ch: lineText.length });
}

interface MagicTasksPluginSettings {
  openaiKey: string;
  ollama_url: string;
  ollama_model: string;
  api_select: string;
}

const DEFAULT_SETTINGS: Partial<MagicTasksPluginSettings> = {
  openaiKey: "sk-XXXXXX",
  ollama_url: "http://127.0.0.1:11434",
  ollama_model: "llama3",
  api_select: "openai"
};

export default class MagicTasksPlugin extends Plugin {
  settings: MagicTasksPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new MagicTasksSettingTab(this.app, this));

    this.addCommand({
      id: 'break-down-task',
      name: 'break down task into subtasks',
      hotkeys: [{ modifiers: ["Mod"], key: "m" }],
      editorCallback: async (editor: Editor) => {
        selectLine(editor);
        const selectedText = editor.getSelection();
        // console.log('Selected Text:', selectedText);
        const subtasks = await this.sendToModel(selectedText);
        this.insertIndentedSubtasks(editor, subtasks);
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  insertIndentedSubtasks(editor: Editor, subtasks: string) {
    const indentedSubtasks = subtasks
      .split('\n')
      .map((line) => `\t${line}`)
      .join('\n');

    const { line } = editor.getCursor();
    editor.replaceSelection(`${editor.getSelection()}\n${indentedSubtasks}`);
  }

  onunload() { }

  async sendToModel(text: string): Promise<string> {
    try {
      // console.log('Sending to OpenAI:', text);
      let endpoint = '';
      let headers: {[key: string]: string} = {
        'Content-Type': 'application/json'
      };
      let model = '';

      if (this.settings.api_select === 'openai') {
        endpoint = OPENAI_API_ENDPOINT;
        headers['Authorization'] = `Bearer ${this.settings.openaiKey}`;
        model = "gpt-3.5-turbo";
      } else if (this.settings.api_select === 'ollama') {
        endpoint = this.settings.ollama_url + 'v1/chat/completions';
        model = this.settings.ollama_model;
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          "model": model,
          "messages": [
            { "role": "system", "content": "You are a helpful assistant that responds with markdown-formatted tasks in the format `- [ ] This is a subtask`. Please only respond with tasks, no other text." },
            { "role": "user", "content": `Please break down the following task into smaller subtasks: ${text}` } // Append selectedText to the user message
          ]
        }),
      });

      if (!response.ok) {
        console.error('Error sending request to model');
        return '';
      }

      const data = await response.json();
      const subtasks = data.choices[0].message.content;
      return subtasks;
    // console.log('OpenAI data:', subtasks);
    } catch (error) {
      console.error('Error while calling OpenAI API:', error);
      return '';
    }
  }
}
