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
}

const DEFAULT_SETTINGS: Partial<MagicTasksPluginSettings> = {
  openaiKey: "sk-XXXXXX",
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
        const subtasks = await this.sendToOpenAI(selectedText);
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

  async sendToOpenAI(text: string): Promise<string> {
    try {
      // console.log('Sending to OpenAI:', text);
      const response = await fetch(OPENAI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.settings.openaiKey}`,
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            { "role": "system", "content": "You are a helpful assistant that responds with markdown-formatted tasks in the format `- [ ] This is a subtask`. Please only respond with tasks, no other text." },
            { "role": "user", "content": `Please break down the following task into smaller subtasks: ${text}` } // Append selectedText to the user message
          ]
        }),
      });

      if (!response.ok) {
        console.error('Error sending request to OpenAI API');
        return '';
      }

      const data = await response.json();
      const subtasks = data.choices[0].message.content;
      // console.log('OpenAI data:', subtasks);
      return subtasks;
    } catch (error) {
      console.error('Error while calling OpenAI API:', error);
      return '';
    }
  }
}