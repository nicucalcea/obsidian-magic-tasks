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
  }
}