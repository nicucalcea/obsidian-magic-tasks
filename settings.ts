import MagicTasksPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class MagicTasksSettingTab extends PluginSettingTab {
  plugin: MagicTasksPlugin;

  constructor(app: App, plugin: MagicTasksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("OpenAI API Key")
      .setDesc("Provide your key to use the OpenAI API")
      .addText((text) =>
        text
          .setPlaceholder("sk-XXXXXX")
          .setValue(this.plugin.settings.openaiKey)
          .onChange(async (value) => {
            this.plugin.settings.openaiKey = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
    .setName("Ollama URL")
    .setDesc("Provide the URL for the Ollama API")
    .addText((text) =>
      text
        .setPlaceholder("http://127.0.0.1:11434")
        .setValue(this.plugin.settings.ollama_url)
        .onChange(async (value) => {
          this.plugin.settings.ollama_url = value;
          await this.plugin.saveSettings();
        })
    );

    new Setting(containerEl)
      .setName("Ollama Model")
      .setDesc("Provide the name of the Ollama model")
      .addText((text) =>
        text
          .setPlaceholder("llama3")
          .setValue(this.plugin.settings.ollama_model)
          .onChange(async (value) => {
            this.plugin.settings.ollama_model = value;
            await this.plugin.saveSettings();
          })
    );

  new Setting(containerEl)
    .setName("API Provider")
    .setDesc("Select the API provider")
    .addDropdown((dropdown) =>
      dropdown
        .addOption("openai", "OpenAI")
        .addOption("ollama", "Ollama")
        .setValue(this.plugin.settings.api_select || "openai")
        .onChange(async (value) => {
          this.plugin.settings.api_select = value;
          await this.plugin.saveSettings();
          this.display();
        })
    );
  }
}
